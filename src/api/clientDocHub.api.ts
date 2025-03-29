import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient, unwrapAxiosResponse } from "./client.config";

export function getUserDocumentIds(
    key: string, 
    params: { limit: number; page: number },
    options?: { enabled?: boolean }
) {
    return useQuery({
        queryKey: [key, params.page, params.limit],
        queryFn: async ({ signal }) => {
            const response = await apiClient.get(`/api/dochub/documents/with-urls`, {
                signal,
                params: {
                    limit: params.limit,
                    page: params.page,
                },
            });
            console.log("these are the respinse and query key ", unwrapAxiosResponse(response), key)
            return unwrapAxiosResponse(response);
        },
        enabled: options?.enabled !== undefined ? options.enabled : true,
    });
}

export function uploadDocuments() {
    return useMutation({
        mutationFn: async (files: File[]) => {
            const formData = new FormData();
            files.forEach((file) => {
                formData.append('files', file);
            });

            const response = await apiClient.post('/api/dochub/upload/multiple', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return unwrapAxiosResponse(response);
        },
    });
}


