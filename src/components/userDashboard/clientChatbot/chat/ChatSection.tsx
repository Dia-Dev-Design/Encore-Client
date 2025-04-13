import React, { useEffect, useRef, useState } from "react";
import {
  askQuestion,
  askQuestionWithFile,
  getChatbotThread,
  getChatHistory,
  useRequestALawyer,
  uploadFile,
  useStreamQuestion,
  createCategory,
  getCategories,
  getCategoriesAndChats,
  getChatsFromCategory,
} from "api/clientChatbot.api";
import { ChatbotThread } from "interfaces/clientDashboard/chatbotThread.interface";

import BlankChat from "./fragments/BlankChat";
import {
  Question,
  QuestionWithFile,
} from "interfaces/clientDashboard/question.interface";
import ChatHeader from "./fragments/ChatHeader";
import ClientConversation from "./fragments/ClientConversation";
import QuestionField from "./fragments/QuestionField";
import {
  DocumentNode,
  HistoryNode,
} from "interfaces/clientDashboard/historyNode.interface";
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

import { useSupabase } from "context/supabase.contest";

interface ChatSectionProps {
  historyConversation: HistoryNode[];
  filesConversation: DocumentNode[];
  markedPrompts: HistoryNode[];
  setHistoryConversation: (nodes: HistoryNode[]) => void;
  isLoadingData: boolean;
  chatId: string;
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
}

const ChatSection: React.FC<ChatSectionProps> = ({
  historyConversation,
  filesConversation,
  markedPrompts,
  setHistoryConversation,
  isLoadingData,
  selectedChatType,
  categoryThreads,
  threadsInCategory,
  threadsInCategoryLoading,
  setSelectedChatType,
  chatbotThread,
  chatbotThreadType,
  setChatbotThread,
  isCategoryBeingCreated,
  loadPreviousChat,
  setIsCategoryBeingCreated,
  invalidateMainQueries,
  categoryThread,
  chatId,
}) => {
  const supabase = useSupabase();
  const { data: userData, isLoading: userDataLoading } = getUser();
  const { mutate: fetchChatbotThread, isPending: isFetchingThread } =
    getChatbotThread();
  const { mutate: sendQuestion, isPending: isSendingQuestion } = askQuestion();
  const { mutate: sendQuestionWithFile, isPending: isSendingQuestionWithFile } =
    askQuestionWithFile();
  const { mutate: uploadFileToChat, isPending: isUploadingFile } = uploadFile();
  const { mutate: requestALawyerMutate, isPending: requestLawyerLoading } = useRequestALawyer({
    onSuccess: () => {
      // Handle success
    },
    onError: (error) => {
      // Handle error
    }
  });
  const { mutate: streamQuestionMutation, isPending: isStreamingQuestion } =
    useStreamQuestion();

  const [questionSentence, setQuestionSentence] = useState<string>("");
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [gettingLawer, setIsGettingLawyer] = useState(false);
  const [thisChatId, setThisChatId] = useState("");
  const placeholderIdRef = useRef<string | null>(null);
  const [streamingContent, setStreamingContent] = useState<string>("");

  const { data, error } = adminSSE(userData?.id, chatbotThread?.id, false);

  const [localHistoryConversation, setLocalHistoryConversation] = useState<
    HistoryNode[]
  >([]);

  const previousThreadIdRef = useRef<string | undefined>(undefined);

  const params = useParams();

  const { data: chatHistoryData, isLoading: chatHistoryLoading } =
    getChatHistory("CHAT_HISTORY", thisChatId);

  // NEW FUNCTION: Check if a lawyer is involved in the conversation
  const isLawyerInvolved = (): boolean => {
    // Check if this is explicitly a lawyer chat type
    if (chatbotThreadType === ChatTypeEnum.ChatLawyer) {
      return true;
    }
    
    // Check if any message in the history is from a lawyer
    return localHistoryConversation.some(node => node.role === 'lawyer');
  };

  // Function to add a new user message to the conversation
  const addNewUserMessage = (question: string) => {
    const newQuestion: HistoryNode = {
      checkpoint_id: `user-${Date.now()}`,
      content: question,
      role: "user",
      forLawyer: isLawyerInvolved(),
    };

    const updatedHistory = [...localHistoryConversation, newQuestion];
    setLocalHistoryConversation(updatedHistory);
    setHistoryConversation(updatedHistory);
  };

  // Function to send a question to a lawyer
// Function to send a question to a lawyer
const sendQuestionForLawyer = (question: string, chatThreadId: string, fileId?: string) => {
  const payload: QuestionWithFile = {
    thread_id: chatThreadId,
    prompt: question,
    fileId: fileId || null,
    forLawyer: true,
  };
  
  // Check if we already have lawyer messages in the conversation
  const lawyerAlreadyActive = localHistoryConversation.some(msg => msg.role === "lawyer");
  
  sendQuestionWithFile(payload, {
    onSuccess: (data) => {
      setSelectedChatType(ChatSpaceType.chatSpace);
      invalidateMainQueries();
      
      // Only show the "lawyer has been informed" message if:
      // 1. We don't already have this placeholder message AND
      // 2. There are no lawyer messages yet in the conversation
      const foundPlaceholder = localHistoryConversation.find(
        (node: HistoryNode) => node.checkpoint_id === "1234567890" || 
                               node.content.includes("lawyer has been informed")
      );
      
      if (!foundPlaceholder && !lawyerAlreadyActive) {
        const newAnswer: HistoryNode = {
          checkpoint_id: `1234567890`,
          content:
            "The lawyer has been informed and will provide a response shortly. Their reply will be documented here.",
          role: "ai",
          forLawyer: true,
        };
        
        const updatedHistory = [...localHistoryConversation, newAnswer];
        setLocalHistoryConversation(updatedHistory);
        setHistoryConversation(updatedHistory);
      }
    },
    onError: (error) => {
      console.error("Error sending question to lawyer:", error);
    },
  });
};

  // Function to send a question to AI
  const sendQuestionForAI = (question: string, chatThreadId: string) => {
    // IMPORTANT: Check if a lawyer is involved before sending to AI
    if (isLawyerInvolved()) {
      console.log("Lawyer is involved - redirecting to lawyer flow instead of AI");
      addNewUserMessage(question);
      sendQuestionForLawyer(question, chatThreadId);
      return;
    }

    const payload: Question = {
      thread_id: chatThreadId,
      prompt: question,
    };

    // Generate a placeholder ID and store it in the ref
    const placeholderId = `ai-${Date.now()}`;
    placeholderIdRef.current = placeholderId;

    // Reset streaming content
    setStreamingContent("");

    // Create a new user question node
    const userQuestionNode: HistoryNode = {
      checkpoint_id: `user-${Date.now()}`,
      content: question,
      role: "user",
      forLawyer: false,
    };

    // Add a placeholder message for AI response
    const placeholderAnswer: HistoryNode = {
      checkpoint_id: placeholderId,
      content: "",
      role: "ai",
      isStreaming: true,
      forLawyer: false,
    };

    // Create new history with both messages
    const initialHistory = [
      ...localHistoryConversation,
      userQuestionNode,
      placeholderAnswer,
    ];

    // Update states
    setLocalHistoryConversation(initialHistory);
    setHistoryConversation(initialHistory);
    setIsStreaming(true);

    // Call the streaming mutation
    streamQuestionMutation({
      params: payload,
      onChunk: (partialResponse) => {
        setStreamingContent(partialResponse);

        setTimeout(() => {
          setLocalHistoryConversation((currentHistory: HistoryNode[]) => {
            const updatedHistory = currentHistory.map((node: HistoryNode): HistoryNode => {
              if (node.checkpoint_id === placeholderIdRef.current) {
                return {
                  ...node,
                  content: partialResponse,
                  isStreaming: true,
                };
              }
              return node;
            });
            
            setHistoryConversation(updatedHistory);
            return updatedHistory;
          });
        }, 0);
      },
      onComplete: () => {
        const currentPlaceholderId = placeholderIdRef.current;

        setLocalHistoryConversation((prevHistory) => {
          const aiMessageIndex = prevHistory.findIndex(
            (node) => node.checkpoint_id === currentPlaceholderId
          );

          if (aiMessageIndex === -1) {
            console.error("Could not find streaming message in history");
            return prevHistory;
          }

          const finalContent = prevHistory[aiMessageIndex].content;

          const updatedHistory = prevHistory.map((node) => {
            if (node.checkpoint_id === currentPlaceholderId) {
              return {
                ...node,
                content: finalContent,
                isStreaming: false,
              };
            }
            return node;
          });

          setHistoryConversation(updatedHistory);

          setTimeout(() => {
            setIsStreaming(false);
            placeholderIdRef.current = null;
            requestALawyerMutate({ threadId: chatThreadId })
          }, 100);

          return updatedHistory;
        });
      }
    });
  };

  // Handle lawyer chat request
  const handleLawyerSend = (question: string) => {
    const requestLawyerProcess = (chatbotThreadId: string) => {
      const payload = {
        threadId: chatbotThreadId,
      };
  
      requestALawyerMutate(payload, {
        onSuccess: () => {
          // Add user message
          addNewUserMessage(question);
          
          // Mark this thread as a lawyer thread permanently
          // To ensure future messages go to lawyer
          if (chatbotThreadType !== ChatTypeEnum.ChatLawyer) {
            // Add a system message indicating lawyer handoff
            const systemMessage: HistoryNode = {
              checkpoint_id: `system-${Date.now()}`,
              content: "Your conversation has been transferred to a lawyer. The AI assistant will no longer respond.",
              role: "system",
              forLawyer: false,
              isStreaming: false,
              isError: false,
            };
            
            const updatedHistory = [...localHistoryConversation, systemMessage];
            setLocalHistoryConversation(updatedHistory);
            setHistoryConversation(updatedHistory);
          }
          
          // Send the question to lawyer
          sendQuestionForLawyer(question, chatbotThreadId);
        },
        onError: (error) => {
          console.error("Error requesting lawyer:", error);
        },
      });
    };

    if (!chatbotThread?.id) {
      fetchChatbotThread(undefined, {
        onSuccess: (data) => {
          setChatbotThread(data);
          requestLawyerProcess(data.id);
        },
        onError: (error) => {
          console.error("Error fetching chatbot thread:", error);
        },
      });
    } else {
      requestLawyerProcess(chatbotThread.id);
    }
  };

  // Handle file upload
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
        onSuccess: (data) => {
          // Add document node
          const newDocumentNode: HistoryNode = {
            checkpoint_id: `${Date.now()}`,
            content: fileToUpload.name,
            role: "document",
            url: data.url,
            forLawyer: chatbotThreadType === ChatTypeEnum.ChatLawyer || isLawyerInvolved(),
          };

          const updatedHistory = [...localHistoryConversation, newDocumentNode];
          setLocalHistoryConversation(updatedHistory);
          setHistoryConversation(updatedHistory);

          // Process question with the uploaded file
          if (chatbotThreadType === ChatTypeEnum.ChatLawyer || isLawyerInvolved()) {
            addNewUserMessage(question);
            sendQuestionForLawyer(question, chatbotThreadId, data.id);
          } else {
            sendQuestionForAI(question, chatbotThreadId);
          }
        },
        onError: (error) => {
          console.error("Error uploading file:", error);
        },
      });
    };

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
  };

  // Main send function
  const handleSend = (question: string, file?: File) => {
    setQuestionSentence("");
    setSelectedChatType(ChatSpaceType.chatSpace);
    
    if (file !== undefined) {
      handleUploadFile(file, question);
    } else {
      // Check if a lawyer is already involved before deciding the flow
      if (chatbotThreadType === ChatTypeEnum.ChatLawyer || isLawyerInvolved()) {
        handleLawyerSend(question);
      } else {
        // Process normal AI question
        const processQuestion = (chatbotThreadId: string) => {
          sendQuestionForAI(question, chatbotThreadId);
        };

        if (!chatbotThread?.id) {
          fetchChatbotThread(undefined, {
            onSuccess: (data) => {
              setChatbotThread(data);
              processQuestion(data.id);
            },
            onError: (error) => {
              console.error("Error:", error);
            },
          });
        } else {
          processQuestion(chatbotThread.id);
        }
      }
    }
  };

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
  };

  const showMoveModal = () => {
    setIsMoveModalOpen(true);
  };

  const hideMoveModal = () => {
    setIsMoveModalOpen(false);
  };

  // Effects
  useEffect(() => {
    setThisChatId(chatId);
  }, [chatId]);

  useEffect(() => {
    if (chatHistoryData && chatHistoryData.response) {
      if (
        chatHistoryData.response.messages &&
        Array.isArray(chatHistoryData.response.messages)
      ) {
        const cleanedMessages = chatHistoryData.response.messages.map(
          (msg: HistoryNode, index: number) => {
            const historyNode: HistoryNode = {
              checkpoint_id:
                msg.checkpoint_id || `history-${index}-${Date.now()}`,
              content: msg.content || "",
              role: msg.role,
              fileId: msg.fileId || undefined,
              url: msg.url || undefined,
              isStreaming: false,
              isError: false,
              forLawyer: msg.forLawyer,
            };

            return historyNode;
          }
        );

        setSelectedChatType(ChatSpaceType.chatSpace);
        setHistoryConversation(cleanedMessages);
      }
    }
  }, [chatHistoryData, setHistoryConversation, setSelectedChatType]);


  useEffect(() => {
    if (!chatId) return;
  
    console.log("Setting up subscription for chat ID:", chatId);
  
    // Create a more reliable channel name
    const channelName = `chat_messages_${chatId}_${Date.now()}`;
  
    // Subscribe to both ChatLawyerMessage and any other relevant tables
    const channel = supabase
      .channel(channelName)
      // .on(
      //   "postgres_changes",
      //   {
      //     event: "*", // Listen for all events (INSERT, UPDATE, DELETE)
      //     schema: "public",
      //     table: "ChatLawyerMessage",
      //     filter: `ChatThreadId=eq.${chatId}`,
      //   },
      //   (payload: { new: any; old: any; eventType: string }) => {
      //     console.log("Chat lawyer message event:", payload);
          
      //     // Only process INSERT events for new messages
      //     if (payload.eventType !== "INSERT" || !payload.new) return;
        
      //     if (payload.new && (payload.new.role === "lawyer" || payload.new.user_type === "lawyer")) {
      //       console.log("Received lawyer message:", payload.new);
            
      //       // Create a proper HistoryNode from the payload
      //       const newLawyerMessage: HistoryNode = {
      //         checkpoint_id: payload.new.id || `lawyer-${Date.now()}`,
      //         content: payload.new.content || payload.new.message || "",
      //         role: "lawyer",
      //         forLawyer: false,
      //         isStreaming: false,
      //         isError: false
      //       };
        
      //       // Update the conversation with the new message
      //       setLocalHistoryConversation(prev => [...prev, newLawyerMessage]);
      //       setHistoryConversation([...historyConversation, newLawyerMessage]);
            
      //       // Check if we need to show a system message about lawyer joining
      //       const hasLawyerAlready = localHistoryConversation.some(
      //         node => node.role === "lawyer"
      //       );
            
      //       const hasSystemMessage = localHistoryConversation.some(
      //         node => node.role === "system" && 
      //               (node.content.includes("lawyer has joined") || 
      //                node.content.includes("transferred to a lawyer"))
      //       );
            
      //       if (!hasLawyerAlready && !hasSystemMessage && 
      //           chatbotThreadType !== ChatTypeEnum.ChatLawyer) {
      //         // Add a system message indicating lawyer has joined
      //         setTimeout(() => {
      //           const systemMessage: HistoryNode = {
      //             checkpoint_id: `system-${Date.now() + 1}`,
      //             content: "A lawyer has joined the conversation. The AI assistant will no longer respond.",
      //             role: "system",
      //             forLawyer: false,
      //             isStreaming: false,
      //             isError: false,
      //           };
                
      //           setLocalHistoryConversation(prev => [...prev, systemMessage]);
      //           setHistoryConversation([...historyConversation, systemMessage]);
      //         }, 500);
      //       }
      //     }
      //   }
      // )
      // Also listen to any general chat message table if needed
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ChatLawyerMessage", // Add any other relevant table name
          filter: `ChatThreadId=eq.${chatId}`,
        },
        (payload: { new: any; old: any }) => {
          console.log("General chat message received:", payload);
          
          // Process general chat messages if needed
          // if (payload.new && payload.new.userMessageType === "admin") {
          if (payload.new) {
            const newMessage: HistoryNode = {
              checkpoint_id: payload.new.id || `msg-${Date.now()}`,
              content: payload.new.content || "",
              role: "lawyer",
              forLawyer: false,
              isStreaming: false,
              isError: false
            };
            
            setLocalHistoryConversation(prev => [...prev, newMessage]);
            setHistoryConversation([...historyConversation, newMessage]);
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log(`Successfully subscribed to chat updates on channel ${channelName}`);
        } else {
          console.error(`Subscription status for ${channelName}:`, status);
        }
      });
  
    // Return cleanup function
    return () => {
      console.log(`Cleaning up subscription for channel ${channelName}`);
      supabase.removeChannel(channel);
      setThisChatId("");
    };
  }, [chatId, supabase, historyConversation, setHistoryConversation, chatbotThreadType, localHistoryConversation]);

  useEffect(() => {
    const currentThreadId = thisChatId;
    const hasThreadChanged = currentThreadId !== previousThreadIdRef.current;

    const isParentHistoryChanged =
      historyConversation.length !== localHistoryConversation.length ||
      (historyConversation.length > 0 &&
        localHistoryConversation.length > 0 &&
        JSON.stringify(historyConversation.map((h) => h.checkpoint_id)) !==
          JSON.stringify(localHistoryConversation.map((h) => h.checkpoint_id)));

    if (hasThreadChanged || isParentHistoryChanged) {
      setLocalHistoryConversation(historyConversation);
      previousThreadIdRef.current = currentThreadId;
    }

    if (
      currentThreadId &&
      historyConversation.length === 0 &&
      localHistoryConversation.length > 0
    ) {
      setLocalHistoryConversation([]);
      previousThreadIdRef.current = currentThreadId;
    }
  }, [historyConversation, localHistoryConversation, thisChatId]);

  useEffect(() => {
    if (!data) return;

    try {
      const dataReceived = JSON.parse(data);
      if (dataReceived.message.user.typeUser === "USER_STAFF") {
        const newAnswer: HistoryNode = {
          checkpoint_id: dataReceived.message.id,
          content: dataReceived.message.content,
          role: "lawyer",
          forLawyer: false,
          isStreaming: false,
          isError: false
        };
        setHistoryConversation([...historyConversation, newAnswer]);
      }
    } catch (err) {
      console.error("Error parsing SSE data:", err);
    }
  }, [data, historyConversation, setHistoryConversation]);

  useEffect(() => {
    if (error) {
      console.error("SSE Error:", error);
    }
  }, [error]);

  return (
    <div
      className={`${
        selectedChatType === ChatSpaceType.historySpace ? "hidden" : "flex"
      } 
        h-full border border-greys-300 md:rounded-lg flex-col w-full relative bg-neutrals-white`}
    >
      <ChatHeader
        title={getHeaderTitle()}
        setChatType={setSelectedChatType}
        chatType={selectedChatType}
        showModal={showMoveModal}
        id={chatbotThread?.id || categoryThread?.id || ""}
        invalidateMainQueries={invalidateMainQueries}
      />
      {selectedChatType === ChatSpaceType.blankSpace && (
        <BlankChat
          handleSend={handleSend}
          markedPrompts={markedPrompts}
          handleLawyerSend={handleLawyerSend}
          chatbotThreadType={chatbotThreadType}
        />
      )}
      {(isFetchingThread ||
        isLoadingData ||
        threadsInCategoryLoading ||
        isCategoryBeingCreated ||
        isUploadingFile ||
        (isSendingQuestion && !isStreaming)) && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-primaryLinkWater-100 opacity-45 z-10">
          <Spin size="large" />
        </div>
      )}

      {selectedChatType === ChatSpaceType.chatSpace && (
        <>
          <div className="h-full flex flex-col flex-grow gap-4 justify-start items-center">
            <ClientConversation
              historyConversation={localHistoryConversation}
              filesConversation={filesConversation}
            />
          </div>
          <QuestionField
            placeholder={
              chatbotThreadType === ChatTypeEnum.ChatLawyer || isLawyerInvolved()
                ? "Type your message to the lawyer..."
                : "How can I help you today?"
            }
            handleSend={handleSend}
            handleLawyerSend={handleLawyerSend}
            isLoading={isLoadingData || isStreaming}
            questionSentence={questionSentence}
            setQuestionSentence={setQuestionSentence}
            chatbotThreadType={chatbotThreadType}
            chatbotThreadId={chatbotThread?.id}
          />
        </>
      )}
      {selectedChatType === ChatSpaceType.categorySpace && (
        <CategoryDetails
          handleSend={handleSend}
          threadsInCategory={threadsInCategory}
          loadPreviousChat={loadPreviousChat}
          categoryThread={categoryThread}
          handleLawyerSend={handleLawyerSend}
          chatbotThreadType={chatbotThreadType}
        />
      )}
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

