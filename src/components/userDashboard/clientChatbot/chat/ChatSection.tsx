import React, { useEffect, useRef, useState } from "react";
import { askQuestion, askQuestionWithFile, getChatbotThread, requestALawyer, uploadFile } from "api/clientChatbot.api";
import { ChatbotThread } from "interfaces/clientDashboard/chatbotThread.interface";
import BlankChat from "./fragments/BlankChat";
import { Question, QuestionWithFile } from "interfaces/clientDashboard/question.interface";
import ChatHeader from "./fragments/ChatHeader";
import ClientConversation from "./fragments/ClientConversation";
import QuestionField from "./fragments/QuestionField";
import { DocumentNode, HistoryNode } from "interfaces/clientDashboard/historyNode.interface";
import { ChatSpaceType } from "interfaces/clientDashboard/ChatSpaceType.enum";
import CategoryDetails from "./fragments/CategoryDetails";
import { CategoryThread } from "interfaces/clientDashboard/categoryThread.interface";
import { Spin } from "antd";
import ModalMoveChatToCategory from "../modals/modalMoveChatToCategory";
import { UploadFileToChatParams } from "interfaces/clientDashboard/UploadFileToChat.interface";
import { ChatTypeEnum } from "interfaces/clientDashboard/chatType.enum";
import { getUser } from "api/dashboard.api";
import adminSSE from "components/clients/company/ai-chatbot/adminSSE";

interface ChatSectionProps {
    historyConversation: HistoryNode[];
    filesConversation: DocumentNode[];
    markedPrompts: HistoryNode[];
    setHistoryConversation: (nodes: HistoryNode[]) => void;
    isLoadingData: boolean;
    selectedChatType: ChatSpaceType;
    categoryThreads: CategoryThread[];
    threadsInCategory: ChatbotThread[];
    threadsInCategoryLoading: boolean;
    setSelectedChatType: (type: ChatSpaceType) => void;
    chatbotThread: ChatbotThread | undefined;
    categoryThread: CategoryThread | undefined;
    chatbotThreadType: ChatTypeEnum | undefined;
    setChatbotThread: (chat: ChatbotThread) => void;
    isCategoryBeingCreated: boolean;
    setIsCategoryBeingCreated: (value: boolean) => void;
    loadPreviousChat: (chat: ChatbotThread, title: string) => void;
    invalidateMainQueries: () => void;
};

const ChatSection: React.FC<ChatSectionProps> =({
    historyConversation, filesConversation, markedPrompts, setHistoryConversation, 
    isLoadingData, selectedChatType, categoryThreads, threadsInCategory, 
    threadsInCategoryLoading, setSelectedChatType, chatbotThread, chatbotThreadType, setChatbotThread,
    isCategoryBeingCreated, loadPreviousChat, setIsCategoryBeingCreated, invalidateMainQueries,
    categoryThread
}) => {
    const { data: userData, isLoading: userDataLoading } = getUser();
    const { mutate: fetchChatbotThread, isPending: isFetchingThread } = getChatbotThread();
    const { mutate: sendQuestion, isPending: isSendingQuestion } = askQuestion();
    const { mutate: sendQuestionWithFile, isPending: isSendingQuestionWithFile } = askQuestionWithFile();
    const { mutate: uploadFileToChat, isPending: isUploadingFile } = uploadFile();
    const { mutate: requestLawyer, isPending: requestLawyerLoading } = requestALawyer();
    
    const [questionSentence, setQuestionSentence] = useState<string>("");
    const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);

    const { data, error } = adminSSE(userData?.id, chatbotThread?.id, false);

    useEffect(() => {
        if (!data) { return; }

        const dataReceived = JSON.parse(data);
        if (dataReceived.message.user.typeUser === "USER_STAFF"){
            const newAnswer: HistoryNode = {
                checkpoint_id: dataReceived.message.id,
                content: dataReceived.message.content,
                role: "lawyer",
            };
            setHistoryConversation([...historyConversation, newAnswer]);
        }
    }, [data]);

    useEffect(() => {
        if (!error) { return; }
        console.error("SW", error);
    }, [error]);

    const handleSend = (question: string, file?: File) => {
        setQuestionSentence("");
        setSelectedChatType(ChatSpaceType.chatSpace);
        if (file !== undefined) {
            handleUploadFile(file, question);
        } else {
            if (chatbotThreadType && chatbotThreadType === ChatTypeEnum.ChatLawyer){
                handleLawyerSend(question);
            } else {
                handleQuestion(question);
            }
        }
    }

    const handleLawyerSend = (question: string) => {
        const requestLawyerProcess = (chatbotThreadId: string) => {
            const payload = {
                threadId: chatbotThreadId,
            };

            requestLawyer(payload, { 
                onSuccess: (data:any) => {
                    handleQuestion(question, chatbotThreadId, true);
                },
                onError: (error:any) => {
                    console.error("Error:", error);
                },
            });
        }

        if (!chatbotThread?.id) {
            fetchChatbotThread(undefined, {
                onSuccess: (data) => {
                    setChatbotThread(data);
                    requestLawyerProcess(data.id);
                },
                onError: (error) => {
                    console.error("Error:", error);
                },
            });
        } else {
            requestLawyerProcess(chatbotThread.id);
        }
    }

    const handleUploadFile = (fileToUpload: File, question: string) => {
        const sendFileProcess = (chatbotThreadId: string) => {
            if (!chatbotThreadId) {
                alert("Error sending file");
                return;
            }
            const payload = {
                threadId: chatbotThreadId,
                file: fileToUpload,
            };

            uploadFileToChat(payload, { 
                onSuccess: (data:any) => {
                    const newHistoryConversation: HistoryNode[] = historyConversation;
                    const newAnswer: HistoryNode = {
                        checkpoint_id: `${Date.now()}`,
                        content: fileToUpload.name,
                        role: "document",
                        url: data.url
                    };
                    newHistoryConversation.push(newAnswer);
                    setHistoryConversation(newHistoryConversation);
                    handleQuestion(question, chatbotThreadId,chatbotThreadType && chatbotThreadType === ChatTypeEnum.ChatLawyer, data.id);
                },
                onError: (error:any) => {
                    console.error("Error:", error);
                },
            });
        }
        if (!chatbotThread?.id) {
            fetchChatbotThread(undefined, {
                onSuccess: (data) => {
                    setChatbotThread(data);
                    sendFileProcess(data.id);
                },
                onError: (error) => {
                    console.error("Error:", error);
                },
            });
        } else {
            sendFileProcess(chatbotThread.id);
        }
    }

    const handleQuestion = (question: string, fetchedThread?: string, isForALawyer?: boolean, file_Id?: string) => {
        const sendQuestionProcess = (chatbotThreadId: string) => {
            if (!chatbotThreadId) {
                alert("Error sending question");
                return;
            }

            if (isForALawyer) {
                sendQuestionForLawyer();
            } else {
                sendQuestionForAI();
            }

            function sendQuestionForLawyer()
            {
                const payload: QuestionWithFile = {
                    thread_id: chatbotThreadId,
                    prompt: question,
                    fileId: file_Id || null
                };
                sendQuestionWithFile(payload, {
                    onSuccess: (data) =>
                    {
                        setSelectedChatType(ChatSpaceType.chatSpace);
                        invalidateMainQueries();
                        const foundNode = historyConversation.find((node: HistoryNode) => node.checkpoint_id === "1234567890");
                        if (!foundNode)
                        {
                            const newHistoryConversation: HistoryNode[] = historyConversation;
                            const newAnswer: HistoryNode = {
                                checkpoint_id: `1234567890`,
                                content: "The lawyer has been informed and will provide a response shortly. Their reply will be documented here.",
                                role: "ai",
                            };
                            newHistoryConversation.push(newAnswer);
                            setHistoryConversation(newHistoryConversation);
                        }
                    },
                    onError: (error, payload) =>
                    {
                        console.error("Error:", error);
                    },
                });
            }

            function sendQuestionForAI()
            {
                const payload: Question = {
                    thread_id: chatbotThreadId,
                    prompt: question,
                };

                sendQuestion(payload, {
                    onSuccess: (data) =>
                    {
                        const newHistoryConversation: HistoryNode[] = historyConversation;
                        const newAnswer: HistoryNode = {
                            checkpoint_id: `${Date.now()}`,
                            content: data.response,
                            role: "ai",
                        };
                        newHistoryConversation.push(newAnswer);
                        setHistoryConversation(newHistoryConversation);
                        //invalidateMainQueries();
                    },
                    onError: (error, payload) =>
                    {
                        console.error("Error:", error);
                    },
                });
            }

        }

        if (fetchedThread) {
            addNewUserMessage(question);
            sendQuestionProcess(fetchedThread);
        } else {
            if (!chatbotThread?.id ) {
                fetchChatbotThread(undefined, {
                    onSuccess: (data) => {
                        setChatbotThread(data);
                        addNewUserMessage(question);
                        sendQuestionProcess(data.id);
                    },
                    onError: (error) => {
                        console.error("Error:", error);
                    },
                });
            } else {
                addNewUserMessage(question);
                sendQuestionProcess(chatbotThread.id);
            }
        }
    };

    const addNewUserMessage = (question: string) => {
        const newHistoryConversation: HistoryNode[] = historyConversation;
        const newQuestion: HistoryNode = {
            checkpoint_id: `${Date.now()}`,
            content: question,
            role: "user",
        };
        newHistoryConversation.push(newQuestion);
        setHistoryConversation(newHistoryConversation);
    }

    const getHeaderTitle = () => {
        switch (selectedChatType) {
            case ChatSpaceType.blankSpace:
                return "New Chat";
            case ChatSpaceType.chatSpace:
                return chatbotThread?.title ? chatbotThread.title : "New Chat";
            case ChatSpaceType.categorySpace:
                return categoryThread?.name ? categoryThread.name : "New Category";
            case ChatSpaceType.historySpace:
                return "";
        }
    }

    const showMoveModal = () => {
        setIsMoveModalOpen(true);
    };

    const hideMoveModal = () => {
        setIsMoveModalOpen(false);
    };

    return (
        <div className={`${selectedChatType === ChatSpaceType.historySpace ?  "hidden" : "flex"} 
        h-full border border-greys-300 md:rounded-lg flex-col w-full relative bg-neutrals-white`}>
            <ChatHeader 
                title={getHeaderTitle()}
                setChatType={setSelectedChatType}
                chatType={selectedChatType}
                showModal={showMoveModal}
                id={chatbotThread?.id || categoryThread?.id || ""}
                invalidateMainQueries={invalidateMainQueries}
            />
            {selectedChatType === ChatSpaceType.blankSpace && 
                <BlankChat 
                    handleSend={handleSend}
                    markedPrompts={markedPrompts}
                    handleLawyerSend={handleLawyerSend}
                    chatbotThreadType={chatbotThreadType}
                />
            }
            {(isSendingQuestion || isFetchingThread || isLoadingData || threadsInCategoryLoading || isCategoryBeingCreated || isUploadingFile) && (
                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-primaryLinkWater-100 opacity-45 z-10">
                    <Spin size="large" />
                </div>
            )}
                
            {selectedChatType === ChatSpaceType.chatSpace && <>
                <div className="h-full flex flex-col flex-grow gap-4 justify-start items-center">
                    <ClientConversation 
                        historyConversation={historyConversation}
                        filesConversation={filesConversation}
                    />
                </div>
                <QuestionField
                    placeholder="How can I help you today?"  
                    handleSend={handleSend}
                    handleLawyerSend={handleLawyerSend}
                    isLoading={isLoadingData}
                    questionSentence={questionSentence}
                    setQuestionSentence={setQuestionSentence}
                    chatbotThreadType={chatbotThreadType}
                />
            </>}
            {selectedChatType === ChatSpaceType.categorySpace && 
                <CategoryDetails
                    handleSend={handleSend}
                    threadsInCategory={threadsInCategory}
                    loadPreviousChat={loadPreviousChat}
                    categoryThread={categoryThread}
                    handleLawyerSend={handleLawyerSend}
                    chatbotThreadType={chatbotThreadType}
                />
            }
            <ModalMoveChatToCategory
                categories={categoryThreads}
                isModalOpen={isMoveModalOpen}
                closeModal={hideMoveModal}
                chatbotThreadId={chatbotThread?.id}
                setIsCategoryBeingCreated={setIsCategoryBeingCreated}
            />
        </div>
    );
};

export default ChatSection;

