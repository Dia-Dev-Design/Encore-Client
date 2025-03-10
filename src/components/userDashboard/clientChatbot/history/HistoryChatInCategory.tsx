import { getChatInfo } from "api/clientChatbot.api";
import { CHAT_INFO } from "consts/clientPanel/clientQuery.const";
import { ChatbotThread } from "interfaces/clientDashboard/chatbotThread.interface";
import React from "react";

interface HistoryChatProps {
    chatId: string;
    loadPreviousChat: (chat: ChatbotThread, title: string) => void;
}

const HistoryChatInCategory: React.FC<HistoryChatProps> =({ chatId, loadPreviousChat }) => {
    const { data: chatData, isLoading: chatLoading } = getChatInfo(CHAT_INFO, chatId);

    return (
        <div className={`w-full min-h-10 flex flex-row justify-between items-center `}>
            {chatLoading || chatData === undefined ? (
                <p className="font-figtree text-base text-neutrals-black">Loading...</p>
            ) : (
            <button onClick={()=>loadPreviousChat(chatData, chatData.title ?? "Untitled Chat")}>
                <p className={`text-base font-figtree items-center pl-2 text-neutrals-black text-left`}>
                    {chatData.title ? chatData.title : "Untitled Chat"}
                </p>
            </button>    
                )}
        </div>
    );
};

export default HistoryChatInCategory;

