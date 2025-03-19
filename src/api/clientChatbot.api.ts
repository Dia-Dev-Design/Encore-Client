import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient, unwrapAxiosResponse } from "./client.config";
import { Question, QuestionWithFile } from "interfaces/clientDashboard/question.interface";
import { CreateCategoryParams } from "interfaces/clientDashboard/createCategory.interface";
import { MoveToCategoryParams } from "interfaces/clientDashboard/moveToCategory.interface";
import { UploadFileToChatParams } from "interfaces/clientDashboard/UploadFileToChat.interface";
import { ChangeCategoryNameParams } from "interfaces/clientDashboard/changeCategoryName.interface";
import { ChangeChatNameParams } from "interfaces/clientDashboard/changeChatName.interface";
import { getLocalItem } from "helper/localStorage.helper";
import { Connection } from "interfaces/login/connection.interface";
import isNil from "lodash.isnil";

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

// Define new interface for streaming mutation params
export interface StreamQuestionParams {
    params: Question;
    onChunk: (chunk: string) => void;
    onComplete: () => void;
    // onError is not included here because it's handled by useMutation itself
}

// Use a direct streaming approach with fetch while still wrapping in useMutation
export const useStreamQuestion = () =>
    useMutation<boolean, Error, StreamQuestionParams>({
        mutationFn: async ({ params, onChunk, onComplete }: StreamQuestionParams) => {
            try {
                console.log("Starting streamQuestion with params:", params);
                
                // Get authentication token using the same approach as apiClient
                const connection: Connection = JSON.parse(getLocalItem("connection") || '{}');
                const token = connection.token;
                
                console.log("Authentication token retrieved:", token ? "Found" : "Not found");
                
                if (isNil(token)) {
                    throw new Error("Authentication token is missing. Please log in again.");
                }
                
                // Use fetch directly for streaming - it's better suited for this use case
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || ''}api/chatbot/ask/stream`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(params)
                });
                
                console.log("Stream response status:", response.status);
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`Error response from server: ${errorText}`);
                    throw new Error(`Error: ${response.status} - ${errorText}`);
                }
                
                const reader = response.body?.getReader();
                if (!reader) {
                    throw new Error("Response body is not readable as a stream");
                }
                
                await processStream(reader, onChunk);
                
                onComplete();
                return true; // Return success
            } catch (error) {
                console.error("Error in streaming question:", error);
                onComplete();
                throw error;
            }
        }
    });

// Helper function to process the stream
async function processStream(reader: ReadableStreamDefaultReader<Uint8Array>, onChunk: (data: string) => void) {
    const decoder = new TextDecoder();
    let buffer = '';
    let currentFullText = '';
    
    try {
        let accumulatedContent = '';
    
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          // Process the chunk
          const chunk = decoder.decode(value, { stream: true });
          console.log(`Received raw chunk of length: ${chunk.length} buffer length: ${value.length}`);
          
          // Parse SSE format
          const lines = chunk.split('\n\n');
          for (const line of lines) {
            if (!line.trim()) continue;
            
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.substring(6));
                
                if (data.error) {
                  console.error("Error parsing SSE message:", data.error);
                  throw new Error(data.error);
                }
                
                if (data.content !== undefined) {
                  // Update accumulated content
                  accumulatedContent += data.content;
                  
                  // Pass to callback after each meaningful update
                  if (onChunk) {
                    onChunk(accumulatedContent);
                  }
                }
              } catch (e) {
                console.error("Error parsing SSE message:", e, "Raw message:", line);
                throw e;
              }
            }
          }
        }
        
        // Final callback with complete content
          console.log("Stream complete, final content length:", accumulatedContent.length);
        
        
        return accumulatedContent;
     } catch (error: any) {
        console.error("Error processing stream:", error);
        onChunk("Error: " + (error.message || "Unknown error occurred while processing the response"));
        throw error;
    }
}

// Keep the original function for backward compatibility
export const streamQuestion = async (params: Question, onChunk: (chunk: string) => void, onComplete: () => void) => {
    try {
        // Can't use the hook directly in a regular function, so we'll implement the logic again
        console.log("Using compatibility streamQuestion function");
        
        // Get authentication token using the same approach as apiClient
        const connection: Connection = JSON.parse(getLocalItem("connection") || '{}');
        const token = connection.token;
        
        console.log("Authentication token retrieved:", token ? "Found" : "Not found");
        
        if (isNil(token)) {
            throw new Error("Authentication token is missing. Please log in again.");
        }
        
        // Use fetch directly for streaming
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || ''}api/chatbot/ask/stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(params)
        });
        
        console.log("Stream response status:", response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error response from server: ${errorText}`);
            throw new Error(`Error: ${response.status} - ${errorText}`);
        }
        
        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error("Response body is not readable as a stream");
        }
        
        await processStream(reader, onChunk);
        
        onComplete();
    } catch (error) {
        console.error("Error in compatibility streamQuestion:", error);
        onComplete();
        throw error;
    }
};

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
