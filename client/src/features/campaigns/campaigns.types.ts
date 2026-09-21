import type { Classification, Lead } from "@/features/leads/leads.types";

export type CampaignRecipientStatus = "PENDING" | "SENT" | "FAILED";

export interface CampaignRecipient {
  id: string;
  campaignId: string;
  leadId: string;
  status: CampaignRecipientStatus;
  sentAt: string | null;
  errorMessage: string | null;
  createdAt: string;
  lead?: Lead;
}

export interface Campaign {
  id: string;
  name: string;
  classification: Classification;
  subject: string;
  emailMessage: string;
  createdAt: string;
  updatedAt: string;
  recipients?: CampaignRecipient[];
}

export interface CreateCampaignInput {
  name: string;
  classification: Classification;
  subject: string;
  emailMessage: string;
}

export interface UpdateCampaignInput {
  name?: string;
  classification?: Classification;
  subject?: string;
  emailMessage?: string;
}

export interface SendCampaignInput {
  leadIds: string[];
}

export interface SkippedRecipient {
  leadId: string;
  reason: string;
}

export interface SendCampaignResponse {
  sentCount: number;
  skippedCount: number;
  skipped: SkippedRecipient[];
}
