import { prisma } from "@/shared/config/db.js";
import { NotFoundError } from "@/shared/errors/errors.js";
import type { CreateLeadsInput, LeadListQuery, UpdateLeadInput } from "./lead.types.js";

const isValidEmail = (email: string) =>
{
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const getEmailStatus = (email?: string | null) =>
{
    if(!email)
    {
        return "MISSING" as const
    }

    if(!isValidEmail(email))
    {
        return "INVALID" as const
    }

    return "VALID" as const
}

export const createLeadsService = async ({ leads }: CreateLeadsInput) =>
{
    const normalizedLeads = leads.map((lead) =>
    {
        const email = lead.email?.trim().toLowerCase() || null
        return {
            ...lead,
            buyerName: lead.buyerName?.trim() || null,
            companyName: lead.companyName?.trim() || null,
            email,
            website: lead.website?.trim() || null,
            country: lead.country?.trim() || null,
            emailStatus: getEmailStatus(email)
        }
    })

    const uniqueLeads = new Map<string, typeof normalizedLeads[number]>()
    const skipped = []

    for(const lead of normalizedLeads)
    {
        if(lead.email)
        {
            if(uniqueLeads.has(lead.email))
            {
                skipped.push({
                    email: lead.email,
                    reason: "Duplicate in request"
                })

                continue
            }

            uniqueLeads.set(lead.email, lead)
        }
        else
        {
            uniqueLeads.set(`missing-${uniqueLeads.size}`, lead)
        }
    }

    const leadsToCheck = [...uniqueLeads.values()].filter((lead) => lead.email)

    const existingLeads = await prisma.lead.findMany({
        where: {
            email: {
                in: leadsToCheck.map((lead) => lead.email!)
            }
        },
        select: {
            email: true
        }
    })

    const existingEmails = new Set(existingLeads.map((lead) => lead.email))

    const leadsToCreate = [...uniqueLeads.values()].filter((lead) =>
    {
        if(lead.email && existingEmails.has(lead.email))
        {
            skipped.push({
                email: lead.email,
                reason: "Lead already exists"
            })

            return false
        }

        return true
    })

    const created = await prisma.lead.createMany({
        data: leadsToCreate
    })

    return {
        createdCount: created.count,
        skippedCount: skipped.length,
        skipped
    }
}

export const listLeadsService = async ({
    page,
    limit,
    search,
    source,
    emailStatus,
    classification
}: LeadListQuery) =>
{
    const skip = (page - 1) * limit

    const where = {
        ...(source && {
            source
        }),

        ...(emailStatus && {
            emailStatus
        }),

        ...(classification && {
            classification
        }),

        ...(search && {
            OR: [
                {
                    buyerName: {
                        contains: search,
                        mode: "insensitive" as const
                    }
                },
                {
                    companyName: {
                        contains: search,
                        mode: "insensitive" as const
                    }
                },
                {
                    email: {
                        contains: search,
                        mode: "insensitive" as const
                    }
                }
            ]
        })
    }

    const [leads, total] = await Promise.all([
        prisma.lead.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                createdAt: "desc"
            }
        }),

        prisma.lead.count({
            where
        })
    ])

    return {
        leads,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    }
}

export const getLeadService = async (id: string) =>
{
    const lead = await prisma.lead.findUnique({
        where: {
            id
        }
    })

    if(!lead)
    {
        throw new NotFoundError("Lead not found")
    }

    return lead
}

export const updateLeadService = async (
    id: string,
    updates: UpdateLeadInput
) =>
{
    const existingLead = await prisma.lead.findUnique({
        where: {
            id
        }
    })

    if(!existingLead)
    {
        throw new NotFoundError("Lead not found")
    }

    const allowedUpdates = [
        "buyerName",
        "companyName",
        "email",
        "website",
        "country",
        "source",
        "emailStatus",
        "classification"
    ] as const

    const data: Record<string, unknown> = {}

    for(const field of allowedUpdates)
    {
        if(field in updates)
        {
            data[field] = updates[field as keyof UpdateLeadInput]
        }
    }

    if("email" in updates)
    {
        const email = updates.email?.trim().toLowerCase() || null

        data.email = email

        if(!("emailStatus" in updates))
        {
            data.emailStatus = getEmailStatus(email)
        }
    }

    return prisma.lead.update({
        where: {
            id
        },
        data
    })
}

export const deleteLeadsService = async (leadIds: string[]) =>
{
    const result = await prisma.lead.deleteMany({
        where: {
            id: {
                in: leadIds
            }
        }
    })

    return {
        deletedCount: result.count
    }
}