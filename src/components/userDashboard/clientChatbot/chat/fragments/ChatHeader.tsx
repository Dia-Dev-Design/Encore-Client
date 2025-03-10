import React, { useState } from "react";
import { Dropdown, Input, MenuProps, Tooltip } from "antd";
import EditIcon from "assets/icons/chat/EditIcon.svg";
import CreateFolderIcon from "assets/icons/chat/CreateFolderIcon.svg";
import EncoreWhite from "assets/icons/chat/EncoreIconWhite.svg";
import MobileOptions from "assets/icons/chat/mobileOptions.svg";
import { changeCategoryName, changeChatName } from "api/clientChatbot.api";
import { ChangeCategoryNameParams } from "interfaces/clientDashboard/changeCategoryName.interface";
import { ChatSpaceType } from "interfaces/clientDashboard/ChatSpaceType.enum";
import { ChangeChatNameParams } from "interfaces/clientDashboard/changeChatName.interface";

interface ChatHeaderProps {
    title: string;
    setChatType: (value: ChatSpaceType) => void;
    chatType: ChatSpaceType;
    id: string;
    showModal: () => void;
    invalidateMainQueries: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> =({title, setChatType, chatType, id, showModal, invalidateMainQueries}) => {
    const [isEditFieldOpen, setIsEditFieldOpen] = useState<boolean>(false);
    const [newName, setNewName] = useState<string>("");
    const [newConfirmedName, setNewConfirmedName] = useState<string>("");

    const { mutate: updateCategory, isPending: isUpdatingCategory } = changeCategoryName(id);
    const { mutate: updateChat, isPending: isUpdatingChat } = changeChatName(id);

    const handleChangeName = (e: any) => {
        setNewName(e.target.value);
    }

    const handleChangeNameConfirmation = () => {
        setIsEditFieldOpen(false);
        setNewConfirmedName(newName);
        if (chatType === ChatSpaceType.categorySpace) {
            handleChangeCategoryName();
        } else if (chatType === ChatSpaceType.chatSpace) {
            handleChangeChatName();
        }
    }

    const handleChangeCategoryName = () => {
        const payload: ChangeCategoryNameParams = {
            name: newName,
        };
        updateCategory(payload, { 
            onSuccess: (data) => {
                setIsEditFieldOpen(false);
                setNewConfirmedName(newName);
                invalidateMainQueries();
            },
            onError: (error, payload) => {
                console.error("Error:", error, payload);
            },
        });
    }

    const handleChangeChatName = () => {
        const payload: ChangeChatNameParams = {
            title: newName,
        };
        updateChat(payload, { 
            onSuccess: (data) => {
                setIsEditFieldOpen(false);
                setNewConfirmedName(newName);
                invalidateMainQueries();
            },
            onError: (error, payload) => {
                console.error("Error:", error, payload);
            },
        });
    }

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <button onClick={()=> setChatType(ChatSpaceType.historySpace)}>
                    See chat history
                </button>
            ),
        },
    ];

    return (
        <div className={`flex w-full justify-between h-14 px-6 py-2.5 items-center bg-primaryMariner-900 md:rounded-t-lg`}> 
            {isEditFieldOpen ? (
                <Input
                    defaultValue={title}
                    onPressEnter={() => {handleChangeNameConfirmation();}}
                    onChange={(e) => {handleChangeName(e);}}
                    style={{ 
                        width: "80%", backgroundColor: 
                        "transparent", color: "#FFFFFF", 
                        fontSize: "18px", fontWeight: "600",
                        padding: "0px", borderWidth: "4px",
                        borderColor: "#1975D1"}}
                />
            ) : (
                <h3 className="text-lg font-medium font-figtree text-neutrals-white w-48 md:w-auto overflow-hidden whitespace-nowrap text-ellipsis">
                    {newConfirmedName === "" ? title : newConfirmedName}
                </h3>
            )}
            
            <div className="relative flex flex-row gap-x-4">
                <Tooltip title="Edit">
                    <button onClick={()=>{setIsEditFieldOpen(!isEditFieldOpen)}} className={chatType === ChatSpaceType.chatSpace ? "flex" : "hidden"}>
                        <img src={EditIcon} alt="Edit" />
                    </button>
                </Tooltip>
                <Tooltip title="Move to a Category">
                    <button onClick={()=>{showModal()}} className={chatType === ChatSpaceType.chatSpace ? "flex" : "hidden"}>
                        <img src={CreateFolderIcon} alt="Move Chat" />
                    </button>
                </Tooltip>
                <Dropdown menu={{ items }}>
                    <button className="flex md:hidden">
                        <img src={MobileOptions} alt="Options" />
                    </button>
                </Dropdown>
                
                <img src={EncoreWhite} alt="Logo" className="hidden md:flex" />
            </div>
        </div>
    );
};

export default ChatHeader;

