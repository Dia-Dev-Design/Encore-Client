import React, { useEffect, useState, useRef } from "react";
import { Tooltip } from "antd";
import SendIcon from "assets/icons/chat/SendIcon.svg";
import SendDisableIcon from "assets/icons/chat/SendDisabledIcon.svg";
import HandIcon from "assets/icons/chat/HandPalm.svg";
import AttachFileButton from "./AttachFileButton";
import { ChatTypeEnum } from "interfaces/clientDashboard/chatType.enum";

interface QuestionFieldProps {
    placeholder: string;
    handleSend: (question: string, file?: File) => void;
    handleLawyerSend: (question: string) => void;
    isLoading: boolean;
    questionSentence: string;
    setQuestionSentence: (sentence: string) => void;
    chatbotThreadType: ChatTypeEnum | undefined;
    chatbotThreadId: string | undefined;
}

const QuestionField: React.FC<QuestionFieldProps> =({
    placeholder, handleSend, handleLawyerSend, isLoading,
    questionSentence, setQuestionSentence, chatbotThreadType, chatbotThreadId
}) => {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isAskLawyer, setIsAskLawyer] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input when loading state changes from true to false
    useEffect(() => {
        if (!isLoading && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isLoading, chatbotThreadId, chatbotThreadType]);

    const handleKeyDown = (e: any) => {
        if ((e.code === "Enter" || e.code === "NumpadEnter") && questionSentence !== "") {
            e.preventDefault();
            handleSendButton();
        }
    }

    const handleSendButton = () => {
        const isInputFocused = document.activeElement === inputRef.current;

        if (isAskLawyer) {
            setIsAskLawyer(false);
            handleLawyerSend(questionSentence);
            console.log("questionSentence", questionSentence);
        } else {
            handleSend(questionSentence, uploadedFile ? uploadedFile as File : undefined);
        }
        setQuestionSentence("");
        setUploadedFile(null);

        // Only try to focus if input was focused before
        if (isInputFocused) {
            // Use a longer timeout to ensure all state updates are processed
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }, 100);
        }
    }

    const handleAskForLawyer = () => {
        setIsAskLawyer(!isAskLawyer);
    }

    return (
        <div className="w-full h-16 md:h-28 flex flex-col gap-2 sticky md:absolute bottom-12 md:bottom-0 left-1/2 transform md:-translate-x-1/2
                    bg-neutrals-white px-2 md:px-14 pt-3 md:pt-6 pb-2 border-t-2 border-greys-100 rounded-b-lg ">
            <div className="w-full h-16 px-4 flex flex-row justify-between gap-x-2 items-center
                        bg-greys-50 border rounded-lg border-greys-300"
            >
                <Tooltip title="Ask a Lawyer" open={isAskLawyer}>
                    <button 
                        className="w-6"
                        onClick={handleAskForLawyer}
                        disabled={chatbotThreadType && chatbotThreadType === ChatTypeEnum.ChatLawyer}
                    >
                        <img src={HandIcon} alt="hand-icon" />
                    </button>
                </Tooltip>
                <AttachFileButton uploadedFile={uploadedFile} setUploadedFile={setUploadedFile} />
                <input
                    ref={inputRef}
                    type="text"
                    placeholder={placeholder}
                    className="w-full px-2 py-1 bg-transparent border-none focus:outline-none"
                    value={questionSentence} 
                    onChange={e => setQuestionSentence(e.target.value)}
                    disabled={isLoading}
                    onKeyDown={(e) => handleKeyDown(e)}
                    autoFocus={true}
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

export default QuestionField;

