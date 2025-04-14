import { useEffect, useState } from "react";
import ChatList from "./ChatList";
import {
  DocumentNode,
  HistoryNode,
} from "interfaces/clientDashboard/historyNode.interface";
import { ChatSpaceType } from "interfaces/clientDashboard/ChatSpaceType.enum";
import { ChatbotThread } from "interfaces/clientDashboard/chatbotThread.interface";
import {
  CHAT_HISTORY,
  LAWYER_CHATS,
} from "consts/clientPanel/clientQuery.const";
import ChatWindow from "./ChatWindow";
import { useQueryClient } from "@tanstack/react-query";
import ModalSearchChatsAdmin from "./ModalSearchChatsAdmin";
import { useParams } from "react-router-dom";
import { ChatTypeEnum } from "interfaces/clientDashboard/chatType.enum";
import { getAdminChatHistory, getLawyerChats } from "api/clientChatbot.api";
import { useAuth } from "context/auth.context";
import { useSupabase } from "context/supabase.contest";

const AdminAIChatbot = () => {
  const queryClient = useQueryClient();
  const supabase = useSupabase();
  const { user } = useAuth();
  const adminId = user?.user.id;
  const { companyId } = useParams<{ companyId: string }>();
  console.log("This is companyID", companyId);
  
  const { data: chatbotThreadList, isLoading: chatbotThreadListLoading } =
    getLawyerChats(LAWYER_CHATS, companyId || "", adminId || "");

  const [isHistoryCollapsed, setIsHistoryCollpased] = useState(false);
  const [historyConversation, setHistoryConversation] = useState<HistoryNode[]>(
    []
  );
  const [filesConversation, setFilesConversation] = useState<DocumentNode[]>(
    []
  );

  const [selectedChatType, setSelectedChatType] = useState<ChatSpaceType>(
    ChatSpaceType.blankSpace
  );
  const [selectedChatId, setSelectedChatId] = useState<string>("");
  const [chatbotThread, setChatbotThread] = useState<ChatbotThread>();
  const [chatbotThreadType, setChatbotThreadType] = useState<ChatTypeEnum>();

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const { data: chatHistoryData, isLoading: chatHistoryLoading } = 
    getAdminChatHistory(CHAT_HISTORY, selectedChatId);

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

  const loadPreviousChat = (chat: ChatbotThread) => {
    console.log("Loading chat with ID:", chat.id);
    setSelectedChatId(chat.id);
    setChatbotThread(chat);
  };

  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  const invalidateMainQueries = () => {
    queryClient.invalidateQueries({ queryKey: [LAWYER_CHATS] });
    if (selectedChatId) {
      queryClient.invalidateQueries({ queryKey: [CHAT_HISTORY, selectedChatId] });
    }
  };

  // Setup Supabase realtime subscription when selectedChatId changes
  useEffect(() => {
    console.log("This is the admin chatID", selectedChatId);
    // Don't subscribe if no chat is selected
    if (!selectedChatId) {
      console.log("No chat selected, skipping subscription");
      return;
    }
  
    console.log("Setting up subscription for chat ID:", selectedChatId);
  
    // Create a unique channel name including the chat ID
    const channelName = `lawyer_chat_${selectedChatId}_${Date.now()}`;
  
    // Create a channel to listen for all message types
    const channel = supabase
      .channel(channelName)
      // Listen for all messages in the ChatLawyerMessage table
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ChatLawyerMessage", 
          filter: `ChatThreadId=eq.${selectedChatId}`,
        },
        (payload: { new: any; old: any; eventType: string }) => {
          console.log("ChatLawyerMessage event received:", payload);
          
          if (!payload.new) return;
          
          // Log all the fields to debug
          console.log("Received message data:", {
            id: payload.new.id,
            content: payload.new.content,
            message: payload.new.message,
            userMessageType: payload.new.userMessageType,
            all: payload.new
          });
          
          // Determine role based on message type - be more flexible with the check
          const isUserMessage = 
            payload.new.userMessageType === "USER_COMPANY" || 
            payload.new.role === "user" ||
            payload.new.user_type === "user";
          
          const role = isUserMessage ? "user" : "lawyer";
          
          // Always show messages from users to lawyers
          const newMessage: HistoryNode = {
            checkpoint_id: payload.new.id?.toString() || `msg-${Date.now()}`,
            content: payload.new.content || payload.new.message || "",
            role: role,
            forLawyer: isUserMessage, // User messages are for lawyer
            isStreaming: false,
            isError: false
          };
          
          console.log("Processing message:", newMessage);
          
          // Add the message to the conversation
          setHistoryConversation(prev => {
            // Check if message already exists to prevent duplicates
            const messageExists = prev.some(msg => 
              msg.checkpoint_id === newMessage.checkpoint_id || 
              (msg.content === newMessage.content && 
               Math.abs(parseInt(msg.checkpoint_id.split('-')[1] || '0') - Date.now()) < 5000)
            );
            
            if (messageExists) {
              console.log("Message already exists, skipping");
              return prev;
            }
            
            console.log("Adding new message to conversation");
            return [...prev, newMessage];
          });
        }
      )
      // Also listen to the ChatMessage table
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ChatMessage",
          filter: `thread_id=eq.${selectedChatId}`,
        },
        (payload: { new: any; old: any; eventType: string }) => {
          console.log("ChatMessage event received:", payload);
          
          if (!payload.new) return;
          
          // Log more data for debugging
          console.log("ChatMessage data:", payload.new);
          
          // Try to determine the role from various possible field names
          const isUserMessage = 
            payload.new.userMessageType === "USER_COMPANY" || 
            payload.new.role === "user" ||
            payload.new.user_type === "user";
          
          const role = isUserMessage ? "user" : "lawyer";
          
          const newMessage: HistoryNode = {
            checkpoint_id: payload.new.id?.toString() || `chat-msg-${Date.now()}`,
            content: payload.new.content || payload.new.message || "",
            role: role,
            forLawyer: isUserMessage, // User messages are for lawyer
            isStreaming: false,
            isError: false
          };
          
          console.log("Processing ChatMessage:", newMessage);
          
          setHistoryConversation(prev => {
            if (prev.some(msg => msg.checkpoint_id === newMessage.checkpoint_id)) {
              console.log("ChatMessage already exists, skipping");
              return prev;
            }
            console.log("Adding new ChatMessage to conversation");
            return [...prev, newMessage];
          });
        }
      )
      .subscribe((status: string) => {
        console.log(`Subscription status for ${channelName}:`, status);
  
        if (status === "SUBSCRIBED") {
          console.log(`Successfully subscribed to chat updates for ${selectedChatId}`);
        }
  
        if (status === "CHANNEL_ERROR") {
          console.error(`Failed to subscribe to chat updates for ${selectedChatId}`);
        }
      });
  
    // Return cleanup function
    return () => {
      console.log(`Cleaning up subscription for chat ${selectedChatId}`);
      supabase.removeChannel(channel);
    };
  }, [selectedChatId, supabase, historyConversation, setHistoryConversation]);
// useEffect(() => {
//   console.log("This is the admin chatID", selectedChatId);
//   // Don't subscribe if no chat is selected
//   if (!selectedChatId) {
//     console.log("No chat selected, skipping subscription");
//     return;
//   }

//   console.log("Setting up subscription for chat ID:", selectedChatId);

//   // Create a unique channel name including the chat ID
//   const channelName = `lawyer_chat_${selectedChatId}_${Date.now()}`;

//   // Create a channel to listen for all message types
//   const channel = supabase
//     .channel(channelName)
//     // Listen for client messages
//     .on(
//       "postgres_changes",
//       {
//         event: "*",
//         schema: "public",
//         table: "ChatLawyerMessage", 
//         filter: `ChatThreadId=eq.${selectedChatId}`,
//       },
//       (payload) => {
//         console.log("Message event received:", payload);
        
//         if (payload.new) {
//           // Determine role based on message type
//           const role = payload.new.userMessageType === "USER_COMPANY" ? "user" : "lawyer";
          
//           // Skip if this is our own message that we've already added to the UI
//           if (role === "lawyer" && 
//               historyConversation.some(msg => 
//                 msg.content === payload.new.content && 
//                 msg.role === "lawyer" && 
//                 Date.now() - parseInt(msg.checkpoint_id.split('-')[1]) < 5000)) {
//             console.log("Skipping our own recently sent message");
//             return;
//           }
          
//           const newMessage: HistoryNode = {
//             checkpoint_id: payload.new.id || `msg-${Date.now()}`,
//             content: payload.new.content || payload.new.message || "",
//             role: role,
//             forLawyer: role === "user", // Messages from users are for lawyer
//             isStreaming: false,
//             isError: false
//           };
          
//           // Add the message to the conversation
//           setHistoryConversation(prev => {
//             // Check if message already exists to prevent duplicates
//             if (prev.some(msg => msg.checkpoint_id === newMessage.checkpoint_id)) {
//               return prev;
//             }
//             return [...prev, newMessage];
//           });
//         }
//       }
//     )
//     // Also listen to the other message table if needed
//     .on(
//       "postgres_changes",
//       {
//         event: "*",
//         schema: "public",
//         table: "ChatMessage", // The other table that might store messages
//         filter: `thread_id=eq.${selectedChatId}`,
//       },
//       (payload) => {
//         console.log("ChatMessage event received:", payload);
        
//         if (payload.new) {
//           // Similar processing as above
//           const role = payload.new.userMessageType === "USER_COMPANY" ? "user" : "lawyer";
          
//           const newMessage: HistoryNode = {
//             checkpoint_id: payload.new.id || `msg-${Date.now()}`,
//             content: payload.new.content || payload.new.message || "",
//             role: role,
//             forLawyer: role === "user",
//             isStreaming: false,
//             isError: false
//           };
          
//           setHistoryConversation(prev => {
//             if (prev.some(msg => msg.checkpoint_id === newMessage.checkpoint_id)) {
//               return prev;
//             }
//             return [...prev, newMessage];
//           });
//         }
//       }
//     )
//     .subscribe((status) => {
//       console.log(`Subscription status for ${channelName}:`, status);

//       if (status === "SUBSCRIBED") {
//         console.log(`Successfully subscribed to chat updates for ${selectedChatId}`);
//       }

//       if (status === "CHANNEL_ERROR") {
//         console.error(`Failed to subscribe to chat updates for ${selectedChatId}`);
//       }
//     });

//   // Return cleanup function
//   return () => {
//     console.log(`Cleaning up subscription for chat ${selectedChatId}`);
//     supabase.removeChannel(channel);
//   };
// }, [selectedChatId, supabase, historyConversation, setHistoryConversation])

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
          selectedChatId={selectedChatId} // Pass selectedChatId to ChatWindow
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
