import React, { useEffect, useRef, useState } from "react";

interface RecomendationBubbleProps {
    message: string;
    handleSend: (prompt: string) => void;
}

const RecomendationBubble: React.FC<RecomendationBubbleProps> =({message, handleSend}) => {

    return (
        <button
            className="flex items-center justify-center p-2 h-fit"
            onClick={()=>handleSend(message)}
        >
            <p className="text-sm font-medium font-figtree text-left text-neutrals-black">{message}</p>
        </button>
    );
};

export default RecomendationBubble;

