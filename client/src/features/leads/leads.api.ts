import { apiClient } from "@/lib/api";
import type {
  CreateLeadsPayload,
  CreateLeadsResponse,
  DeleteLeadsResponse,
  Lead,
  LeadListParams,
  PaginatedLeadsResponse,
  UpdateLeadInput,
} from "./leads.types";

export const getLeadsApi = (
  params?: LeadListParams
): Promise<PaginatedLeadsResponse> => {
  return apiClient.get<PaginatedLeadsResponse>("/leads", {
    params: params as Record<string, string | number | boolean | undefined | null>,
  });
};

export const getLeadApi = (id: string): Promise<{ lead: Lead }> => {
  return apiClient.get<{ lead: Lead }>(`/leads/${id}`);
};

export const createLeadsApi = (
  payload: CreateLeadsPayload
): Promise<CreateLeadsResponse> => {
  return apiClient.post<CreateLeadsResponse>("/leads", payload);
};

export const importCsvApi = (file: File): Promise<CreateLeadsResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  return apiClient.post<CreateLeadsResponse>("/leads", formData);
};

export const updateLeadApi = (
  id: string,
  updates: UpdateLeadInput
): Promise<{ lead: Lead }> => {
  return apiClient.patch<{ lead: Lead }>(`/leads/${id}`, updates);
};

export const deleteLeadsApi = (
  leadIds: string[]
): Promise<DeleteLeadsResponse> => {
  return apiClient.delete<DeleteLeadsResponse>("/leads", {
    data: { leadIds },
  });
};
