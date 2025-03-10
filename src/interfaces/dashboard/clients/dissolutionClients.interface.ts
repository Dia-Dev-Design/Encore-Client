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
  dissolutionClientsLimit: number;
  dissolutionClientsPage: number;
  dissolutionClientsSearch: string;
  dissolutionClientsSortOption?: string | null;
  dissolutionClientsSortOrder?: string | null;
  prospectClientsStatus?: string;
  tableTab: string;
  limit: number;
}
