export interface DataType {
  key: number;
  id: string;
  companyName: string;
  company: Company;
  category: string;
  description: string;
  dueDate: string;
  progress: number;
  actions: React.ReactNode;
}

interface Company {
  name: string;
  id: string;
}

export interface Props {
  selectedRowKeys: React.Key[];
  setSelectedRowKeys: React.Dispatch<React.SetStateAction<React.Key[]>>;
}

export interface Params {
  clientTasksLimit: number;
  clientTasksPage: number;
  clientTaskSortOption?: string | null;
  clientTaskSortOrder?: string | null;
  tableTab: string;
  limit: number;
}
