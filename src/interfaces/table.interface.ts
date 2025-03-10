export interface Params {
  limit?: number;
  typeTask?: string;
  tableType?: string;
  search?: string;
  currentStage?: string;
  dissolutionClientsSearch?: string;
  hasReqChatbotLawyer?: string | null;
  sortOption?: string | null;
  sortOrder?: string | null;
  status?: string;
  page?: number;
}

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}
