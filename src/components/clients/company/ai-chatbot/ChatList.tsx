import React, { useEffect, useMemo, useState } from "react";
import { Tooltip } from "antd";

import HistoryDivider from "components/userDashboard/clientChatbot/history/HistoryDivider";
import HistoryChat from "components/userDashboard/clientChatbot/history/HistoryChat";
import CollapseIcon from "assets/icons/LightIncompleteHamburger.svg";
import ExpandIcon from "assets/icons/LightHamburger.svg";
import SearchIcon from "assets/icons/chat/SearchIcon.svg";
import { ChatbotThread } from "interfaces/clientDashboard/chatbotThread.interface";

interface ChatListProps {
    isHistoryCollapsed: boolean;
    setIsHistoryCollpased: (value:boolean) => void;
    historyThreads: ChatbotThread[];
    loadPreviousChat: (chat: ChatbotThread, title: string) => void;
    setIsSearchModalOpen: (value: boolean) => void;
}

const ChatList: React.FC<ChatListProps> =({
    isHistoryCollapsed, setIsHistoryCollpased, historyThreads, 
    loadPreviousChat, setIsSearchModalOpen
}) => {

    const groupedThreads = useMemo(() => {
        const now = new Date();
        const groups = {
            last7Days: [] as ChatbotThread[],
            lastTwoWeeks: [] as ChatbotThread[],
            lastMonth: [] as ChatbotThread[],
            older: [] as ChatbotThread[],
        };

        historyThreads.forEach((thread) => {
            const updatedAt = new Date(thread.updatedAt);
            const diffTime = now.getTime() - updatedAt.getTime();
            const diffDays = diffTime / (1000 * 60 * 60 * 24);

            if (diffDays <= 7) {
                groups.last7Days.push(thread);
            } else if (diffDays <= 14) {
                groups.lastTwoWeeks.push(thread);
            } else if (diffDays <= 30) {
                groups.lastMonth.push(thread);
            } else {
                groups.older.push(thread);
            }
        });

        return groups;
    }, [historyThreads]);

    return (
        isHistoryCollapsed ? (
            <div className="flex flex-col h-fit px-[6px] ml-[-40px] py-4 gap-4 items-center bg-primaryMariner-900 rounded-r-lg relative transition-all ease-in-out duration-300"> 
                <Tooltip title="Search">
                    <button onClick={()=> setIsSearchModalOpen(true)}>
                        <img src={SearchIcon} alt="Search" />
                    </button>
                </Tooltip>
                <Tooltip title="Expand History">
                    <button onClick={()=> setIsHistoryCollpased(!isHistoryCollapsed)} >
                        <img src={ExpandIcon} alt="Collapase Button" className="h-4" />
                    </button>
                </Tooltip>
            </div>
        ) : (
            <div className="h-full w-[372px] border border-greys-300 rounded-lg flex flex-col">
                <div className="flex justify-between min-h-14 px-6 py-2.5 items-center bg-primaryMariner-900 rounded-t-lg relative transition-all ease-in-out duration-300"> 
                    <h3 className="text-lg font-medium font-figtree text-neutrals-white">Chat List</h3>
                    <div className="relative flex flex-row gap-x-4">
                        <Tooltip title="Search">
                            <button onClick={()=> setIsSearchModalOpen(true)}>
                                <img src={SearchIcon} alt="Search" />
                            </button>
                        </Tooltip>
                        <Tooltip title="Minimize History">
                            <button onClick={()=> setIsHistoryCollpased(!isHistoryCollapsed)} >
                                <img src={CollapseIcon} alt="Collapase Button" className="h-6" />
                            </button>
                        </Tooltip>
                        
                    </div>

                </div>
                <div className="flex flex-col flex-grow p-4 bg-primaryMariner-950 overflow-y-auto rounded-b-lg gap-1" >
                    {groupedThreads.last7Days.length > 0 && <HistoryDivider title="Individual chat - Last 7 days" />}
                    
                    {groupedThreads.last7Days.length > 0 && historyThreads.map((thread: ChatbotThread) => (
                        <HistoryChat
                            key={thread.id}
                            chat={thread}
                            isInsideCategory={false}
                            loadPreviousChat={loadPreviousChat}
                        />
                    ))}

                    {groupedThreads.lastTwoWeeks.length > 0 && <HistoryDivider title="Individual chat - Last two weeks" />}
                    
                    {groupedThreads.lastTwoWeeks.length > 0 && historyThreads.map((thread: ChatbotThread) => (
                        <HistoryChat
                            key={thread.id}
                            chat={thread}
                            isInsideCategory={false}
                            loadPreviousChat={loadPreviousChat}
                        />
                    ))}

                    {groupedThreads.lastMonth.length > 0 && <HistoryDivider title="Individual chat - Last month" />}
                    
                    {groupedThreads.lastMonth.length > 0 && historyThreads.map((thread: ChatbotThread) => (
                        <HistoryChat
                            key={thread.id}
                            chat={thread}
                            isInsideCategory={false}
                            loadPreviousChat={loadPreviousChat}
                        />
                    ))}

                    {groupedThreads.older.length > 0 && <HistoryDivider title="Individual chat - Older" />}
                    
                    {groupedThreads.older.length > 0 && historyThreads.map((thread: ChatbotThread) => (
                        <HistoryChat
                            key={thread.id}
                            chat={thread}
                            isInsideCategory={false}
                            loadPreviousChat={loadPreviousChat}
                        />
                    ))}
                    {historyThreads.length === 0 && <p className="font-figtree text-neutrals-white">No chats found</p>}
                </div>
            </div>
        )
    );
};

export default ChatList;

