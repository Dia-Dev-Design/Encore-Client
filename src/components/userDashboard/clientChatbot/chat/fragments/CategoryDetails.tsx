import React, { useState } from "react";
import { Tooltip } from "antd";
import FolderIcon from "assets/icons/chat/FolderIcon.svg";
import SendIcon from "assets/icons/chat/SendIcon.svg";
import HandIcon from "assets/icons/chat/HandPalm.svg";
import { ChatbotThread } from "interfaces/clientDashboard/chatbotThread.interface";
import ChatInCategory from "./ChatInCategory";
import { CategoryThread } from "interfaces/clientDashboard/categoryThread.interface";
import AttachFileButton from "./AttachFileButton";
import { ChatTypeEnum } from "interfaces/clientDashboard/chatType.enum";

interface BlankCategoryProps {
    handleSend: (question: string, file?: File) => void;
    handleLawyerSend: (question: string) => void;
    threadsInCategory: ChatbotThread[];
    loadPreviousChat: (chat: ChatbotThread, title: string) => void;
    categoryThread: CategoryThread | undefined;
    chatbotThreadType: ChatTypeEnum | undefined;
}

const CategoryDetails: React.FC<BlankCategoryProps> =({
    handleSend, handleLawyerSend, threadsInCategory, 
    loadPreviousChat, categoryThread, chatbotThreadType
}) => {
    const [questionSentence, setQuestionSentence] = useState<string>("");
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isAskLawyer, setIsAskLawyer] = useState<boolean>(false);

    const handleKeyDown = (e: any) => {
        if ((e.code === "Enter" || e.code === "NumpadEnter") && questionSentence !== "") {
            e.preventDefault();
            handleSendButton();
        }
    }

    const handleSendButton = () => {
        if (isAskLawyer) {
            setIsAskLawyer(false);
            handleLawyerSend(questionSentence);
        } else {
            handleSend(questionSentence, uploadedFile ? uploadedFile as File : undefined);
        }
        setQuestionSentence("");
        setUploadedFile(null);
    }

    const handleAskForLawyer = () => {
        setIsAskLawyer(!isAskLawyer);
    }

    return (
        <div className="flex flex-col flex-grow gap-8 px-6 py-9 justify-center items-center overflow-y-auto">
            <div className="flex flex-row gap-x-2 w-full justify-center">
                <img src={FolderIcon} alt="Logo" />
                <p className="text-2xl font-medium font-figtree text-primaryMariner-950">{categoryThread?.name ? categoryThread?.name : "New Category"}</p>
            </div>
            <div className="w-3/4 h-20 px-4 flex flex-row justify-between gap-x-2 items-center bg-greys-50 border rounded-lg border-greys-300">
                <Tooltip title="Ask a Lawyer" open={isAskLawyer}>
                    <button 
                        className="w-6"
                        onClick={handleAskForLawyer}
                        disabled={chatbotThreadType && chatbotThreadType === ChatTypeEnum.ChatLawyer}
                    >
                        <img src={HandIcon} alt="" />
                    </button>
                </Tooltip>
                <AttachFileButton uploadedFile={uploadedFile} setUploadedFile={setUploadedFile} />
                <input
                    type="text"
                    placeholder="New chat in this project"
                    className="w-full px-2 py-1 bg-transparent border-none focus:outline-none"
                    value={questionSentence} 
                    onChange={e => setQuestionSentence(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e)}
                />
                <button onClick={() => handleSendButton()}>
                    <img src={SendIcon} alt="Send" />
                </button>
            </div>
            {threadsInCategory && threadsInCategory.length > 0 && 
                <p className="font-figtree text-lg font-medium text-neutrals-black w-3/4">Chats in this project</p>
            }
            {threadsInCategory && threadsInCategory.length > 0 ? threadsInCategory.map((chat: any) => (
                    <ChatInCategory 
                        key={chat}
                        chatId={chat}
                        loadPreviousChat={loadPreviousChat}
                    />
                )) : (
                    <div className="w-3/4 flex flex-col">
                        <p className="font-figtree font-bold text-neutrals-black text-xl">No chats in this project yet</p>
                        <p className="font-figtree font-medium text-neutrals-black text-lg">
                            Start typing in the “New chat in this project” input field to create a new chat. 
                            An automatic name will be created according to the topic. 
                            However you can change its name by clicking the pencil icon at the right side of the bar.
                        </p>
                    </div>
                )}
        </div>
    );
};

export default CategoryDetails;

