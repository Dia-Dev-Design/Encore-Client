import React, { useEffect, useRef, useState, useCallback } from "react";
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
    const prevHistoryLengthRef = useRef<number>(0);

    useEffect(() => {

        console.log("Thisb is history conversation", historyConversation)
        console.log("This is files converstation", filesConversation)

    }, [historyConversation, filesConversation])
    
    // Find if any message is in streaming state
    const hasStreamingMessage = historyConversation.some(node => node.isStreaming);

    // Logging function to keep the effects cleaner
    const logConversationChanges = useCallback(() => {
        const currentHistoryLength = historyConversation.length;
        if (currentHistoryLength !== prevHistoryLengthRef.current) {
            prevHistoryLengthRef.current = currentHistoryLength;
        } 
    }, [historyConversation, hasStreamingMessage]);

    // Combined scrolling effect
    useEffect(() => {
        logConversationChanges();
        
        // Basic scroll to bottom
        if (conversationEndRef.current) {
            conversationEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Set up interval for streaming scrolling
        let interval: NodeJS.Timeout | null = null;
        if (hasStreamingMessage && conversationEndRef.current) {
            interval = setInterval(() => {
                conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 500); // Scroll every 500ms during streaming
        }
        
        // Cleanup function
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [historyConversation, hasStreamingMessage, logConversationChanges]);

    const setAsStarred = (blockID: string) => {
        setIsStarred(!isStarred);
    }

    const setAnswerCondition = (isGood: boolean, blockID: string) => {
        console.log(isGood, blockID);
    }
    
    return (
        <div className="flex h-full pb-12 md:h-[78%] flex-col gap-2 w-full justify-start overflow-y-auto relative">
            {historyConversation && historyConversation.length > 0 ? (
                historyConversation.map((node: HistoryNode, index: number) => {
                    const uniqueKey = `node-${index}-${node.role}-${Date.now()}`;
                    if (node.role === "user") {
                        const documentNode = filesConversation.find(
                            (file) => file.id === node.fileId
                        );

                        if (documentNode) {
                            return (
                                <React.Fragment key={`doc-user-${uniqueKey}`}>
                                    <DocumentConversationBlock
                                        name={documentNode.originalName || "Document" }
                                        url={documentNode.url}
                                    />
                                    <ClientConversationBlock
                                        key={uniqueKey}
                                        blockId={uniqueKey}
                                        message={node.content}
                                        isStarred={isStarred}
                                        setAsStarred={setAsStarred}
                                    />
                                </React.Fragment>
                            );
                        } else {
                            return (
                                <ClientConversationBlock
                                    key={uniqueKey}
                                    blockId={uniqueKey}
                                    message={node.content}
                                    isStarred={isStarred}
                                    setAsStarred={setAsStarred}
                                />
                            );
                        }
                    } else if (node.role === "document") {
                        return (
                            <DocumentConversationBlock
                                key={`doc-${uniqueKey}`}
                                name={node.content}
                                url={node.url}
                            />
                        );
                    } else if (node.role === "ai") {
                        return (
                            <AIConversationBlock 
                                key={uniqueKey}
                                blockId={uniqueKey}
                                message={node.content}
                                setAnswerCondition={setAnswerCondition}
                                isStreaming={node.isStreaming}
                                isError={node.isError}
                            />
                        )
                    } else {
                        return (
                            <ClientLawyerBlock 
                                key={uniqueKey}
                                message={node.content}
                            />
                        );
                    } 
                })
            ) : (
                <div className="text-center text-gray-500 my-10">No messages yet. Start a conversation!</div>
            )}
            <div ref={conversationEndRef} />
        </div>
    );
};

export default ClientConversation;
