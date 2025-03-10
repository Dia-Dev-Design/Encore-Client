export interface DataType {
  key: number;
  companyName: string;
  category: string;
  description: string;
  dueDate: string;
  progress: number;
  actions: React.ReactNode;
  id: string;
}

export interface Props {
  selectedRowKeys: React.Key[];
  setSelectedRowKeys: React.Dispatch<React.SetStateAction<React.Key[]>>;
  isPage?: boolean;
}

export interface Params {
  lawyerChatbotClientsLimit: number;
  lawyerChatbotClientsPage: number;
  lawyerChatbotClientsSortOption?: string | null;
  lawyerChatbotClientsSortOrder?: string | null;
  lawyerChatbotClientsRequest?: string | null;
  lawyerChatbotClientsSearch: string;
  tableTab: string;
  limit: number;
}
