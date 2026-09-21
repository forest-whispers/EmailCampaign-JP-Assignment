import type {
    Classification,
    CampaignRecipientStatus
} from "@prisma/client";

export type CreateCampaignInput =
{
    name: string
    classification: Classification
    subject: string
    emailMessage: string
}

export type UpdateCampaignInput =
{
    name?: string
    classification?: Classification
    subject?: string
    emailMessage?: string
}

export type SendCampaignInput =
{
    leadIds: string[]
}

export type SkippedLead =
{
    leadId: string
    reason: string
}