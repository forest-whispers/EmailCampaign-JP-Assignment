import { apiClient } from "@/lib/api";
import type {
  Campaign,
  CreateCampaignInput,
  SendCampaignResponse,
  UpdateCampaignInput,
} from "./campaigns.types";

export const getCampaignsApi = (): Promise<{ campaigns: Campaign[] }> => {
  return apiClient.get<{ campaigns: Campaign[] }>("/campaigns");
};

export const getCampaignApi = (id: string): Promise<{ campaign: Campaign }> => {
  return apiClient.get<{ campaign: Campaign }>(`/campaigns/${id}`);
};

export const createCampaignApi = (
  data: CreateCampaignInput
): Promise<{ campaign: Campaign }> => {
  return apiClient.post<{ campaign: Campaign }>("/campaigns", data);
};

export const updateCampaignApi = (
  id: string,
  data: UpdateCampaignInput
): Promise<{ campaign: Campaign }> => {
  return apiClient.patch<{ campaign: Campaign }>(`/campaigns/${id}`, data);
};

export const deleteCampaignApi = (
  id: string
): Promise<{ message: string }> => {
  return apiClient.delete<{ message: string }>(`/campaigns/${id}`);
};

export const sendCampaignApi = (
  id: string,
  leadIds: string[]
): Promise<SendCampaignResponse> => {
  return apiClient.post<SendCampaignResponse>(`/campaigns/${id}/send`, {
    leadIds,
  });
};
