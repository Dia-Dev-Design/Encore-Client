import React from "react";
import ChatsIcon from "assets/icons/chat/ChatsIcon.svg";
import { ChatbotThread } from "interfaces/clientDashboard/chatbotThread.interface";
import { getChatInfo } from "api/clientChatbot.api";
import { CHAT_INFO } from "consts/clientPanel/clientQuery.const";

interface BlankCategoryProps {
    chatId: string;
    loadPreviousChat: (chat: ChatbotThread, title: string) => void;
}

const ChatInCategory: React.FC<BlankCategoryProps> =({chatId, loadPreviousChat}) => {
    const { data: chatData, isLoading: chatLoading } = getChatInfo(CHAT_INFO, chatId);

    return (
        <div className="w-3/4 flex flex-row justify-start gap-2">
            {chatLoading || chatData === undefined ? (
                <p className="font-figtree text-base text-neutrals-black">...</p>
            ) : (
            <button 
                className="w-full flex flex-row justify-start rounded-lg bg-primaryLinkWater-50 px-4 py-2 border border-greys-300 gap-2"
                onClick={()=>loadPreviousChat(chatData, chatData.title ?? "Untitled Chat")}
            >
                <img src={ChatsIcon} alt="Chat" />
                <div className="flex flex-col gap-2">
                    <p className="font-figtree font-medium text-primaryMariner-950">{chatData.title}</p>
                </div>
            </button>
            )}
        </div>
    );
};

export default ChatInCategory;

