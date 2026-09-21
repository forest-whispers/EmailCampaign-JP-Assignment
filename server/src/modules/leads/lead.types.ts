import type { Classification, EmailStatus, LeadSource } from "@prisma/client";

export type LeadInput =
{
    buyerName?: string
    companyName?: string
    email?: string | null
    website?: string
    country?: string
    source: LeadSource
}

export type CreateLeadsInput =
{
    leads: LeadInput[]
}

export type UpdateLeadInput =
{
    buyerName?: string
    companyName?: string
    email?: string | null
    website?: string
    country?: string
    source?: LeadSource
    emailStatus?: EmailStatus
    classification?: Classification | null
}

export type LeadListQuery =
{
    page: number
    limit: number
    search?: string
    source?: LeadSource
    emailStatus?: EmailStatus
    classification?: Classification
}