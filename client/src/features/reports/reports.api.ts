import { apiClient } from "@/lib/api";
import type { ReportResponse } from "./reports.types";

export const getReportApi = (): Promise<ReportResponse> => {
  return apiClient.get<ReportResponse>("/reports");
};
