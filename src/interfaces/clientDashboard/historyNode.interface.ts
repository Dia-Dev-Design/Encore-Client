export interface HistoryNode {
    checkpoint_id: string;
    content: string;
    role: string;
    url?: string;
    fileId?: string;
    isStreaming?: boolean;
    isError?: boolean;
}

export interface DocumentNode {
    id: string;
    url: string;
    originalName: string | null;
    createdAt: string;
}