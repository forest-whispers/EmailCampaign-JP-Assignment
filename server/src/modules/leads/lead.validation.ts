import { z } from "zod";

const leadSchema = z.object({
    buyerName: z.string().trim().min(1).optional(),
    companyName: z.string().trim().min(1).optional(),
    email: z.string().trim().optional().nullable(),
    website: z.string().trim().optional(),
    country: z.string().trim().min(1).optional(),
    source: z.enum([
        "GOOGLE",
        "FACEBOOK",
        "LINKEDIN",
        "DIRECTORY",
        "WEBSITE",
        "CSV",
        "OTHER"
    ])
})

export const createLeadsSchema = z.object({
    leads: z.array(leadSchema).min(1)
})

export const updateLeadSchema = leadSchema.partial().extend({
    emailStatus: z.enum([
        "VALID",
        "INVALID",
        "MISSING"
    ]).optional(),

    classification: z.enum([
        "BUSINESS",
        "INDIVIDUAL"
    ]).nullable().optional()
})

export const leadIdSchema = z.object({
    id: z.string().uuid()
})

export const deleteLeadsSchema = z.object({
    leadIds: z.array(z.string().uuid()).min(1)
})

export const leadListQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),

    search: z.string().trim().optional(),

    source: z.enum([
        "GOOGLE",
        "FACEBOOK",
        "LINKEDIN",
        "DIRECTORY",
        "WEBSITE",
        "CSV",
        "OTHER"
    ]).optional(),

    emailStatus: z.enum([
        "VALID",
        "INVALID",
        "MISSING"
    ]).optional(),

    classification: z.enum([
        "BUSINESS",
        "INDIVIDUAL"
    ]).optional()
})