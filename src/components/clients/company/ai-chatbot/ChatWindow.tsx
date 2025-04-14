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
    selectedChatId: string;
    setChatbotThread: (chat: ChatbotThread) => void;
    invalidateMainQueries: () => void;
};

const ChatWindow: React.FC<ChatWindowProps> = ({
    historyConversation, setHistoryConversation, filesConversation,
    isLoadingData, selectedChatType, setSelectedChatType, 
    chatbotThread, chatbotThreadType, setChatbotThread, selectedChatId,
    invalidateMainQueries,
}) => {
    const { data: userData, isLoading: userDataLoading } = getAdminUser();
    const { mutate: fetchChatbotThread, isPending: isFetchingThread } = getChatbotThread();
    const { mutate: sendAnswer, isPending: isSendingQuestion } = answerQuestion();
    const [questionSentence, setQuestionSentence] = useState<string>("");
    
    // Set isLawyer based on user data
    const isLawyer = userData?.user.isLawyer === true;

    console.log("Do we have a lawyer", isLawyer);
    
    // Update SSE connection with correct user role
    const { data, error } = adminSSE(userData?.id, chatbotThread?.id, isLawyer);

    // Track processed message IDs to prevent duplicates
    const processedMessageIds = useRef(new Set<string>());

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
                }
            } catch (error) {
                console.error("Error reading localStorage:", error);
            }
        }
    }, [userData]);

    // Initialize tracking set with current message IDs
    useEffect(() => {
        // Reset the tracking set when conversation changes completely
        processedMessageIds.current = new Set(
            historyConversation
                .filter(msg => msg.checkpoint_id && !msg.checkpoint_id.startsWith('msg-'))
                .map(msg => msg.checkpoint_id)
        );
        
        console.log("Initialized processed message IDs:", 
            Array.from(processedMessageIds.current));
    }, []);

    // Process incoming SSE data
// Update the SSE data processing effect
useEffect(() => {
    if (!data) return;

    try {
        const dataReceived = JSON.parse(data);
        const messageId = dataReceived.message.id;
        
        // Skip if we've already processed this message
        if (messageId && processedMessageIds.current.has(messageId)) {
            console.log("Skipping already processed SSE message:", messageId);
            return;
        }
        
        // Add to tracking set
        if (messageId) {
            processedMessageIds.current.add(messageId);
        }
        
        // Process messages from both clients and lawyers
        const newAnswer: HistoryNode = {
            checkpoint_id: messageId,
            content: dataReceived.message.content,
            role: dataReceived.message.user.typeUser === "USER_COMPANY" ? "user" : "lawyer",
            forLawyer: isLawyer,
            isStreaming: false,
            isError: false
        };
        
        // Create a new array with the updated conversation
        const updatedConversation = [...historyConversation];
        
        // Check if message already exists
        const existingMsgIndex = updatedConversation.findIndex(
            msg => msg.checkpoint_id === messageId
        );
        
        if (existingMsgIndex >= 0) {
            console.log("Message already exists in history");
            return; // No need to update
        }
        
        // Check for temporary message with matching content to replace
        const tempIndex = updatedConversation.findIndex(msg => 
            msg.checkpoint_id.startsWith('msg-') &&
            msg.content === newAnswer.content &&
            msg.role === newAnswer.role
        );
        
        if (tempIndex >= 0) {
            console.log("Replacing temporary message with real one");
            updatedConversation[tempIndex] = newAnswer;
        } else {
            // Otherwise add as new message
            updatedConversation.push(newAnswer);
        }
        
        // Update the state with the new array
        setHistoryConversation(updatedConversation);
    } catch (error) {
        console.error("Error parsing SSE data:", error);
    }
}, [data, historyConversation, setHistoryConversation]);

    // Handle SSE errors
    useEffect(() => {
        if (!error) return;
        console.error("SSE error:", error);
    }, [error]);

    // Invalidate queries when thread changes
    useEffect(() => {
        if (chatbotThread?.id) {
            invalidateMainQueries();
        }
    }, [chatbotThread?.id, invalidateMainQueries]);

    const handleSend = (question: string) => {
        setSelectedChatType(ChatSpaceType.chatSpace);
        handleAnswer(question);
        setQuestionSentence("");
    };

    const handleAnswer = (answer: string, fetchedThread?: string) => {
        console.log("Current user:", userData);
        console.log("Is lawyer:", isLawyer);
        
        const sendAnswerProcess = (chatbotThreadId: string) => {
            if (!chatbotThreadId) {
                message.error("Error sending answer: No thread ID");
                return;
            }
            
            // Generate a temporary ID for optimistic updates
            const tempId = `msg-${Date.now()}`;
            
            // Determine role and message type based on user
            const userRole = isLawyer ? "lawyer" : (userData?.userType === 'Admin' ? "admin" : "user");
            const messageType = isLawyer ? "admin" : "USER_COMPANY";
            const forLawyer = userRole === "user";
            
            // Create optimistic message object
            const optimisticMessage: HistoryNode = {
                checkpoint_id: tempId,
                content: answer,
                role: userRole,
                forLawyer: forLawyer,
                isStreaming: false,
                isError: false
            };
            
            // Add to conversation immediately
            const updatedConversation = [...historyConversation, optimisticMessage];
            setHistoryConversation(updatedConversation);
            
            // Prepare payload for API
            const payload = {
                threadId: chatbotThreadId,
                message: answer,
                userType: messageType,
                forLawyer: forLawyer
            };
            
            console.log(`Sending answer with payload as ${userRole}:`, payload);
            
            // Send to server
            sendAnswer(payload, {
                onSuccess: (data) => {
                    console.log("Message sent successfully:", data);
                    // Successful message delivery is handled by the real-time subscription
                },
                onError: (error) => {
                    console.error("Error sending message:", error);
                    
                    // Mark the optimistic message as error
                    const errorUpdatedConversation = historyConversation.map(msg => 
                        msg.checkpoint_id === tempId 
                            ? { ...msg, isError: true } 
                            : msg
                    );
                    setHistoryConversation(errorUpdatedConversation);
                    
                    // Show error notification
                    message.error("Failed to send message. Please try again.");
                }
            });
        };
    
        // Handle thread creation if needed
        if (fetchedThread) {
            sendAnswerProcess(fetchedThread);
        } else {
            if (!chatbotThread?.id) {
                fetchChatbotThread(undefined, {
                    onSuccess: (data) => {
                        setChatbotThread(data);
                        sendAnswerProcess(data.id);
                    },
                    onError: (error) => {
                        console.error("Error creating thread:", error);
                        message.error("Could not create a new conversation thread");
                    },
                });
            } else {
                sendAnswerProcess(chatbotThread.id);
            }
        }
    };

    const getHeaderTitle = () => {
        return chatbotThread?.title ? chatbotThread.title : "";
    };

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
                
            {selectedChatType === ChatSpaceType.chatSpace && (
                <>
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
                </>
            )}
        </div>
    );
};

export default ChatWindow;
