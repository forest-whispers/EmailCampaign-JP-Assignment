import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCampaignApi,
  deleteCampaignApi,
  getCampaignApi,
  getCampaignsApi,
  sendCampaignApi,
  updateCampaignApi,
} from "./campaigns.api";
import { LEADS_QUERY_KEY } from "@/features/leads/leads.queries";
import type { CreateCampaignInput, UpdateCampaignInput } from "./campaigns.types";

export const CAMPAIGNS_QUERY_KEY = ["campaigns"] as const;

export function useCampaignsQuery() {
  return useQuery({
    queryKey: CAMPAIGNS_QUERY_KEY,
    queryFn: async () => {
      const res = await getCampaignsApi();
      return res.campaigns;
    },
  });
}

export function useCampaignQuery(id: string) {
  return useQuery({
    queryKey: [...CAMPAIGNS_QUERY_KEY, id],
    queryFn: async () => {
      const res = await getCampaignApi(id);
      return res.campaign;
    },
    enabled: Boolean(id),
  });
}

export function useCreateCampaignMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCampaignInput) => createCampaignApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_QUERY_KEY });
    },
  });
}

export function useUpdateCampaignMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCampaignInput }) =>
      updateCampaignApi(id, data),
    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...CAMPAIGNS_QUERY_KEY, variables.id],
      });
    },
  });
}

export function useDeleteCampaignMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCampaignApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_QUERY_KEY });
    },
  });
}

export function useSendCampaignMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, leadIds }: { id: string; leadIds: string[] }) =>
      sendCampaignApi(id, leadIds),
    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...CAMPAIGNS_QUERY_KEY, variables.id],
      });
      // Also invalidate leads query so any recipient status or related lead state refreshes
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
    },
  });
}
