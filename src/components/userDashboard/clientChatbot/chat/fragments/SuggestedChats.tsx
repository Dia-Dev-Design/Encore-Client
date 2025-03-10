import React, { useEffect, useRef, useState } from "react";
import StarIcon from "assets/icons/chat/StarIcon.svg";
import SparklesIcon from "assets/icons/chat/Sparkles.svg";
import RecomendationBubble from "../RecomendationBubble";
import { HistoryNode } from "interfaces/clientDashboard/historyNode.interface";
import RecomendationText from "../RecommendationText";

interface SuggestedChatsProps {
    showChats: boolean;
    handleSend: (prompt: string) => void;
    markedPrompts: HistoryNode[];
}

const SuggestedChats: React.FC<SuggestedChatsProps> =({showChats, handleSend, markedPrompts}) => {
    const prompts = [
        "Can you compare the legal differences between forming an LLC, S-Corp, or C-Corp for a new business?",
        "What are the key legal steps I need to take to protect my startup’s intellectual property?",
        "Guide me through drafting an employment contract that complies with current labor laws for my small business.",
        "Explain the basics of contract law and what I should include in a business agreement to ensure it's legally binding.",
        "What legal risks should I consider when launching a new product, and how can I mitigate them?",
        "Outline the legal steps to take when a contract breach occurs between business partners.",
        "What legal considerations should I address when drafting terms of service and a privacy policy for an e-commerce website?",
        "Identify key regulatory and compliance issues that a startup should address in its first year of operations.",
        "What legal factors must be considered when planning to expand my business internationally, including compliance with foreign laws?"
    ]
    return (
        showChats ? (
            <div className="h-full flex flex-col mt-4 mb-12 md:my-0 gap-8 md:gap-0 md:flex-row overflow-y-auto">
                <div className="w-full md:w-1/2 px-4 flex flex-col justify-start gap-x-2">
                    <div className="w-full flex flex-row gap-x-2 md:justify-center items-center">
                        <img src={SparklesIcon} alt="Sparkles" />
                        <p className="text-lg font-medium font-figtree text-neutrals-black select-none">Recommended Prompts</p>
                    </div>
                    {prompts.map((suggestedOption:string, index)=>
                        <RecomendationBubble 
                            key={index} 
                            message={suggestedOption}
                            handleSend={handleSend}
                        />
                    )}
                </div>

                <div className="w-full md:w-1/2 h-20 px-4 flex flex-col justify-start gap-y-2">
                    <div className="w-full flex flex-row gap-x-2 md:justify-center items-center">
                        <img src={StarIcon} alt="Star" />
                        <p className="text-lg font-medium font-figtree text-neutrals-black select-none">Your Marked Prompts</p>
                    </div>
                    {markedPrompts && markedPrompts.length > 0 ? markedPrompts.map((prompt) => (
                        <RecomendationText key={prompt.checkpoint_id} promptData={prompt} />
                    )) : (
                        <p className="font-figtree font-medium text-greys-700" >No marked prompts yet</p>
                    )}
                </div>
            </div>
        ) : (
            <div className="w-full h-20 flex flex-col gap-y-2 pt-5">
                <p className="text-xl font-bold font-figtree text-neutrals-black">No chats in this project yet</p>
                <p className="text-lg font-figtree text-neutrals-black">
                    Start typing in the “New chat in this project” input field to create a new chat. An automatic name will be created according to the topic. However you can change its name by clicking the pencil icon at the right side of the bar.
                </p>
            </div>
        )
    );
};

export default SuggestedChats;

