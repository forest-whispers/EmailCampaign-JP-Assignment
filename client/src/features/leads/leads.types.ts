export type LeadSource =
  | "GOOGLE"
  | "FACEBOOK"
  | "LINKEDIN"
  | "DIRECTORY"
  | "WEBSITE"
  | "CSV"
  | "OTHER";

export type EmailStatus = "VALID" | "INVALID" | "MISSING";

export type Classification = "BUSINESS" | "INDIVIDUAL";

export interface Lead {
  id: string;
  buyerName: string | null;
  companyName: string | null;
  email: string | null;
  website: string | null;
  country: string | null;
  source: LeadSource;
  emailStatus: EmailStatus;
  classification: Classification | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadInput {
  buyerName?: string;
  companyName?: string;
  email?: string | null;
  website?: string;
  country?: string;
  source: LeadSource;
}

export interface CreateLeadsPayload {
  leads: CreateLeadInput[];
}

export interface UpdateLeadInput {
  buyerName?: string | null;
  companyName?: string | null;
  email?: string | null;
  website?: string | null;
  country?: string | null;
  source?: LeadSource;
  emailStatus?: EmailStatus;
  classification?: Classification | null;
}

export interface LeadListParams {
  page?: number;
  limit?: number;
  search?: string;
  source?: LeadSource;
  emailStatus?: EmailStatus;
  classification?: Classification;
}

export interface PaginatedLeadsResponse {
  leads: Lead[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateLeadsResponse {
  createdCount: number;
  skippedCount: number;
  skipped: Array<{
    email?: string;
    reason: string;
  }>;
}

export interface DeleteLeadsResponse {
  deletedCount: number;
}
