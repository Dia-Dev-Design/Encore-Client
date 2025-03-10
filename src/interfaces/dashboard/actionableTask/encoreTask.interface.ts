export interface DataType {
  key: number;
  id: string;
  companyName: string;
  category: string;
  company: Company;
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
  encoreTasksLimit: number;
  encoreTasksPage: number;
  encoreTaskSortOption?: string | null;
  encoreTaskSortOrder?: string | null;
  tableTab: string;
  limit: number;
}
