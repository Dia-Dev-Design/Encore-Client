import React, { useEffect, useState, useRef } from "react";
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
    isStreaming?: boolean;
    isError?: boolean;
}

const AIConversationBlock: React.FC<AIConversationBlockProps> =({blockId, message, setAnswerCondition, isStreaming, isError}) => {
    const [visibleContent, setVisibleContent] = useState<string>("");
    const fullContentRef = useRef<string>("");

    // When message changes, update the visible content appropriately
    useEffect(() => {
        if (!message) return;
        
        // Store the full message
        fullContentRef.current = message;
        
        if (isStreaming) {
            // For streaming, we'll handle gradual reveal in a separate effect
            // Just initialize visible content if needed
            if (!visibleContent) setVisibleContent("");
        } else {
            // For non-streaming (existing messages), show the full content immediately
            setVisibleContent(message);
        }
    }, [message, isStreaming]);

    // Handle streaming effect
    useEffect(() => {
        if (!isStreaming || !message) return;
        
        // If we're streaming and message is different from what's visible,
        // gradually reveal the content character by character
        if (message !== visibleContent) {
            // Determine how many characters to show next
            const nextLength = Math.min(
                visibleContent.length + 5, // Show 5 chars at a time
                fullContentRef.current.length
            );
            
            // If we haven't shown the full content yet
            if (nextLength > visibleContent.length) {
                const timer = setTimeout(() => {
                    setVisibleContent(fullContentRef.current.substring(0, nextLength));
                }, 10); // Very small delay for smooth typing effect
                
                return () => clearTimeout(timer);
            }
        }
    }, [message, visibleContent, isStreaming]);

    
    // Actively animate the cursor during streaming
    // const [showCursor, setShowCursor] = useState(true);
    // useEffect(() => {
    //     if (isStreaming) {
    //         const cursorTimer = setInterval(() => {
    //             setShowCursor(prev => !prev);
    //         }, 500); // Blink every 500ms
            
    //         return () => clearInterval(cursorTimer);
    //     } else {
    //         setShowCursor(false);
    //     }
    // }, [isStreaming]);

    const displayContent = isStreaming ? visibleContent : message;
    
    return (
        <div className={`flex flex-row gap-2 p-6 items-center ${isError ? 'bg-red-50' : 'bg-primaryLinkWater-50'}`}>
            <div className="flex flex-col h-full py-6">
                <img src={EncoreIcon} alt="Logo" className="h-auto min-w-14 justify-start"/>   
            </div>
            <div className="flex flex-col gap-3 h-fit">
                <span className={`font-figtree text-base leading-8 ${isError ? 'text-red-600' : 'text-primaryMariner-950'}`}>
                    {isError ? (
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {message || "An error occurred while generating a response. Please try again."}
                        </div>
                    ) : (
                        <div>
                            {displayContent ? <Markdown>{displayContent}</Markdown> : ""}
                            {isStreaming && (
                                <span className="typing-cursor"></span>
                            )}
                        </div>
                    )}
                </span>
                <div className="flex flex-row gap-2">
                    {!isStreaming && !isError && (
                        <>
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
                                <button onClick={() => {navigator.clipboard.writeText(displayContent || "")}}>
                                    <img src={CopyIcon} alt="Copy" />
                                </button>
                            </Tooltip>
                        </>
                    )}
                    {isStreaming && (
                        <span className="text-sm text-gray-500 italic">Generating...</span>
                    )}
                    {isError && (
                        <button 
                            className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                            onClick={() => window.location.reload()}
                        >
                            Retry
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIConversationBlock;
