import { useMutation, useQueryClient } from "@tanstack/react-query";
import { classifyLeadsApi } from "./classification.api";
import { LEADS_QUERY_KEY } from "@/features/leads/leads.queries";

export function useClassifyLeadsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => classifyLeadsApi(),
    onSuccess: () => {
      // Invalidate existing ["leads"] queries to allow Leads table to refetch
      // preserves current search/filter/pagination state
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
    },
  });
}
