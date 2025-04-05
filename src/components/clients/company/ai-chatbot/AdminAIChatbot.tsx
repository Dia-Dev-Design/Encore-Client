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
//   console.log("This is admin id", adminId)
  const { companyId } = useParams<{ companyId: string }>();
  console.log("This is companyID", companyId)
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

  const { data: chatHistoryData, isLoading: chatHistoryLoading } = getAdminChatHistory(CHAT_HISTORY, selectedChatId);

  

  // Example usage
  //   const chatThreadId = 'some-uuid-here'
  //   const messageChannel = subscribeToMessages(chatThreadId)

  // Clean up when done (e.g., component unmount)
  //   function cleanup() {
  //     supabase.removeChannel(messageChannel)
  //   }



  useEffect(() => {
    if (chatHistoryData && chatHistoryData.response.messages.length > 0) {
        console.log("ChatbotHistory=====>", chatHistoryData.response)
      setSelectedChatType(ChatSpaceType.chatSpace);
      setChatbotThreadType(chatHistoryData.response.chatType as ChatTypeEnum);
      setHistoryConversation(chatHistoryData.response.messages);
      setFilesConversation(chatHistoryData.response.files);

    }
  }, [chatHistoryData]);

  const loadPreviousChat = (chat: ChatbotThread) => {
    setSelectedChatId(chat.id);
    setChatbotThread(chat);
  };

  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  const invalidateMainQueries = () => {
    queryClient.invalidateQueries({ queryKey: [LAWYER_CHATS] });
  };

  useEffect(() => {
    console.log("This is the chatbot thread in useEffect", selectedChatId);
    function subscribeToMessages(selectedChatId: string) {
      // Create a channel filtered by ChatThreadId
      const channel = supabase
        .channel(`chat_messages:${selectedChatId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "ChatLawyerMessage",
            filter: `ChatThreadId=eq.${selectedChatId}`,
          },
          (payload) => {
            // Handle the new message
            console.log("New message received:", payload.new);
            // Update your UI with the new message
          }
        )
        .subscribe();

      // Return the channel so you can unsubscribe later if needed
      return channel;
    }

    const messageChannel = subscribeToMessages(selectedChatId);

    function cleanup() {
      supabase.removeChannel(messageChannel);
    }

    return () => {
      cleanup();
      setSelectedChatId("");
    };
  }, []);

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
