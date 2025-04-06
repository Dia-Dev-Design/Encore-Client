export interface Notification {
  id: string;
  category: string;
  createdAt: string;
  lawyerRequest: LawyerRequest;
  readed: boolean;
  type: string;
  updatedAt: string;
}

export interface LawyerRequest {
  chatCompanyId: string;
  chatThreadId: string;
  companyId: string;
  lawyerId: string;
  userId: string;
}

export interface NotificationApiResponse {
  list: Notification[];
  totalUnread: number;
  pagination: Pagination;
}

export interface Pagination {
  currentPage: number;
  limit: number;
  offset: number;
  totalItems: number;
  totalPages: number;
}
