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