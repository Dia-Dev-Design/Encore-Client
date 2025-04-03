export interface DataType {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  isVerified: boolean;
  isActivated: boolean;
  phoneNumber?: string;
  password?: string;
}

export interface ApiResponse {
  users: DataType[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export interface Params {
  nonActivatedUsersLimit: number;
  nonActivatedUsersPage: number;
  nonActivatedUsersSearch?: string;
  nonActivatedUsersSortOption?: string | null;
  nonActivatedUsersSortOrder?: string | null;
  limit?: number;
  page?: number;
  sortOption?: string | null;
  sortOrder?: string | null;
  search?: string;
}

export interface Props {
  selectedRowKeys: React.Key[];
  setSelectedRowKeys: React.Dispatch<React.SetStateAction<React.Key[]>>;
  isPage?: boolean;
} 