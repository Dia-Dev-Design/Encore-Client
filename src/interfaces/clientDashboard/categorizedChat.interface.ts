import { CategoryThread } from "./categoryThread.interface";
import { ChatbotThread } from "./chatbotThread.interface";

export interface CategorizedChat {
    category: CategoryThread;
    threads: ChatbotThread[];
}