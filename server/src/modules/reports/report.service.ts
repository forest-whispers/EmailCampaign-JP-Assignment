import { prisma } from "@/shared/config/db.js";

export const getReportService = async () =>
{
    const [
        totalLeads,
        validEmails,
        invalidEmails,
        missingEmails,
        businessLeads,
        individualLeads,
        unclassifiedLeads,
        sourceBreakdown,
        totalCampaigns,
        sentEmails,
        failedEmails,
        pendingEmails
    ] = await Promise.all([
        prisma.lead.count(),

        prisma.lead.count({
            where: {
                emailStatus: "VALID"
            }
        }),

        prisma.lead.count({
            where: {
                emailStatus: "INVALID"
            }
        }),

        prisma.lead.count({
            where: {
                emailStatus: "MISSING"
            }
        }),

        prisma.lead.count({
            where: {
                classification: "BUSINESS"
            }
        }),

        prisma.lead.count({
            where: {
                classification: "INDIVIDUAL"
            }
        }),

        prisma.lead.count({
            where: {
                classification: null
            }
        }),

        prisma.lead.groupBy({
            by: ["source"],
            _count: {
                _all: true
            }
        }),

        prisma.campaign.count(),

        prisma.campaignRecipient.count({
            where: {
                status: "SENT"
            }
        }),

        prisma.campaignRecipient.count({
            where: {
                status: "FAILED"
            }
        }),

        prisma.campaignRecipient.count({
            where: {
                status: "PENDING"
            }
        })
    ])

    return {
        leads: {
            total: totalLeads,

            emailStatus: {
                valid: validEmails,
                invalid: invalidEmails,
                missing: missingEmails
            },

            classification: {
                business: businessLeads,
                individual: individualLeads,
                unclassified: unclassifiedLeads
            },

            sources: sourceBreakdown.map((item) =>
            {
                return {
                    source: item.source,
                    count: item._count._all
                }
            })
        },

        campaigns: {
            total: totalCampaigns
        },

        emailSending: {
            sent: sentEmails,
            failed: failedEmails,
            pending: pendingEmails
        }
    }
}