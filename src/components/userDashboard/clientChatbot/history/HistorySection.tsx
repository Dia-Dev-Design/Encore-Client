import React, { useEffect, useMemo, useState } from "react";
import { Dropdown, MenuProps, Tooltip } from "antd";

import HistoryDivider from "./HistoryDivider";
import HistoryChat from "./HistoryChat";
import CollapseIcon from "assets/icons/LightIncompleteHamburger.svg";
import ExpandIcon from "assets/icons/LightHamburger.svg";
import SearchIcon from "assets/icons/chat/SearchIcon.svg";
import CreateIcon from "assets/icons/chat/CreateIcon.svg";
import AddIcon from "assets/icons/chat/AddIcon.svg";
import MobileOptions from "assets/icons/chat/mobileOptions.svg";
import HistoryCategory from "./HistoryCategory";
import { ChatbotThread } from "interfaces/clientDashboard/chatbotThread.interface";
import { CategoryThread } from "interfaces/clientDashboard/categoryThread.interface";
import { ChatSpaceType } from "interfaces/clientDashboard/ChatSpaceType.enum";

interface HistorySectionProps {
    isHistoryCollapsed: boolean;
    setIsHistoryCollpased: (value:boolean) => void;
    handleNewChat: () => void;
    historyThreads: ChatbotThread[];
    categoryThreads: CategoryThread[];
    loadPreviousChat: (chat: ChatbotThread, title: string) => void;
    createNewCategory: () => void;
    setSelectedCategoryId: (id: string) => void;
    selectedChatType: ChatSpaceType;
    setSelectedChatType: (type: ChatSpaceType) => void;
    threadsInCategoryData: ChatbotThread[];
    loadCategory: (catgory: CategoryThread) => void;
    setIsSearchModalOpen: (value: boolean) => void;
    chatbotThread: ChatbotThread | undefined;
}

const HistorySection: React.FC<HistorySectionProps> =({
    isHistoryCollapsed, setIsHistoryCollpased, handleNewChat, historyThreads, 
    categoryThreads, loadPreviousChat, createNewCategory, setSelectedCategoryId, 
    selectedChatType, setSelectedChatType, threadsInCategoryData, loadCategory, 
    setIsSearchModalOpen, chatbotThread
}) => {
    const [activeCategoryOpen, setActiveCategoryOpen] = useState<string>("");

    const handleCategoryOpenChange = (categoryId: string) => {
        if (activeCategoryOpen !== categoryId) {
            setActiveCategoryOpen(categoryId); 
        } else {
            setActiveCategoryOpen(""); 
        }
    };

    const handleCategorySelection = (category: CategoryThread) => {
        setSelectedChatType(ChatSpaceType.categorySpace);
        setSelectedCategoryId(category.id);
        loadCategory(category);
    }

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

    const seeChatOption = () => {
        if (chatbotThread && chatbotThread.id){
            setSelectedChatType(ChatSpaceType.chatSpace)
        } else {
            handleNewChat();
        }
    }

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <button onClick={seeChatOption}>
                    See chat
                </button>
            ),
        },
    ];

    return (
        isHistoryCollapsed ? (
            <div className="flex flex-col h-fit px-[6px] ml-[-40px] py-4 gap-4 items-center bg-primaryMariner-900 rounded-r-lg relative transition-all ease-in-out duration-300"> 
                <Tooltip title="Search">
                    <button onClick={()=> setIsSearchModalOpen(true)}>
                        <img src={SearchIcon} alt="Search" />
                    </button>
                </Tooltip>
                <Tooltip title="New Chat">
                    <button onClick={()=>handleNewChat()}>
                        <img src={CreateIcon} alt="Create" />
                    </button>
                </Tooltip>
                <Tooltip title="Expand History">
                    <button onClick={()=> setIsHistoryCollpased(!isHistoryCollapsed)} >
                        <img src={ExpandIcon} alt="Collapase Button" className="h-4" />
                    </button>
                </Tooltip>
            </div>
        ) : (
            <div className={`${selectedChatType === ChatSpaceType.historySpace ? "flex" : "hidden"} md:flex flex-col h-full w-full md:w-[372px] border border-greys-300 md:rounded-lg`}>
                <div className="flex justify-between min-h-14 px-6 py-2.5 items-center bg-primaryMariner-900 md:rounded-t-lg relative transition-all ease-in-out duration-300"> 
                    <h3 className="text-lg font-medium font-figtree text-neutrals-white">History</h3>
                    <div className="relative flex flex-row gap-x-4">
                        <Tooltip title="Search">
                            <button onClick={()=> setIsSearchModalOpen(true)}>
                                <img src={SearchIcon} alt="Search" />
                            </button>
                        </Tooltip>
                        <Tooltip title="New Chat">
                            <button onClick={()=>handleNewChat()}>
                                <img src={CreateIcon} alt="Create" />
                            </button>
                        </Tooltip>
                        <Tooltip title="Minimize History">
                            <button onClick={()=> setIsHistoryCollpased(!isHistoryCollapsed)} className="hidden md:flex">
                                <img src={CollapseIcon} alt="Collapase Button" className="h-6" />
                            </button>
                        </Tooltip>
                        <Dropdown menu={{ items }}>
                            <button className="flex md:hidden">
                                <img src={MobileOptions} alt="Options" />
                            </button>
                        </Dropdown>
                    </div>

                </div>
                <div className="h-[78vh] flex flex-col flex-grow p-4 bg-primaryMariner-950 overflow-y-auto md:rounded-b-lg overflow-x-hidden gap-1" >
                    <div className="w-full min-h-10 p-2 flex flex-row justify-between items-center ">
                        <p className="text-sm font-medium font-figtree text-greys-300">Categories</p>
                        <Tooltip title="New Category">
                            <button onClick={() => createNewCategory()}>
                                <img src={AddIcon} alt="Add" />
                            </button>
                        </Tooltip>
                    </div>

                    {categoryThreads && categoryThreads.map((thread: CategoryThread) => (
                        <HistoryCategory
                            key={thread.id}
                            threadInfo={thread}
                            loadPreviousChat={loadPreviousChat}
                            loadCategory={handleCategorySelection}
                            setSelectedChatType={setSelectedChatType}
                            threadsInCategoryData={threadsInCategoryData}
                            handleNewChat={handleNewChat}
                            onCategoryOpenChange={handleCategoryOpenChange}
                            activeCategoryOpen={activeCategoryOpen}
                        />
                    ))}
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

export default HistorySection;

