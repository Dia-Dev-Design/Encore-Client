import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient, unwrapAxiosResponse } from "./client.config";
import { Question, QuestionWithFile } from "interfaces/clientDashboard/question.interface";
import { CreateCategoryParams } from "interfaces/clientDashboard/createCategory.interface";
import { MoveToCategoryParams } from "interfaces/clientDashboard/moveToCategory.interface";
import { UploadFileToChatParams } from "interfaces/clientDashboard/UploadFileToChat.interface";
import { ChangeCategoryNameParams } from "interfaces/clientDashboard/changeCategoryName.interface";
import { ChangeChatNameParams } from "interfaces/clientDashboard/changeChatName.interface";

export const getChatbotThread = () =>
    useMutation({
        mutationFn: () => apiClient.post(`/api/chatbot/threads`).then(unwrapAxiosResponse),
    });

export const askQuestion = () =>
    useMutation({
    mutationFn: (params: Question) =>
        apiClient.post(`/api/chatbot/ask`, params).then(unwrapAxiosResponse),
    });

export const askQuestionWithFile = () =>
    useMutation({
    mutationFn: (params: QuestionWithFile) =>
        apiClient.post(`/api/chatbot/ask`, params).then(unwrapAxiosResponse),
    });

export const answerQuestion = () =>
    useMutation({
    mutationFn: (params: { threadId: string, message: string }) =>
        apiClient.post(`/api/chatbot/lawyer-chat/send-message/lawyer/${params.threadId}`, {message: params.message}).then(unwrapAxiosResponse),
    });

export const createCategory = () =>
    useMutation({
        mutationFn: (params: CreateCategoryParams) =>
        apiClient
            .post(`/api/chatbot/categories`, params)
            .then(unwrapAxiosResponse),
    });

export const moveToCategory = (threadId: string) =>
    useMutation({
        mutationFn: (params: MoveToCategoryParams) =>
        apiClient
            .post(`/api/chatbot/threads/${threadId}/categories`, params)
            .then(unwrapAxiosResponse),
    });

export const changeCategoryName = (categoryId: string) =>
    useMutation({
        mutationFn: (params: ChangeCategoryNameParams) =>
        apiClient
            .patch(`/api/chatbot/categories/${categoryId}`, params)
            .then(unwrapAxiosResponse),
    });

export const changeChatName = (thread_id: string) =>
    useMutation({
        mutationFn: (params: ChangeChatNameParams) =>
        apiClient
            .patch(`/api/chatbot/threads/${thread_id}`, params)
            .then(unwrapAxiosResponse),
    });

export const uploadFile = () =>
    useMutation({
        mutationFn: async (params: { threadId: string; file: File }) => {
            const formData = new FormData();
            formData.append('file', params.file);

            const response = await apiClient.post(`/api/chatbot/upload?&threadId=${params.threadId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return unwrapAxiosResponse(response);
        },
    });

export const requestALawyer = () =>
    useMutation({
        mutationFn: async (params: { threadId: string }) => {
            const response = await apiClient.post(`/api/chatbot/lawyer-chat/request/${params.threadId}`, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return unwrapAxiosResponse(response);
        },
    });

export function getCategoriesAndChats(key: string) {
    return useQuery({
        queryKey: [key],
        queryFn: async ({ signal }) => {
            const response = await apiClient.get('/api/chatbot/threads/all', { signal });
            return unwrapAxiosResponse(response);
        }
    });
}

export function getPreviousChats(key: string) {
    return useQuery({
        queryKey: [key],
        queryFn: async ({ signal }) => {
            const response = await apiClient.get('/api/chatbot/threads', { signal });
            const data = unwrapAxiosResponse(response);
            return data.sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        }
    });
}

export function getCategories(key: string) {
    return useQuery({
        queryKey: [key],
        queryFn: async ({ signal }) => {
            const response = await apiClient.get('/api/chatbot/categories', { signal });
            return unwrapAxiosResponse(response);
        }
    });
}

export function getChatsFromCategory(key: string, categoryId: string) {
    return useQuery({
        queryKey: [key, categoryId],
        queryFn: ({ signal }) =>
            apiClient
                .get(`/api/chatbot/categories/${categoryId}/threads`, {
                    signal,
                })
            .then(unwrapAxiosResponse),
            enabled: !!categoryId,
    });
}

export function getChatHistory(key: string, thread_id: string) {
    return useQuery({
        queryKey: [key, thread_id],
        queryFn: ({ signal }) =>
            apiClient
                .get(`/api/chatbot/history/${thread_id}`, {
                    signal,
                })
            .then(unwrapAxiosResponse),
            enabled: !!thread_id,
    });
}

export function getAdminChatHistory(key: string, thread_id: string) {
    return useQuery({
        queryKey: [key, thread_id],
        queryFn: ({ signal }) =>
            apiClient
                .get(`/api/chatbot/admin/history/${thread_id}`, {
                    signal,
                })
            .then(unwrapAxiosResponse),
            enabled: !!thread_id,
    });
}

export function getChatInfo(key: string, thread_id: string) {
    return useQuery({
        queryKey: [key, thread_id],
        queryFn: ({ signal }) =>
            apiClient
                .get(`/api/chatbot/threads/${thread_id}`, {
                    signal,
                })
            .then(unwrapAxiosResponse),
            enabled: !!thread_id,
    });
}

export function getLawyerChats(key: string, companyId: string) {
    return useQuery({
        queryKey: [key, companyId],
        queryFn: ({ signal }) =>
            apiClient
                .get(`/api/chatbot/admin/threads/all/${companyId}`, {
                    signal,
                })
            .then(unwrapAxiosResponse),
            enabled: !!companyId,
            refetchInterval: 10000
    });
}
