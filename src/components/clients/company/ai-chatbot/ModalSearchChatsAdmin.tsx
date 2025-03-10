import React, { useEffect, useState, useMemo } from "react";
import { Input, message, Modal } from "antd";
import SearchIcon from "assets/icons/chat/DarkSearchIcon.svg";
import { ChatbotThread } from "interfaces/clientDashboard/chatbotThread.interface";
import ConversationItem from "components/userDashboard/clientChatbot/modals/ConversationItem";

interface ModalSearchChatsAdminProps {
    chats: ChatbotThread[];
    isModalOpen: boolean;
    closeModal: () => void;
    loadPreviousChat: (chat: ChatbotThread, title: string) => void;
}

const ModalSearchChatsAdmin: React.FC<ModalSearchChatsAdminProps> = ({
    chats,
    isModalOpen,
    closeModal,
    loadPreviousChat,
}) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [filteredThreads, setFilteredThreads] = useState<ChatbotThread[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const SearchIconElement = <img src={SearchIcon} alt="Search" />;

    useEffect(() => {
        if (chats) {
            const filtered = chats.filter((thread: ChatbotThread) =>
                thread.title?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredThreads(filtered);
        }
    }, [searchTerm, chats]);

    const groupedThreads = useMemo(() => {
        const now = new Date();
        const groups = {
            last7Days: [] as ChatbotThread[],
            lastTwoWeeks: [] as ChatbotThread[],
            lastMonth: [] as ChatbotThread[],
            older: [] as ChatbotThread[],
        };

        filteredThreads.forEach((thread) => {
            const updatedAt = new Date(thread.updatedAt);
            const diffTime = now.getTime() - updatedAt.getTime();
            const diffDays = diffTime / (1000 * 60 * 60 * 24);

            if (diffDays <= 7) {
                groups.last7Days.push(thread);
            } else if (diffDays <= 14) {
                groups.lastTwoWeeks.push(thread);
            } else if (diffDays <= 30) {
                groups.lastMonth.push(thread);
            } else {
                groups.older.push(thread);
            }
        });

        return groups;
    }, [filteredThreads]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleThreadSelect = (thread: ChatbotThread) => {
        loadPreviousChat(thread, thread.title || "Untitled chat");
        closeModal();
    };

    return (
        <>
            {contextHolder}
            <Modal
                centered
                width={800}
                open={isModalOpen}
                onCancel={closeModal}
                footer={null}
            >
                <p className="font-figtree text-2xl text-neutrals-black font-medium w-full text-center pb-8">Search Chats</p>
                <Input
                    placeholder="Search..."
                    prefix={SearchIconElement}
                    style={{ width: "90%", height: 48, padding: "0 16px", margin: "0 30px" }}
                    value={searchTerm}
                    onChange={handleSearchChange}
                />

                <div className="mt-4 overflow-y-auto max-h-96">
                    {groupedThreads.last7Days.length > 0 && (
                        <ConversationItem
                            label="Last 7 days"
                            groupedThreads={groupedThreads.last7Days}
                            handleThreadSelect={handleThreadSelect} 
                        />
                    )}

                    {groupedThreads.lastTwoWeeks.length > 0 && (
                        <ConversationItem
                            label="Last two weeks"
                            groupedThreads={groupedThreads.lastTwoWeeks}
                            handleThreadSelect={handleThreadSelect}
                        />
                    )}

                    {groupedThreads.lastMonth.length > 0 && (
                        <ConversationItem
                            label="Last month"
                            groupedThreads={groupedThreads.lastMonth}
                            handleThreadSelect={handleThreadSelect}
                        />
                    )}

                    {groupedThreads.older.length > 0 && (
                        <ConversationItem
                            label="Older"
                            groupedThreads={groupedThreads.older}
                            handleThreadSelect={handleThreadSelect}
                        />
                    )}

                    {filteredThreads.length === 0 && <p className="font-figtree text-neutrals-black">No chats found</p>}
                </div>
            </Modal>
        </>
    );
};

export default ModalSearchChatsAdmin;
