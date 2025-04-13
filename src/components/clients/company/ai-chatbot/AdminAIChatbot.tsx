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
    console.log("This is the admin chatID", selectedChatId)
    // Don't subscribe if no chat is selected
    if (!selectedChatId) {
      console.log("No chat selected, skipping subscription");
      return;
    }

    console.log("Setting up subscription for chat ID:", selectedChatId);

    // Create a unique channel name including the chat ID
    const channelName = `lawyer_chat_${selectedChatId}_${Date.now()}`;

    // Create a channel filtered by ChatThreadId
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ChatLawyerMessage", // Add the table that stores client messages
          filter: `ChatThreadId=eq.${selectedChatId}`,
        },
        (payload: { new: any; old: any }) => {
          console.log("Client message received:", payload);
          
          if (payload.new && payload.new.userMessageType === "USER_COMPANY") {
            const clientMessage: HistoryNode = {
              checkpoint_id: payload.new.id || `client-${Date.now()}`,
              content: payload.new.content || payload.new.message || "",
              role: "user",
              forLawyer: true,
              isStreaming: false,
              isError: false
            };
            
            setHistoryConversation(prev => [...prev, clientMessage]);
          }
        }
      )
      .subscribe((status) => {
        console.log(`Subscription status for ${channelName}:`, status);

        if (status === "SUBSCRIBED") {
          console.log(`Successfully subscribed to chat updates for ${selectedChatId}`);
        }

        if (status === "CHANNEL_ERROR") {
          console.error(`Failed to subscribe to chat updates for ${selectedChatId}`);
        }
      });
      // .on(
      //   "postgres_changes",
      //   {
      //     event: "*", // Listen for all events
      //     schema: "public",
      //     table: "ChatLawyerMessage",
      //     // filter: `ChatThreadId=eq.${selectedChatId}`,
      //   },
      //   (payload: { new: any; old: any; eventType: string }) => {
      //     console.log(`WOIEOWOWOWOWOW!!!! Received ${payload.eventType} event:`, payload);
          
      //     // Only process INSERT events with valid new data
      //     if (payload.eventType === "INSERT" && payload.new) {
      //       console.log("New message received:", payload.new);
            
      //       // Transform the message into the proper HistoryNode format
      //       const newMessage: HistoryNode = {
      //         checkpoint_id: payload.new.id || `msg-${Date.now()}`,
      //         content: payload.new.content || payload.new.message || "",
      //         role: payload.new.role || payload.new.user_type || "user",
      //         forLawyer: false,
      //         isStreaming: false,
      //         isError: false
      //       };
            
      //       // Add message to conversation history
      //       setHistoryConversation(prev => [...prev, newMessage]);
            
      //       // Optionally refresh the chat history query
      //       queryClient.invalidateQueries({ queryKey: [CHAT_HISTORY, selectedChatId] });
      //     }
      //   }
      // )
      // // Also listen for any client messages
      // .on(
      //   "postgres_changes",
      //   {
      //     event: "INSERT",
      //     schema: "public",
      //     table: "ChatMessage", // Add the table that stores client messages
      //     // filter: `thread_id=eq.${selectedChatId}`,
      //   },
      //   (payload: { new: any; old: any }) => {
      //     console.log("Client message received:", payload);
          
      //     if (payload.new) {
      //       const clientMessage: HistoryNode = {
      //         checkpoint_id: payload.new.id || `client-${Date.now()}`,
      //         content: payload.new.content || payload.new.message || "",
      //         role: payload.new.role || "user",
      //         forLawyer: true,
      //         isStreaming: false,
      //         isError: false
      //       };
            
      //       setHistoryConversation(prev => [...prev, clientMessage]);
      //     }
      //   }
      // )
      // .subscribe((status) => {
      //   console.log(`Subscription status for ${channelName}:`, status);

      //   if (status === "SUBSCRIBED") {
      //     console.log(`Successfully subscribed to chat updates for ${selectedChatId}`);
      //   }

      //   if (status === "CHANNEL_ERROR") {
      //     console.error(`Failed to subscribe to chat updates for ${selectedChatId}`);
      //   }
      // });

    // Return cleanup function
    return () => {
      console.log(`Cleaning up subscription for chat ${selectedChatId}`);
      supabase.removeChannel(channel);
    };
  }, [selectedChatId, supabase, queryClient]);

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
