import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient, unwrapAxiosResponse } from "./client.config";
import {
  DocHubDataType,
  Params,
} from "interfaces/clientDashboard/dochub/dochub.interface";

export function getRecentDocumentsAdmin(
  key: string,
  folderID: string,
  params: any
) {
  return useQuery({
    queryKey: [key],
    queryFn: async ({ signal }) =>
      apiClient
        .get(`/api/folders/${folderID}/files/recent/admin`, { signal, params })
        .then(unwrapAxiosResponse),
  });
}

export function getCompanyData(key: string, companyID: string) {
  return useQuery({
    queryKey: [key],
    queryFn: async ({ signal }) =>
      apiClient
        .get(`/api/companies/${companyID}`, { signal })
        .then(unwrapAxiosResponse),
  });
}

export function getAdminUsers(
  key: string,
  lawyerID: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: [key],
    queryFn: async ({ signal }) =>
      apiClient
        .get(`/api/dochub/assigned-users/${lawyerID}`, { signal })
        .then(unwrapAxiosResponse),
    enabled: options?.enabled !== undefined ? options.enabled : true,
  });
}

export function getAdminCompanies(
  key: string,
  adminId: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: [key, adminId],
    queryFn: async ({ signal }) =>
      apiClient
        .get(`/api/dochub/assigned-companies/${adminId}`, { signal })
        .then(unwrapAxiosResponse),
    enabled: options?.enabled !== undefined ? options.enabled : true,
  });
}

export function getUserDocumentsWithUrlsByUserId(
  key: string,
  userId: string,
  params: { limit: number; page: number },
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: [key, userId, params.page, params.limit],
    queryFn: async ({ signal }) => {
      const response = await apiClient.get(
        `/api/dochub/documents/user/${userId}/with-urls`,
        {
          signal,
          params: {
            limit: params.limit,
            page: params.page,
          },
        }
      );
      return unwrapAxiosResponse(response);
    },
    enabled: options?.enabled !== undefined ? options.enabled : true,
  });
}

export const getCompanyDocumentsWithUrls = (
    key: string,
    companyId: string,
    params: { limit: number; page: number },
    options?: { enabled?: boolean }
  ) => {
    return useQuery({
      queryKey: [key, companyId, params.page, params.limit],
      queryFn: async ({ signal }) => {
        const res = await apiClient.get(`/api/dochub/company-documents/with-urls`, {
          signal,
          params: {
            companyId,
            page: params.page,
            limit: params.limit,
          },
        });
        return unwrapAxiosResponse(res);
      },
      enabled: options?.enabled !== undefined ? options.enabled : true,
    });
  };
  
