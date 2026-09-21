import { prisma } from "@/shared/config/db.js";
import { classifyLeadsWithAi } from "./classification.ai.js";
import { constants } from "./classification.constants.js";

export const classifyLeadsService = async () =>
{
    const leads = await prisma.lead.findMany({
        where: {
            classification: null,
            emailStatus: "VALID"
        },
        orderBy: {
            createdAt: "asc"
        },
        take: constants.CLASSIFICATION_BATCH_SIZE,
        select: {
            id: true,
            buyerName: true,
            companyName: true,
            email: true,
            website: true,
            country: true
        }
    })

    if(leads.length === 0)
    {
        return {
            processedCount: 0,
            classifications: []
        }
    }

    const classifications = await classifyLeadsWithAi(leads)

    const validLeadIds = new Set(leads.map((lead) => lead.id))

    const validClassifications = classifications.filter((item) =>
    {
        return (
            validLeadIds.has(item.id) &&
            (item.classification === "BUSINESS" || item.classification === "INDIVIDUAL")
        )
    })

    await prisma.$transaction(
        validClassifications.map((item) =>
            prisma.lead.update({
                where: {
                    id: item.id
                },
                data: {
                    classification: item.classification
                }
            })
        )
    )

    return {
        processedCount: validClassifications.length,
        classifications: validClassifications
    }
}