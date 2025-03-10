export interface DataType {
  key: number;
  id: number;
  companyName: string;
  category: string;
  description: string;
  dueDate: string;
  progress: number;
  actions: React.ReactNode;
}

export interface Props {
  selectedRowKeys: React.Key[];
  setSelectedRowKeys: React.Dispatch<React.SetStateAction<React.Key[]>>;
  isPage?: boolean;
}

export interface Params {
  prospectClientsLimit: number;
  prospectClientsPage: number;
  prospectClientsCurrentStage: string;
  prospectClientsSearch: string;
  tableTab: string;
  limit: number;
  prospectClientsSortOption?: string | null;
  prospectClientsSortOrder?: string | null;
}
