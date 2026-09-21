import type { LeadSource } from "@/features/leads/leads.types";

export interface EmailStatusBreakdown {
  valid: number;
  invalid: number;
  missing: number;
}

export interface ClassificationBreakdown {
  business: number;
  individual: number;
  unclassified: number;
}

export interface SourceCount {
  source: LeadSource;
  count: number;
}

export interface EmailSendingBreakdownData {
  sent: number;
  failed: number;
  pending: number;
}

export interface ReportData {
  leads: {
    total: number;
    emailStatus: EmailStatusBreakdown;
    classification: ClassificationBreakdown;
    sources: SourceCount[];
  };
  campaigns: {
    total: number;
  };
  emailSending: EmailSendingBreakdownData;
}

export interface ReportResponse {
  report: ReportData;
}
