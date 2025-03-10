import { CategorizedChat } from "./categorizedChat.interface";
import { ChatbotThread } from "./chatbotThread.interface";

export interface CategoriesAndChats {
    categorized: CategorizedChat[];
    uncategorized: ChatbotThread[];
}