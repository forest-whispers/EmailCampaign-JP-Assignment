import { prisma } from "@/shared/config/db.js";
import { NotFoundError } from "@/shared/errors/errors.js";
import { sendEmail } from "@/shared/lib/mailer.js";
import { env } from "@/shared/config/env.js";
import type {
    CreateCampaignInput,
    SendCampaignInput,
    SkippedLead,
    UpdateCampaignInput
} from "./campaign.types.js";

const personalizeMessage = (
    message: string,
    lead: {
        buyerName: string | null
        companyName: string | null
        email: string | null
        website: string | null
        country: string | null
    }
) =>
{
    const username = lead.buyerName || lead.companyName || "there"

    return message
        .replaceAll("{username}", username)
        .replaceAll("{companyName}", lead.companyName || "")
        .replaceAll("{email}", lead.email || "")
        .replaceAll("{website}", lead.website || "")
        .replaceAll("{country}", lead.country || "")
}

export const createCampaignService = async ({
    name,
    classification,
    subject,
    emailMessage
}: CreateCampaignInput) =>
{
    return prisma.campaign.create({
        data: {
            name,
            classification,
            subject,
            emailMessage
        }
    })
}

export const listCampaignsService = async () =>
{
    return prisma.campaign.findMany({
        orderBy: {
            createdAt: "desc"
        }
    })
}

export const getCampaignService = async (id: string) =>
{
    const campaign = await prisma.campaign.findUnique({
        where: {
            id
        }
    })

    if(!campaign)
    {
        throw new NotFoundError("Campaign not found")
    }

    return campaign
}

export const updateCampaignService = async (
    id: string,
    updates: UpdateCampaignInput
) =>
{
    const existingCampaign = await prisma.campaign.findUnique({
        where: {
            id
        }
    })

    if(!existingCampaign)
    {
        throw new NotFoundError("Campaign not found")
    }

    const allowedUpdates = [
        "name",
        "classification",
        "subject",
        "emailMessage"
    ] as const

    const data: Record<string, unknown> = {}

    for(const field of allowedUpdates)
    {
        if(field in updates)
        {
            data[field] = updates[field as keyof UpdateCampaignInput]
        }
    }

    return prisma.campaign.update({
        where: {
            id
        },
        data
    })
}

export const deleteCampaignService = async (id: string) =>
{
    const existingCampaign = await prisma.campaign.findUnique({
        where: {
            id
        }
    })

    if(!existingCampaign)
    {
        throw new NotFoundError("Campaign not found")
    }

    await prisma.campaign.delete({
        where: {
            id
        }
    })

    return {
        message: "Campaign deleted successfully"
    }
}

export const sendCampaignService = async (
    id: string,
    { leadIds }: SendCampaignInput
) =>
{
    const campaign = await prisma.campaign.findUnique({
        where: {
            id
        }
    })

    if(!campaign)
    {
        throw new NotFoundError("Campaign not found")
    }

    const leads = await prisma.lead.findMany({
        where: {
            id: {
                in: leadIds
            }
        },
        select: {
            id: true,
            buyerName: true,
            companyName: true,
            email: true,
            website: true,
            country: true,
            emailStatus: true,
            classification: true
        }
    })

    const skipped: SkippedLead[] = []

    const foundLeadIds = new Set(
        leads.map((lead) => lead.id)
    )

    for(const leadId of leadIds)
    {
        if(!foundLeadIds.has(leadId))
        {
            skipped.push({
                leadId,
                reason: "Lead not found"
            })
        }
    }

    const eligibleLeads = []

    for(const lead of leads)
    {
        if(lead.emailStatus !== "VALID")
        {
            skipped.push({
                leadId: lead.id,
                reason: "Invalid email"
            })

            continue
        }

        if(!lead.email)
        {
            skipped.push({
                leadId: lead.id,
                reason: "Email is missing"
            })

            continue
        }

        if(lead.classification !== campaign.classification)
        {
            skipped.push({
                leadId: lead.id,
                reason: "Lead classification does not match campaign"
            })

            continue
        }

        eligibleLeads.push(lead)
    }

    if(eligibleLeads.length === 0)
    {
        return {
            sentCount: 0,
            skippedCount: skipped.length,
            skipped
        }
    }

    const existingRecipients = await prisma.campaignRecipient.findMany({
        where: {
            campaignId: id,
            leadId: {
                in: eligibleLeads.map((lead) => lead.id)
            }
        }
    })

    const recipientMap = new Map(
        existingRecipients.map((recipient) => [
            recipient.leadId,
            recipient
        ])
    )

    for(const lead of eligibleLeads)
    {
        const existingRecipient = recipientMap.get(lead.id)

        if(
            existingRecipient &&
            existingRecipient.status === "SENT"
        )
        {
            skipped.push({
                leadId: lead.id,
                reason: "Already sent"
            })
        }
    }

    const leadsToSend = eligibleLeads.filter((lead) =>
    {
        const recipient = recipientMap.get(lead.id)

        return !recipient || recipient.status === "FAILED"
    })

    let sentCount = 0

    for(const lead of leadsToSend)
    {
        let recipient = recipientMap.get(lead.id)

        if(!recipient)
        {
            recipient = await prisma.campaignRecipient.create({
                data: {
                    campaignId: id,
                    leadId: lead.id,
                    status: "PENDING"
                }
            })
        }
        else
        {
            await prisma.campaignRecipient.update({
                where: {
                    id: recipient.id
                },
                data: {
                    status: "PENDING",
                    errorMessage: null
                }
            })
        }

        try
        {
            const personalizedMessage = personalizeMessage(
                campaign.emailMessage,
                lead
            )

            await sendEmail({
                to: lead.email!,
                subject: campaign.subject,
                text: personalizedMessage,
                attachmentPath: env.PRESENTATION_PATH
            })

            await prisma.campaignRecipient.update({
                where: {
                    id: recipient.id
                },
                data: {
                    status: "SENT",
                    sentAt: new Date(),
                    errorMessage: null
                }
            })

            sentCount++
        }
        catch(error)
        {
            const errorMessage = error instanceof Error
                ? error.message
                : "Email sending failed"

            await prisma.campaignRecipient.update({
                where: {
                    id: recipient.id
                },
                data: {
                    status: "FAILED",
                    errorMessage
                }
            })
        }
    }

    return {
        sentCount,
        skippedCount: skipped.length,
        skipped
    }
}