import React, { useEffect, useState } from "react";

import HistorySection from "./clientChatbot/history/HistorySection";
import ChatSection from "./clientChatbot/chat/ChatSection";
import { DocumentNode, HistoryNode } from "interfaces/clientDashboard/historyNode.interface";
import { createCategory, getCategories, getCategoriesAndChats, getChatHistory, getChatsFromCategory } from "api/clientChatbot.api";
import { CreateCategoryParams } from "interfaces/clientDashboard/createCategory.interface";
import { CATEGORY_AND_CHATS, CATEGORY_CHATS, CATEGORY_LIST, CHAT_HISTORY } from "consts/clientPanel/clientQuery.const";
import { ChatSpaceType } from "interfaces/clientDashboard/ChatSpaceType.enum";
import { ChatbotThread } from "interfaces/clientDashboard/chatbotThread.interface";
import { useQueryClient } from "@tanstack/react-query";
import { CategoryThread } from "interfaces/clientDashboard/categoryThread.interface";
import ModalSearchChats from "./clientChatbot/modals/ModalSearchChats";
import { ChatTypeEnum } from "interfaces/clientDashboard/chatType.enum";

const AiChatbot: React.FC = () => {
    const queryClient = useQueryClient();
    const { data: categoriesAndChats, isLoading: catAndChatsLoading } = getCategoriesAndChats(CATEGORY_AND_CHATS);
    const { data: categories, isLoading: categoriesLoading } = getCategories(CATEGORY_LIST);
    const { mutate: createNewCategory, isPending: isCreatingNewCategory } = createCategory();

    const [isHistoryCollapsed, setIsHistoryCollpased] = useState(false);
    const [historyConversation, setHistoryConversation] = useState<HistoryNode[]>([]);
    const [filesConversation, setFilesConversation] = useState<DocumentNode[]>([]);
    const [markedPrompts, setMarkedPrompts] = useState<HistoryNode[]>([]);

    const [selectedChatType, setSelectedChatType] = useState<ChatSpaceType>(ChatSpaceType.blankSpace);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
    const [selectedChatId, setSelectedChatId] = useState<string>("");
    const [chatbotThread, setChatbotThread] = useState<ChatbotThread>();
    const [chatbotThreadType, setChatbotThreadType] = useState<ChatTypeEnum>();
    const [categoryThread, setCategoryThread] = useState<CategoryThread>();
    const [isCategoryBeingCreated, setIsCategoryBeingCreated] = useState<boolean>(false);

    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

    const { data: chatHistoryData, isLoading: chatHistoryLoading } = getChatHistory(CHAT_HISTORY, selectedChatId);
    const { data: threadsInCategory, isLoading: threadsInCategoryLoading } = getChatsFromCategory(CATEGORY_CHATS, selectedCategoryId);

    useEffect(() => {
        if (chatHistoryData && chatHistoryData.response.messages.length > 0) {
            setSelectedChatType(ChatSpaceType.chatSpace);
            setChatbotThreadType(chatHistoryData.response.chatType as ChatTypeEnum);
            setHistoryConversation(chatHistoryData.response.messages);
            setFilesConversation(chatHistoryData.response.files);
        }
    }, [chatHistoryData]);

    const handleNewChat = () => {
        invalidateMainQueries();
        setSelectedChatType(ChatSpaceType.blankSpace);
        setHistoryConversation([]);
        setChatbotThread(undefined);
        setChatbotThreadType(undefined);
    }

    const loadPreviousChat = (chat: ChatbotThread) => {
        setSelectedChatId(chat.id);
        setChatbotThread(chat);
    }

    const loadCategory = (category: CategoryThread) => {
        setSelectedCategoryId(category.id);
        setCategoryThread(category);
    }

    const handleNewCategory = () => {
        const payload: CreateCategoryParams = {
            name: "New Category",
        };
        setIsCategoryBeingCreated(true);
        createNewCategory(payload, { 
            onSuccess: (data) => {
                invalidateMainQueries();
                setIsCategoryBeingCreated(false);
            },
            onError: (error, payload) => {
                console.error("Error:", error, payload);
                setIsCategoryBeingCreated(false);
            },
        });
    }

    const invalidateMainQueries = () => {
        queryClient.invalidateQueries({ queryKey: [CATEGORY_AND_CHATS] });
        queryClient.invalidateQueries({ queryKey: [CATEGORY_LIST] });
    }

    const closeSearchModal = () => {
        setIsSearchModalOpen(false);
    }

    return (
        <section className="h-full p-0 m-0 md:px-10 md:pt-6">
            <div className="h-full md:h-[76vh] flex flex-row md:gap-4">
                <HistorySection 
                    isHistoryCollapsed={isHistoryCollapsed}
                    setIsHistoryCollpased={setIsHistoryCollpased}
                    handleNewChat={handleNewChat}
                    historyThreads={categoriesAndChats?.uncategorized?.threads || []}
                    categoryThreads={categories}
                    loadPreviousChat={loadPreviousChat}
                    createNewCategory={handleNewCategory}
                    selectedChatType={selectedChatType}
                    setSelectedChatType={setSelectedChatType}
                    setSelectedCategoryId={setSelectedCategoryId}
                    threadsInCategoryData={threadsInCategory}
                    loadCategory={loadCategory}
                    setIsSearchModalOpen={setIsSearchModalOpen}
                    chatbotThread={chatbotThread}
                />
                <ChatSection
                    historyConversation={historyConversation}
                    filesConversation={filesConversation}
                    setHistoryConversation={setHistoryConversation}
                    isLoadingData={chatHistoryLoading || catAndChatsLoading || categoriesLoading || isCreatingNewCategory}
                    markedPrompts={markedPrompts}
                    categoryThreads={categories}
                    selectedChatType={selectedChatType}
                    threadsInCategory={threadsInCategory}
                    threadsInCategoryLoading={threadsInCategoryLoading}
                    setSelectedChatType={setSelectedChatType}
                    chatbotThread={chatbotThread}
                    categoryThread={categoryThread}
                    chatbotThreadType={chatbotThreadType}
                    setChatbotThread={setChatbotThread}
                    isCategoryBeingCreated={isCategoryBeingCreated}
                    setIsCategoryBeingCreated={setIsCategoryBeingCreated}
                    loadPreviousChat={loadPreviousChat}
                    invalidateMainQueries={invalidateMainQueries}
                />
                <ModalSearchChats
                    categoriesAndChats={categoriesAndChats}
                    isModalOpen={isSearchModalOpen}
                    closeModal={closeSearchModal}
                    loadPreviousChat={loadPreviousChat}
                />
            </div>
        </section>
    );
};


export default AiChatbot;

