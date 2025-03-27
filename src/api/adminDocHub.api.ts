import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient, unwrapAxiosResponse } from "./client.config";
import { DocHubDataType, Params } from "interfaces/clientDashboard/dochub/dochub.interface";

export function getRecentDocumentsAdmin(key: string, folderID: string, params: any) {
    return useQuery({
        queryKey: [key],
        queryFn: async ({ signal }) => 
            apiClient
                .get(`/api/folders/${folderID}/files/recent/admin`, {signal, params,})
                .then(unwrapAxiosResponse),
    });
}

export function getCompanyData(key: string, companyID: string) {
    return useQuery({
        queryKey: [key],
        queryFn: async ({ signal }) => 
            apiClient
                .get(`/api/companies/${companyID}`, {signal,})
                .then(unwrapAxiosResponse),
    });
}


export function getAdminUsers(key: string, lawyerID: string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: [key],
        queryFn: async ({ signal }) => 
            apiClient
                .get(`/api/dochub/assigned-users/${lawyerID}`, {signal,})
                .then(unwrapAxiosResponse),
        enabled: options?.enabled !== undefined ? options.enabled : true,
    });
}