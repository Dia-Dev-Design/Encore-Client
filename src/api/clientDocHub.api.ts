import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient, unwrapAxiosResponse } from "./client.config";
import { DocHubDataType, Params } from "interfaces/clientDashboard/dochub/dochub.interface";

export function getUserDocumentIds(key: string,  params: any) {
    return useQuery({
        queryKey: [key],
        queryFn: async ({ signal }) => 
            apiClient
                .get(`/api/dochub/documents/with-urls`, {signal, params,})
                .then(unwrapAxiosResponse),
    });
}
