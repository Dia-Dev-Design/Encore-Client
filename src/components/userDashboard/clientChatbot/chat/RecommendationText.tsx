import { HistoryNode } from "interfaces/clientDashboard/historyNode.interface";
import React, { useEffect, useRef, useState } from "react";

interface RecomendationBubbleProps {
    promptData: HistoryNode;
}

const RecomendationText: React.FC<RecomendationBubbleProps> =({promptData}) => {

    return (
        <button className="flex py-1 h-fit w-full">
            <p className="text-sm font-medium font-figtree text-primaryMariner-950">{promptData.content}</p>
        </button>
    );
};

export default RecomendationText;

