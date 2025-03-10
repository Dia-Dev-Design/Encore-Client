export interface DocHubDataType {
    key: number;
    id: string;
    docName: string;
    productTag: string;
    taskName: string;
    owner: string;
    uploadDate: string;
    location: string;
    downloadUrl: string;
    //actions: React.ReactNode;
}

export interface Params {
    documentLimit: number;
    documentPage: number;
    documentSortOption?: string | null;
    documentSortOrder?: string | null;
    limit: number;
}
