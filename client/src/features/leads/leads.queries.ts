import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  createLeadsApi,
  deleteLeadsApi,
  getLeadsApi,
  importCsvApi,
  updateLeadApi,
} from "./leads.api";
import type {
  CreateLeadsPayload,
  LeadListParams,
  UpdateLeadInput,
} from "./leads.types";

export const LEADS_QUERY_KEY = ["leads"] as const;

export function useLeadsQuery(params: LeadListParams) {
  return useQuery({
    queryKey: [...LEADS_QUERY_KEY, params],
    queryFn: () => getLeadsApi(params),
    placeholderData: keepPreviousData,
  });
}

export function useCreateLeadsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateLeadsPayload) => createLeadsApi(payload),
    onSuccess: () => {
      // Invalidate leads query while preserving current list/filter parameters
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
    },
  });
}

export function useImportCsvMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => importCsvApi(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
    },
  });
}

export function useUpdateLeadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateLeadInput }) =>
      updateLeadApi(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
    },
  });
}

export function useDeleteLeadsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (leadIds: string[]) => deleteLeadsApi(leadIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
    },
  });
}
