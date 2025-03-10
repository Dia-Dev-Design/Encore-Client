import React, { useEffect, useState } from "react";
import FolderIcon from "assets/icons/chat/FolderIcon.svg";
import ArrowIcon from "assets/icons/chat/ArrowIcon.svg";
import { CategoryThread } from "interfaces/clientDashboard/categoryThread.interface";
import { ChatbotThread } from "interfaces/clientDashboard/chatbotThread.interface";
import { ChatSpaceType } from "interfaces/clientDashboard/ChatSpaceType.enum";
import HistoryChatInCategory from "./HistoryChatInCategory";

interface HistoryChatProps {
    threadInfo: CategoryThread;
    loadCategory: (category: CategoryThread) => void;
    loadPreviousChat: (chat: ChatbotThread, title: string) => void;
    setSelectedChatType: (type: ChatSpaceType) => void;
    threadsInCategoryData: ChatbotThread[];
    handleNewChat: () => void;
    onCategoryOpenChange: (categoryId: string) => void;
    activeCategoryOpen: string;
}

const HistoryCategory: React.FC<HistoryChatProps> =({ 
    threadInfo, loadCategory, loadPreviousChat, setSelectedChatType, 
    threadsInCategoryData, handleNewChat, onCategoryOpenChange, activeCategoryOpen,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsOpen(activeCategoryOpen === threadInfo.id);
    }, [activeCategoryOpen]);

    const handleCategoryOpen = () => {
        const value = !isOpen;
        setIsOpen(value);
        if (value) {
            onCategoryOpenChange(threadInfo.id);
            setSelectedChatType(ChatSpaceType.categorySpace);
            loadCategory(threadInfo);
        } else {
            handleNewChat();
        }
    };

    return (
        <div className="w-full flex flex-col justify-between items-center">
            <button 
                className={`w-full min-h-10 flex flex-row gap-x-2 px-2 items-center ${isOpen ? "bg-primaryLinkWater-200 rounded-lg my-1" : "" }`} 
                onClick={() => handleCategoryOpen()}
            >
                <img src={FolderIcon} alt="Category" />
                <p className={`w-full text-base font-medium font-figtree text-left pl-2 ${isOpen ? "text-neutrals-black" : "text-neutrals-white"}`}>
                    {threadInfo.name}
                </p>
                <img src={ArrowIcon} alt="Show Category" />
            </button>
            {isOpen && (
                <div className="w-full flex flex-col gap-y-2 justify-between items-center bg-primaryLinkWater-50 rounded-lg py-2 transition">
                    {threadsInCategoryData && threadsInCategoryData.length > 0 ? threadsInCategoryData.map((chat: any) => (
                        <HistoryChatInCategory 
                            key={chat}
                            chatId={chat}
                            loadPreviousChat={loadPreviousChat}
                        />
                    )) : (
                        <p className="font-figtree font-medium text-greys-700" >No chats available</p>
                    )}
                </div>
            )}
            
        </div>
    );
};

export default HistoryCategory;

