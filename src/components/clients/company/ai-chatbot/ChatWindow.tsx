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
    
    // Correctly set isLawyer based on user data
    const isLawyer = userData?.user.isLawyer === true;
    
    // Update SSE connection with correct user role
    const { data, error } = adminSSE(userData?.id, chatbotThread?.id, isLawyer);

    useEffect(() => {
        if (userData) {
            console.log("User data:", userData);
            console.log("User type:", userData?.userType);
            console.log("Is lawyer:", isLawyer);
            
            // Log the token from localStorage for debugging
            try {
                const connectionStr = localStorage.getItem("connection");
                if (connectionStr) {
                    const connection = JSON.parse(connectionStr);
                    console.log("Token available:", !!connection.token);
                    // Don't log the full token for security reasons
                }
            } catch (error) {
                console.error("Error reading localStorage:", error);
            }
        }
    }, [userData]);

    useEffect(() => {
        if (!data) { return; }

        try {
            const dataReceived = JSON.parse(data);
            // Process messages from both clients and lawyers
            const newAnswer: HistoryNode = {
                checkpoint_id: dataReceived.message.id,
                content: dataReceived.message.content,
                role: dataReceived.message.user.typeUser === "USER_COMPANY" ? "user" : "lawyer",
            };
            setHistoryConversation([...historyConversation, newAnswer]);
        } catch (error) {
            console.error("Error parsing SSE data:", error);
        }
    }, [data]);

    useEffect(() => {
        if (!error) { return; }
        console.error("SW", error);
    }, [error]);

    useEffect(() => {
        if (chatbotThread?.id) {
            // This forces a refresh of the relevant data when the thread changes
            invalidateMainQueries();
        }
    }, [chatbotThread?.id]);

    const handleSend = (question: string) => {
        setQuestionSentence("");
        setSelectedChatType(ChatSpaceType.chatSpace);
        handleAnswer(question);
    }

    const handleAnswer = (answer: string, fetchedThread?: string) => {
        // Log user info for debugging
        console.log("Current user:", userData);
        console.log("Is lawyer:", isLawyer);
        
        const sendAnswerProcess = (chatbotThreadId: string) => {
            if (!chatbotThreadId) {
                alert("Error sending answer");
                return;
            }
            
            // Determine if we're sending as a lawyer or regular user
            const userType = isLawyer ? "lawyer" : (userData?.userType === 'Admin' ? "admin" : "user");
            
            const payload = {
                threadId: chatbotThreadId,
                message: answer,
                userType: userType
            };
            
            console.log(`Sending answer with payload as ${userType}:`, payload);
            
            sendAnswer(payload, { 
                onSuccess: (data) => {
                    console.log("Message sent successfully:", data);
                },
                onError: (error, payload) => {
                    console.error("Error:", error);
                    // More specific type checking for Axios-like errors
                    if (error && 
                        typeof error === 'object' && 
                        'response' in error && 
                        error.response && 
                        typeof error.response === 'object' && 
                        'data' in error.response) {
                        console.error("Error response data:", error.response.data);
                    }
                    
                    // Even if the server request failed, we still want to show the message in the UI
                    // Add the message to the conversation history anyway
                    const newLawyerMessage: HistoryNode = {
                        checkpoint_id: `error-${Date.now()}`,
                        content: answer,
                        role: "lawyer",
                    };
                    setHistoryConversation([...historyConversation, newLawyerMessage]);
                },
            });
        }

        if (fetchedThread) {
            sendAnswerProcess(fetchedThread);
        } else {
            if (!chatbotThread?.id ) {
                fetchChatbotThread(undefined, {
                    onSuccess: (data) => {
                        setChatbotThread(data);
                        sendAnswerProcess(data.id);
                    },
                    onError: (error) => {
                        console.error("Error:", error);
                    },
                });
            } else {
                sendAnswerProcess(chatbotThread.id);
            }
        }
    };

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
