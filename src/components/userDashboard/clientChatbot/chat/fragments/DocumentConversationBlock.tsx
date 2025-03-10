import React, { useEffect, useState } from "react";
import { Tooltip } from "antd";
import DocumentIcon from "assets/icons/chat/DocumentIcon.svg";
import AttachIcon from "assets/icons/chat/AttachIcon.svg";

interface DocumentConversationBlockProps {
    name: string;
    url: string | undefined;
}

const DocumentConversationBlock: React.FC<DocumentConversationBlockProps> =({name, url}) => {
    return (
        url ? (
            <a href={url} target="_blank" className="min-h-20 flex flex-row gap-2 p-6 justify-end items-center">
                <img src={AttachIcon} alt="Attached" />
                <img src={DocumentIcon} alt="Document" />
                <p className="font-figtree text-base font-medium text-primaryMariner-950">{name}</p>    
            </a>
        ) : (
            <div className="min-h-20 flex flex-row gap-2 p-6 justify-end items-center">
                <img src={AttachIcon} alt="Attached" />
                <img src={DocumentIcon} alt="Document" />
                <p className="font-figtree text-base font-medium text-primaryMariner-950">{name}</p>    
            </div>
        )
    );
};

export default DocumentConversationBlock;
