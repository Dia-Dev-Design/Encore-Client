import React, { useEffect, useState } from "react";
import { Tooltip } from "antd";
import EncoreIcon from "assets/icons/chat/EncoreIconBlack.svg";
import ApproveIcon from "assets/icons/chat/Check.svg";
import NegateIcon from "assets/icons/chat/X.svg";
import CopyIcon from "assets/icons/chat/CopyIcon.svg";
import Markdown from "react-markdown";

interface AIConversationBlockProps {
    blockId: string;
    message: string;
    setAnswerCondition: (value: boolean, blockId: string) => void;
}

const AIConversationBlock: React.FC<AIConversationBlockProps> =({blockId, message, setAnswerCondition}) => {
    
    return (
        <div className="flex flex-row gap-2 p-6 items-center bg-primaryLinkWater-50">
            <div className="flex flex-col h-full py-6">
                <img src={EncoreIcon} alt="Logo" className="h-auto min-w-14 justify-start"/>   
            </div>
            <div className="flex flex-col gap-3 h-fit">
                <span className="font-figtree text-base leading-8 text-primaryMariner-950">
                    <Markdown>{message}</Markdown>
                </span>
                <div className="flex flex-row gap-2">
                    <Tooltip title="Good Response">
                        <button onClick={()=> setAnswerCondition(true, blockId)}>
                            <img src={ApproveIcon} alt="Approve" />
                        </button>
                    </Tooltip>
                    <Tooltip title="Bad Response">
                        <button onClick={()=> setAnswerCondition(false, blockId)}>
                            <img src={NegateIcon} alt="Disapprove" />
                        </button>
                    </Tooltip>
                    <Tooltip title="Copy Response">
                        <button onClick={() => {navigator.clipboard.writeText(message)}}>
                            <img src={CopyIcon} alt="Copy" />
                        </button>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};

export default AIConversationBlock;
