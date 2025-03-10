import React from "react";
import { ChatbotThread } from "interfaces/clientDashboard/chatbotThread.interface";
import ChatIcon from "assets/icons/chat/ChatsIcon.svg";

interface ConversationItemProps {
    label: string;
    groupedThreads: ChatbotThread[];
    handleThreadSelect: (thread: ChatbotThread) => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
    label,
    groupedThreads,
    handleThreadSelect,
}) => {

    return (
        <>
            <p className="font-figtree text-base text-neutrals-black font-medium py-4">{label}</p>
            <ul className="flex flex-col gap-2">
                {groupedThreads.map((thread: ChatbotThread) => (
                    <button 
                        key={thread.id}
                        className="w-full flex flex-row justify-start rounded-lg bg-primaryLinkWater-50 px-4 py-2 border border-greys-300 gap-2"
                        onClick={() => handleThreadSelect(thread)}
                    >
                        <img src={ChatIcon} alt="Chat" />
                        <div className="flex flex-col gap-2">
                            <p className="font-figtree font-medium text-primaryMariner-950">{thread.title || "Untitled chat"}</p>
                        </div>
                    </button>
                ))}
            </ul>
        </>
    );
};

export default ConversationItem;
