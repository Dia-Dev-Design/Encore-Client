import React, { useState } from "react";
import SendIcon from "assets/icons/chat/SendIcon.svg";
import SendDisableIcon from "assets/icons/chat/SendDisabledIcon.svg";
import { ChatTypeEnum } from "interfaces/clientDashboard/chatType.enum";

interface AdminQuestionFieldProps {
    placeholder: string;
    handleSend: (question: string, file?: File) => void;
    isLoading: boolean;
    questionSentence: string;
    setQuestionSentence: (sentence: string) => void;
    chatbotThreadType: ChatTypeEnum | undefined;
}

const AdminQuestionField: React.FC<AdminQuestionFieldProps> =({
    placeholder, handleSend, isLoading,
    questionSentence, setQuestionSentence, chatbotThreadType
}) => {

    const handleKeyDown = (e: any) => {
        if (e.code === "Enter" || e.code === "NumpadEnter"){
            e.preventDefault();
            handleSendButton();
        }
    }

    const handleSendButton = () => {
        handleSend(questionSentence);
        setQuestionSentence("");
    }

    return (
        <div className="w-full h-28 flex flex-col gap-2 absolute bottom-0 left-1/2 transform -translate-x-1/2
                    bg-neutrals-white px-14 pt-6 border-t-2 border-greys-100 rounded-b-lg ">
            <div className="w-full h-16 px-4 flex flex-row justify-between gap-x-2 items-center
                        bg-greys-50 border rounded-lg border-greys-300"
            >
                <input
                    type="text"
                    placeholder={placeholder}
                    className="w-full px-2 py-1 bg-transparent border-none focus:outline-none"
                    value={questionSentence} 
                    onChange={e => setQuestionSentence(e.target.value)}
                    disabled={isLoading || chatbotThreadType !== ChatTypeEnum.ChatLawyer}
                    onKeyDown={(e) => handleKeyDown(e)}
                />
                <button 
                    onClick={() => handleSendButton()} 
                    disabled={isLoading || questionSentence === ""}
                >
                    <img src={questionSentence === "" ? SendDisableIcon : SendIcon} alt="Send" />
                </button>
            </div>
        </div>

    );
};

export default AdminQuestionField;

