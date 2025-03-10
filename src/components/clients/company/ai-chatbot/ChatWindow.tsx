import React, { useEffect, useRef, useState } from "react";
import { answerQuestion, askQuestion, getChatbotThread, uploadFile } from "api/clientChatbot.api";
import { ChatbotThread } from "interfaces/clientDashboard/chatbotThread.interface";
import { Question } from "interfaces/clientDashboard/question.interface";
import { DocumentNode, HistoryNode } from "interfaces/clientDashboard/historyNode.interface";
import { ChatSpaceType } from "interfaces/clientDashboard/ChatSpaceType.enum";
import { message, Spin } from "antd";
import EmptyChat from "./EmptyChat";
import AdminChatHeader from "./AdminChatHeader";
import AdminQuestionField from "./AdminQuestionField";
import { ChatTypeEnum } from "interfaces/clientDashboard/chatType.enum";
import { getAdminUser } from "api/dashboard.api";
import AdminConversation from "./AdminConversation";
import adminSSE from "./adminSSE";

interface ChatWindowProps {
    historyConversation: HistoryNode[];
    filesConversation: DocumentNode[];
    setHistoryConversation: (nodes: HistoryNode[]) => void;
    isLoadingData: boolean;
    selectedChatType: ChatSpaceType;
    setSelectedChatType: (type: ChatSpaceType) => void;
    chatbotThread: ChatbotThread | undefined;
    chatbotThreadType: ChatTypeEnum | undefined;
    setChatbotThread: (chat: ChatbotThread) => void;
    invalidateMainQueries: () => void;
};

const ChatWindow: React.FC<ChatWindowProps> =({
    historyConversation, setHistoryConversation, filesConversation,
    isLoadingData, selectedChatType, setSelectedChatType, 
    chatbotThread, chatbotThreadType, setChatbotThread,
    invalidateMainQueries,
}) => {
    const { data: userData, isLoading: userDataLoading } = getAdminUser();
    const { mutate: fetchChatbotThread, isPending: isFetchingThread } = getChatbotThread();
    const { mutate: sendAnswer, isPending: isSendingQuestion } = answerQuestion();
    const [questionSentence, setQuestionSentence] = useState<string>("");
    const { data, error } = adminSSE(userData?.id, chatbotThread?.id, true);

    useEffect(() => {
        if (!data) { return; }

        const dataReceived = JSON.parse(data);
        if (dataReceived.message.user.typeUser === "USER_COMPANY"){
            const newAnswer: HistoryNode = {
                checkpoint_id: dataReceived.message.id,
                content: dataReceived.message.content,
                role: "user",
            };
            setHistoryConversation([...historyConversation, newAnswer]);
        }
    }, [data]);

    useEffect(() => {
        if (!error) { return; }
        console.error("SW", error);
    }, [error]);

    const handleSend = (question: string) => {
        setQuestionSentence("");
        setSelectedChatType(ChatSpaceType.chatSpace);
        handleAnswer(question);
    }

    const handleAnswer = (answer: string, fetchedThread?: string) => {
        const sendAnswerProcess = (chatbotThreadId: string) => {
            if (!chatbotThreadId) {
                alert("Error sending answer");
                return;
            }
            const payload = {
                threadId: chatbotThreadId,
                message: answer
            };
            
            sendAnswer(payload, { 
                onSuccess: (data) => {
                    //handleServerEvents();
                    //invalidateMainQueries();
                },
                onError: (error, payload) => {
                    console.error("Error:", error);
                },
            });
        }

        if (fetchedThread) {
            addNewUserMessage(answer);
            sendAnswerProcess(fetchedThread);
        } else {
            if (!chatbotThread?.id ) {
                fetchChatbotThread(undefined, {
                    onSuccess: (data) => {
                        setChatbotThread(data);
                        addNewUserMessage(answer);
                        sendAnswerProcess(data.id);
                    },
                    onError: (error) => {
                        console.error("Error:", error);
                    },
                });
            } else {
                addNewUserMessage(answer);
                sendAnswerProcess(chatbotThread.id);
            }
        }
    };

    const addNewUserMessage = (question: string) => {
        const newHistoryConversation: HistoryNode[] = historyConversation;
        const newQuestion: HistoryNode = {
            checkpoint_id: `${Date.now()}`,
            content: question,
            role: "lawyer",
        };
        newHistoryConversation.push(newQuestion);
        setHistoryConversation(newHistoryConversation);
    }

    const getHeaderTitle = () => {
        return chatbotThread?.title ? chatbotThread.title : ""
    }

    return (
        <div className={`h-full border border-greys-300 rounded-lg flex flex-col w-full relative bg-neutrals-white`}>
            <AdminChatHeader title={getHeaderTitle()} />
            {selectedChatType === ChatSpaceType.blankSpace && 
                <EmptyChat />
            }
            {(isSendingQuestion || isFetchingThread || isLoadingData) && (
                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-primaryLinkWater-100 opacity-45 z-10">
                    <Spin size="large" />
                </div>
            )}
                
            {selectedChatType === ChatSpaceType.chatSpace && <>
                <div className="h-full flex flex-col flex-grow gap-4 justify-start items-center">
                    <AdminConversation 
                        historyConversation={historyConversation}
                        filesConversation={filesConversation}
                    />
                </div>
                <AdminQuestionField
                    placeholder="Answer to client"
                    handleSend={handleSend}
                    isLoading={isLoadingData}
                    questionSentence={questionSentence}
                    setQuestionSentence={setQuestionSentence}
                    chatbotThreadType={chatbotThreadType}
                />
            </>}
        </div>
    );
};

export default ChatWindow;
