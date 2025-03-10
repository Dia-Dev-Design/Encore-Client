import React, { useEffect, useRef, useState } from "react";
import ClientConversationBlock from "./ClientConversationBlock";
import AIConversationBlock from "./AIConversationBlock";
import { DocumentNode, HistoryNode } from "interfaces/clientDashboard/historyNode.interface";
import DocumentConversationBlock from "./DocumentConversationBlock";
import ClientLawyerBlock from "./ClientLawyerBlock";

interface ClientConversationProps {
    historyConversation: HistoryNode[];
    filesConversation: DocumentNode[];
}

const ClientConversation: React.FC<ClientConversationProps> =({historyConversation, filesConversation}) => {
    const conversationEndRef = useRef<HTMLDivElement>(null);
    const [isStarred, setIsStarred] = useState<boolean>(false);

    useEffect(() => {
        if (conversationEndRef.current) {
            conversationEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [historyConversation]);

    const setAsStarred = (blockID: string) => {
        setIsStarred(!isStarred);
    }

    const setAnswerCondition = (isGood: boolean, blockID: string) => {
        console.log(isGood, blockID);
    }
    
    return (
        <div className="flex h-full pb-12 md:h-[78%] flex-col gap-2 w-full justify-start overflow-y-auto relative">
            {historyConversation && historyConversation.map((node: HistoryNode) => {
                if (node.role === "user") {
                    const documentNode = filesConversation.find(
                        (file) => file.id === node.fileId
                    );

                    if (documentNode) {
                        return (
                            <>
                                <DocumentConversationBlock
                                    name={documentNode.originalName || "Document" }
                                    url={documentNode.url}
                                />
                                <ClientConversationBlock
                                    key={node.checkpoint_id}
                                    blockId={node.checkpoint_id}
                                    message={node.content}
                                    isStarred={isStarred}
                                    setAsStarred={setAsStarred}
                                />
                            </>
                        );
                    } else {
                        return (
                            <ClientConversationBlock
                                key={node.checkpoint_id}
                                blockId={node.checkpoint_id}
                                message={node.content}
                                isStarred={isStarred}
                                setAsStarred={setAsStarred}
                            />
                        );
                    }
                } else if (node.role === "document") {
                    return (
                        <DocumentConversationBlock
                            name={node.content}
                            url={node.url}
                        />
                    );
                } else if (node.role === "ai") {
                    return (
                        <AIConversationBlock 
                            key={node.checkpoint_id}
                            blockId={node.checkpoint_id}
                            message={node.content}
                            setAnswerCondition={setAnswerCondition}
                        />
                    )
                } else {
                    return (
                        <ClientLawyerBlock 
                            key={node.checkpoint_id}
                            message={node.content}
                        />
                    );
                } 
            })}
            <div ref={conversationEndRef} />
        </div>
    );
};

export default ClientConversation;
