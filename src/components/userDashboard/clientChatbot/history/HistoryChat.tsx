import { ChatbotThread } from "interfaces/clientDashboard/chatbotThread.interface";
import React, { useState } from "react";

interface HistoryChatProps {
    chat: ChatbotThread;
    isInsideCategory: boolean;
    loadPreviousChat: (chat: ChatbotThread, title: string) => void;
}

const HistoryChat: React.FC<HistoryChatProps> =({ chat, isInsideCategory, loadPreviousChat }) => {

    return (
        <div className={`w-full  flex flex-row justify-between items-center `}>
            <button onClick={()=>loadPreviousChat(chat, chat.title ?? "Untitled Chat")}>
                <p className={`text-base min-h-10 font-figtree text-left pl-2 ${isInsideCategory ? "text-neutrals-black" : "text-neutrals-white"}`}>{chat.title ? chat.title : "Untitled Chat"}</p>
            </button>
        </div>
    );
};

export default HistoryChat;

