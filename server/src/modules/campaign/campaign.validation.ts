import { z } from "zod";

export const createCampaignSchema = z.object({
    name: z.string().trim().min(1),
    classification: z.enum([
        "BUSINESS",
        "INDIVIDUAL"
    ]),
    subject: z.string().trim().min(1),
    emailMessage: z.string().trim().min(1)
})

export const updateCampaignSchema = createCampaignSchema.partial()

export const campaignIdSchema = z.object({
    id: z.string().uuid()
})

export const sendCampaignSchema = z.object({
    leadIds: z.array(z.string().uuid()).min(1)
})