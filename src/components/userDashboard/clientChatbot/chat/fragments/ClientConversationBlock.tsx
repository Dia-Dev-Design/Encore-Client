import React, { useEffect, useState } from "react";
import { Tooltip } from "antd";
import EmptyStarIcon from "assets/icons/chat/EmptyStar.svg";
import FilledStarIcon from "assets/icons/chat/StarIcon.svg";
import EditIcon from "assets/icons/chat/DarkEditIcon.svg";
import DarkAvatarIcon from "assets/icons/chat/DarkGenericAavatar.svg";

interface ClientConversationBlockProps {
    blockId: string;
    message: string;
    isStarred: boolean;
    setAsStarred: (blockId: string) => void;
}

const ClientConversationBlock: React.FC<ClientConversationBlockProps> =({blockId, message, isStarred, setAsStarred}) => {
    
    return (
        <div className="min-h-20 flex flex-row gap-2 p-6 justify-end items-center">
            <Tooltip title={isStarred ? "Unmark Prompt" : "Mark Prompt"}>
                <button onClick={()=> setAsStarred(blockId)}>
                    <img src={isStarred ? FilledStarIcon : EmptyStarIcon } alt={isStarred ? "Unmark" : "Mark" } />
                </button>
            </Tooltip>
            
            <Tooltip title="Edit">
                <button>
                    <img src={EditIcon} alt="Edit" />
                </button>
            </Tooltip>
            <img src={DarkAvatarIcon} alt="Client" />
            <p className="w-3/4 md:w-auto font-figtree text-base text-primaryMariner-950">{message}</p>
        </div>
    );
};

export default ClientConversationBlock;
