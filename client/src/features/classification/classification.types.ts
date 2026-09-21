export interface ClassificationItem {
  id: string;
  classification: "BUSINESS" | "INDIVIDUAL";
}

export interface ClassifyLeadsResponse {
  processedCount: number;
  classifications?: ClassificationItem[];
}
