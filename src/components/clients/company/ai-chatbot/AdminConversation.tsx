import React, { useEffect, useRef, useState } from "react";
import AIConversationBlock from "components/userDashboard/clientChatbot/chat/fragments/AIConversationBlock";
import { DocumentNode, HistoryNode } from "interfaces/clientDashboard/historyNode.interface";
import DocumentConversationBlock from "components/userDashboard/clientChatbot/chat/fragments/DocumentConversationBlock";
import ClientBlock from "./ClientBlock";
import AdminLawyerBlock from "./AdminLawyerBlock";

interface ClientConversationProps {
    historyConversation: HistoryNode[];
    filesConversation: DocumentNode[];
}

const AdminConversation: React.FC<ClientConversationProps> =({historyConversation, filesConversation}) => {
    const conversationEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (conversationEndRef.current) {
            conversationEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [historyConversation]);

    const setAnswerCondition = (isGood: boolean, blockID: string) => {
        console.log(isGood, blockID);
    }
    
    return (
        <div className="flex h-[78%] flex-col gap-2 w-full justify-start overflow-y-auto relative">
            {historyConversation && historyConversation.map((node: HistoryNode) => {
                const key = node.checkpoint_id;

                if (node.role === "user") {
                    const documentNode = filesConversation.find(
                        (file) => file.id === node.fileId
                    );
                    if (documentNode) {
                        <>
                            <DocumentConversationBlock
                                key={key}
                                name={documentNode.originalName || "Document"}
                                url={documentNode.url}
                            />
                            <ClientBlock
                                key={key}
                                message={node.content}
                            />
                        </>
                    } else {
                        return (
                            <ClientBlock
                                key={key}
                                message={node.content}
                            />
                        )
                    }
                } else if (node.role === "document") {
                    return (
                        <DocumentConversationBlock
                            key={key}
                            name={node.content}
                            url={node.url}
                        />
                    )
                } else if (node.role === "ai") {
                    return (
                        <AIConversationBlock 
                            key={key}
                            blockId={node.checkpoint_id}
                            message={node.content}
                            setAnswerCondition={setAnswerCondition}
                        />
                    )
                } else {
                    return (
                        <AdminLawyerBlock 
                            key={key}
                            message={node.content}
                        />
                    )
                }
            })}
            <div ref={conversationEndRef} />
        </div>
    );
};

export default AdminConversation;
