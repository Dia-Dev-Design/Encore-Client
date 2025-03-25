import React, { useEffect, useRef, useState } from "react";
import { askQuestion, askQuestionWithFile, getChatbotThread, requestALawyer, uploadFile, useStreamQuestion } from "api/clientChatbot.api";
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
import { useParams } from "react-router-dom";

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
    const { mutate: streamQuestionMutation, isPending: isStreamingQuestion } = useStreamQuestion();
    
    const [localHistoryConversation, setLocalHistoryConversation] = useState<HistoryNode[]>([]);

     const previousThreadIdRef = useRef<string | undefined>(undefined);    
     
     const params = useParams()

     useEffect(() => {
         console.log("These are the params of where I'm being called======>>", params)
     }, [])


    
    useEffect(() => {
        // Keep track of the current thread ID to detect changes
        const currentThreadId = chatbotThread?.id;
        const hasThreadChanged = currentThreadId !== previousThreadIdRef.current;        
        
        // Check if parent history has changed significantly
        const isParentHistoryChanged = 
            // Check length differences
            historyConversation.length !== localHistoryConversation.length ||
            // Or check content differences by comparing checkpoint IDs
            (historyConversation.length > 0 && localHistoryConversation.length > 0 &&
             JSON.stringify(historyConversation.map(h => h.checkpoint_id)) !== 
             JSON.stringify(localHistoryConversation.map(h => h.checkpoint_id)));
        
        // If thread changed or history changed, update local history
        if (hasThreadChanged || isParentHistoryChanged) {
            // Update local history with parent history
            setLocalHistoryConversation(historyConversation);
            // Update the ref to current thread ID
            previousThreadIdRef.current = currentThreadId;
        }
        
        // If we're switching to a new empty thread, clear local history
        if (currentThreadId && historyConversation.length === 0 && localHistoryConversation.length > 0) {
            setLocalHistoryConversation([]);
            previousThreadIdRef.current = currentThreadId;
        }
    }, [historyConversation, localHistoryConversation, chatbotThread?.id]);
    
    const [questionSentence, setQuestionSentence] = useState<string>("");
    const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const placeholderIdRef = useRef<string | null>(null);
    const [streamingContent, setStreamingContent] = useState<string>("");

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
                    // Create a new document node
                    const newDocumentNode: HistoryNode = {
                        checkpoint_id: `${Date.now()}`,
                        content: fileToUpload.name,
                        role: "document",
                        url: data.url
                    };
                    
                    // Create a new history array with the document node added
                    const updatedHistory = [...historyConversation, newDocumentNode];
                    setHistoryConversation(updatedHistory);
                    
                    handleQuestion(question, chatbotThreadId, chatbotThreadType && chatbotThreadType === ChatTypeEnum.ChatLawyer, data.id);
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
                // Only add user message explicitly for lawyer flows
                addNewUserMessage(question);
                sendQuestionForLawyer();
            } else {
                // For AI flow, the user message is added inside sendQuestionForAI
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
                            const newAnswer: HistoryNode = {
                                checkpoint_id: `1234567890`,
                                content: "The lawyer has been informed and will provide a response shortly. Their reply will be documented here.",
                                role: "ai",
                            };
                            
                            // Create a new history array with the answer added
                            setHistoryConversation([...historyConversation, newAnswer]);
                        }
                    },
                    onError: (error, payload) =>
                    {
                        console.error("Error:", error);
                    },
                });
            }

            function sendQuestionForAI() {
                const payload: Question = {
                    thread_id: chatbotThreadId,
                    prompt: question,
                };

                // Generate a placeholder ID and store it in the ref
                const placeholderId = `ai-${Date.now()}`;
                placeholderIdRef.current = placeholderId;
                
                // Reset streaming content
                setStreamingContent("");

                // Create a new user question node first
                const userQuestionNode: HistoryNode = {
                    checkpoint_id: `user-${Date.now()}`,
                    content: question,
                    role: "user",
                };

                // Add a placeholder message immediately
                const placeholderAnswer: HistoryNode = {
                    checkpoint_id: placeholderId,
                    content: "",
                    role: "ai",
                    isStreaming: true
                };
                
                // Create new history with both user question and AI placeholder
                // This ensures both messages are added in a single state update
                const initialHistory = [...localHistoryConversation, userQuestionNode, placeholderAnswer];
                
                // Update both local state and parent state
                setLocalHistoryConversation(initialHistory);
                setHistoryConversation(initialHistory);

                // Set streaming state to true
                setIsStreaming(true);
                
                // Call the streaming mutation with properly separated handlers
                streamQuestionMutation({
                    params: payload,
                    onChunk: (partialResponse) => {                        
                        // Update the streaming content state directly
                        setStreamingContent(partialResponse);
                        
                        setTimeout(() => {
                            // Use the updater function pattern to ensure we're using the latest state
                            const updateWithChunk = (currentHistory: HistoryNode[]) => {
                                // Make a safe copy of the current history
                                return currentHistory.map((node: HistoryNode): HistoryNode => {
                                    // Only update the node with the matching placeholder ID
                                    if (node.checkpoint_id === placeholderIdRef.current) {
                                        return {
                                            ...node,
                                            content: partialResponse,
                                            isStreaming: true
                                        };
                                    }
                                    return node;
                                });
                            };
                            // Update local state first
                            setLocalHistoryConversation((currentHistory: HistoryNode[]) => {
                                const updatedHistory = updateWithChunk(currentHistory);
                                // Also update parent state to keep them in sync
                                setHistoryConversation(updatedHistory);
                                return updatedHistory;
                            });

                        }, 0);
                    },
                    onComplete: () => {                        
                        // IMPORTANT: We need to capture the current state for both variables
                        // to avoid closure issues with outdated state
                        const currentPlaceholderId = placeholderIdRef.current;
                        
                        // Use a function to get the most recent history state
                        setLocalHistoryConversation(prevHistory => {
                            // Find the streaming message in the current history
                            const aiMessageIndex = prevHistory.findIndex(
                                node => node.checkpoint_id === currentPlaceholderId
                            );
                            
                            if (aiMessageIndex === -1) {
                                console.error("Could not find streaming message in history");
                                return prevHistory;
                            }
                            
                            // Get the actual content from the current history
                            const finalContent = prevHistory[aiMessageIndex].content;
                            
                            // Create the updated history with the streaming message finalized
                            const updatedHistory = prevHistory.map(node => {
                                if (node.checkpoint_id === currentPlaceholderId) {
                                    return {
                                        ...node,
                                        content: finalContent,
                                        isStreaming: false
                                    };
                                }
                                return node;
                            });
                            
                            // Update parent state immediately to avoid sync issues
                            setHistoryConversation(updatedHistory);
                            
                            // After a small delay, reset streaming state
                            setTimeout(() => {
                                setIsStreaming(false);
                                placeholderIdRef.current = null;
                            }, 100);
                            
                            return updatedHistory;
                        });
                        
                        // IMPORTANT: Don't invalidate queries that would replace the history
                    }
                });
            }
        }

        if (fetchedThread) {
            sendQuestionProcess(fetchedThread);
        } else {
            if (!chatbotThread?.id ) {
                fetchChatbotThread(undefined, {
                    onSuccess: (data) => {
                        setChatbotThread(data);
                        sendQuestionProcess(data.id);
                    },
                    onError: (error) => {
                        console.error("Error:", error);
                    },
                });
            } else {
                sendQuestionProcess(chatbotThread.id);
            }
        }
    };

    const addNewUserMessage = (question: string) => {
        // Create a new question node
        const newQuestion: HistoryNode = {
            checkpoint_id: `user-${Date.now()}`,
            content: question,
            role: "user",
        };
        
        // Create a completely new array with the new message added
        const updatedHistory = [...localHistoryConversation, newQuestion];
        
        // Update both local and parent state
        setLocalHistoryConversation(updatedHistory);
        setHistoryConversation(updatedHistory);
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
            {(isFetchingThread || isLoadingData || threadsInCategoryLoading || 
              isCategoryBeingCreated || isUploadingFile || 
              (isSendingQuestion && !isStreaming)) && (
                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-primaryLinkWater-100 opacity-45 z-10">
                    <Spin size="large" />
                </div>
            )}
                
            {selectedChatType === ChatSpaceType.chatSpace && <>
                <div className="h-full flex flex-col flex-grow gap-4 justify-start items-center">
                    <ClientConversation 
                        historyConversation={localHistoryConversation}
                        filesConversation={filesConversation}
                    />
                </div>
                <QuestionField
                    placeholder="How can I help you today?"  
                    handleSend={handleSend}
                    handleLawyerSend={handleLawyerSend}
                    isLoading={isLoadingData || isStreaming}
                    questionSentence={questionSentence}
                    setQuestionSentence={setQuestionSentence}
                    chatbotThreadType={chatbotThreadType}
                    chatbotThreadId={chatbotThread?.id}
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

