export interface Question {
    thread_id: string;
    prompt: string;
}

export interface QuestionWithFile {
    thread_id: string;
    prompt: string;
    fileId: string | null;
}
