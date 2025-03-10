import React, { useState } from "react";
import { Tooltip } from "antd";
import EncoreBlack from "assets/icons/chat/EncoreIconBlack.svg";
import SendIcon from "assets/icons/chat/SendIcon.svg";
import SuggestedChats from "components/userDashboard/clientChatbot/chat/fragments/SuggestedChats";
import { HistoryNode } from "interfaces/clientDashboard/historyNode.interface";
import SendDisableIcon from "assets/icons/chat/SendDisabledIcon.svg";
import HandIcon from "assets/icons/chat/HandPalm.svg";
import AttachFileButton from "./AttachFileButton";
import { ChatTypeEnum } from "interfaces/clientDashboard/chatType.enum";

interface BlankChatProps {
    handleSend: (question: string, file?: File) => void;
    handleLawyerSend: (question: string) => void;
    markedPrompts: HistoryNode[];
    chatbotThreadType: ChatTypeEnum | undefined;
}

const BlankChat: React.FC<BlankChatProps> =({
    handleSend, handleLawyerSend, markedPrompts,
    chatbotThreadType
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
        <div className="flex flex-col flex-grow gap-4 px-2 md:px-14 py-9 justify-center items-center overflow-y-auto relative md:static h-[77vh]">
            <div className="flex flex-row gap-x-2 w-full justify-center mt-32 md:mt-24 md:pb-[2%]">
                <img src={EncoreBlack} alt="Logo" className="h-6"/>
                <p className="text-2xl font-medium font-figtree text-primaryMariner-950 h-full select-none">How can I help you today?</p>
            </div>
            <div className="w-full flex flex-col gap-2 pb-2 md:pb-[5%] absolute bottom-0 md:static px-2 md:px-0">
                <div className="w-full h-16 px-4 py-6 flex flex-row justify-between gap-x-2 items-center bg-greys-50 border rounded-lg border-greys-300">
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
                        placeholder="Send a message to Encore AI"
                        className="w-full px-2 py-1 bg-transparent border-none focus:outline-none"
                        value={questionSentence} 
                        onChange={e => setQuestionSentence(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e)}
                    />
                    <button 
                        onClick={() => handleSendButton()}
                        disabled={questionSentence === ""}
                    >
                        <img src={questionSentence === "" ? SendDisableIcon : SendIcon} alt="Send" />
                    </button>
                </div>
            </div>

            <SuggestedChats 
                showChats={true}
                handleSend={handleSend}
                markedPrompts={markedPrompts}
            />
        </div>
    );
};

export default BlankChat;

