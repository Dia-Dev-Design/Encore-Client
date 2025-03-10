import { useEffect, useState } from "react";
import ChatList from "./ChatList";
import { DocumentNode, HistoryNode } from "interfaces/clientDashboard/historyNode.interface";
import { ChatSpaceType } from "interfaces/clientDashboard/ChatSpaceType.enum";
import { ChatbotThread } from "interfaces/clientDashboard/chatbotThread.interface";
import { CHAT_HISTORY, LAWYER_CHATS } from "consts/clientPanel/clientQuery.const";
import ChatWindow from "./ChatWindow";
import { useQueryClient } from "@tanstack/react-query";
import ModalSearchChatsAdmin from "./ModalSearchChatsAdmin";
import { useParams } from "react-router-dom";
import { ChatTypeEnum } from "interfaces/clientDashboard/chatType.enum";
import { getAdminChatHistory, getLawyerChats } from "api/clientChatbot.api";

const AdminAIChatbot = () => {
    const queryClient = useQueryClient();
    const { companyId } = useParams<{ companyId: string }>();
    const { data: chatbotThreadList, isLoading: chatbotThreadListLoading } = getLawyerChats(LAWYER_CHATS, companyId || "");

    const [isHistoryCollapsed, setIsHistoryCollpased] = useState(false);
    const [historyConversation, setHistoryConversation] = useState<HistoryNode[]>([]);
    const [filesConversation, setFilesConversation] = useState<DocumentNode[]>([]);

    const [selectedChatType, setSelectedChatType] = useState<ChatSpaceType>(ChatSpaceType.blankSpace);
    const [selectedChatId, setSelectedChatId] = useState<string>("");
    const [chatbotThread, setChatbotThread] = useState<ChatbotThread>();
    const [chatbotThreadType, setChatbotThreadType] = useState<ChatTypeEnum>();

    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

    const { data: chatHistoryData, isLoading: chatHistoryLoading } = getAdminChatHistory(CHAT_HISTORY, selectedChatId);

    useEffect(() => {
        if (chatHistoryData && chatHistoryData.response.messages.length > 0) {
            setSelectedChatType(ChatSpaceType.chatSpace);
            setChatbotThreadType(chatHistoryData.response.chatType as ChatTypeEnum);
            setHistoryConversation(chatHistoryData.response.messages);
            setFilesConversation(chatHistoryData.response.files);
        }
    }, [chatHistoryData]);

    const loadPreviousChat = (chat: ChatbotThread) => {
        setSelectedChatId(chat.id);
        setChatbotThread(chat);
    }

    const closeSearchModal = () => {
        setIsSearchModalOpen(false);
    }

    const invalidateMainQueries = () => {
        queryClient.invalidateQueries({ queryKey: [LAWYER_CHATS] });
    }

    return (
        <section className="h-full px-10 py-6">
            <div className="h-[70vh] flex flex-row gap-4">
                <ChatList
                    isHistoryCollapsed={isHistoryCollapsed}
                    setIsHistoryCollpased={setIsHistoryCollpased}
                    historyThreads={chatbotThreadList || []}
                    loadPreviousChat={loadPreviousChat}
                    setIsSearchModalOpen={setIsSearchModalOpen}
                />
                <ChatWindow
                    historyConversation={historyConversation}
                    setHistoryConversation={setHistoryConversation}
                    filesConversation={filesConversation}
                    isLoadingData={chatHistoryLoading || chatbotThreadListLoading}
                    selectedChatType={selectedChatType}
                    setSelectedChatType={setSelectedChatType}
                    chatbotThread={chatbotThread}
                    chatbotThreadType={chatbotThreadType}
                    setChatbotThread={setChatbotThread}
                    invalidateMainQueries={invalidateMainQueries}
                />
                <ModalSearchChatsAdmin
                    chats={chatbotThreadList}
                    isModalOpen={isSearchModalOpen}
                    closeModal={closeSearchModal}
                    loadPreviousChat={loadPreviousChat}
                />
            </div>
        </section>
    );
};

export default AdminAIChatbot;
