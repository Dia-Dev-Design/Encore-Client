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
    // Use a ref to track previous message for debugging
    const prevMessageRef = useRef<string>("");
    const renderCountRef = useRef(0);
    const [visibleContent, setVisibleContent] = useState<string>("");
    const fullContentRef = useRef<string>("");

    console.log("AIConversationBlock rendering:", { 
        blockId, 
        messageLength: message?.length || 0,
        messageSample: message?.substring(0, 20),
        isStreaming,
        isError
    });

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
    
    // Log whenever the component renders with new props
    // useEffect(() => {
    //     if (!isStreaming || !message) return;
    //     fullContentRef.current = message;

    //     // if (prevMessageRef.current !== message) {
    //     //     console.log(`AIConversationBlock received new message (${++renderCountRef.current}):`, { 
    //     //         blockId, 
    //     //         messageLength: message?.length || 0,
    //     //         messageDiff: message?.length - (prevMessageRef.current?.length || 0),
    //     //         isStreaming, 
    //     //         isError 
    //     //     });
    //     //     prevMessageRef.current = message;
    //     // }
    //     // If we're streaming and message is different from what's visible,
    // // gradually reveal the content character by character
    // if (message !== visibleContent) {
    //     // Determine how many characters to show next
    //     const nextLength = Math.min(
    //         visibleContent.length + 5, // Show 5 chars at a time
    //         fullContentRef.current.length
    //     );
        
    //     // If we haven't shown the full content yet
    //     if (nextLength > visibleContent.length) {
    //         const timer = setTimeout(() => {
    //             setVisibleContent(fullContentRef.current.substring(0, nextLength));
    //         }, 10); // Very small delay for smooth typing effect
                
    //             return () => clearTimeout(timer);
    //         }
    //     }
    // }, [message, blockId, isStreaming, isError]);
    
    // Set up a forced re-render timer during streaming
    // const [, setForceUpdate] = useState({});
    // useEffect(() => {
    //     console.log("AIConversationBlock streaming update:", { 
    //         isStreaming, 
    //         messageLength: message?.length,
    //     });
    //     if (isStreaming) {
    //         setVisibleContent("");
    //         fullContentRef.current = message || "";

    //         // const timer = setInterval(() => {
    //         //     // Force React to re-render this component
    //         //     setForceUpdate({});
    //         // }, 100); // Re-render every 100ms
            
    //         // return () => clearInterval(timer);
    //     } else {
    //         setVisibleContent(fullContentRef.current || "");
    //     }
    // }, [message,isStreaming]);

    // Handle streaming effect if needed
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

    // Add a debug effect to help track what's happening
    useEffect(() => {
        console.log("AIConversationBlock streaming update:", { 
            isStreaming, 
            messageLength: message?.length,
            visibleContentLength: visibleContent?.length,
            fullContentRefLength: fullContentRef.current?.length
        });
    }, [message, isStreaming, visibleContent]);
    
    // Actively animate the cursor during streaming
    const [showCursor, setShowCursor] = useState(true);
    useEffect(() => {
        if (isStreaming) {
            const cursorTimer = setInterval(() => {
                setShowCursor(prev => !prev);
            }, 500); // Blink every 500ms
            
            return () => clearInterval(cursorTimer);
        } else {
            setShowCursor(false);
        }
    }, [isStreaming]);

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
                            {isStreaming && showCursor && (
                                <span className="typing-cursor">|</span>
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
