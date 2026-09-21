import { apiClient } from "@/lib/api";
import type { ClassifyLeadsResponse } from "./classification.types";

export const classifyLeadsApi = (): Promise<ClassifyLeadsResponse> => {
  return apiClient.post<ClassifyLeadsResponse>("/leads/classify");
};
