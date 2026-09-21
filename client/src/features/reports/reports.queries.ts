import { useQuery } from "@tanstack/react-query";
import { getReportApi } from "./reports.api";
import type { ReportData } from "./reports.types";

export const REPORTS_QUERY_KEY = ["reports"] as const;

export function useReportQuery() {
  return useQuery<ReportData>({
    queryKey: REPORTS_QUERY_KEY,
    queryFn: async () => {
      const response = await getReportApi();
      return response.report;
    },
  });
}
