import React, { useState } from "react";

interface HistoryDividerProps {
    title: string;
}

const HistoryDivider: React.FC<HistoryDividerProps> =({ title }) => {

    return (
        <div className="w-full min-h-10 flex flex-row justify-between items-center">
            <p className="text-sm font-medium font-figtree text-greys-300 select-none">{title}</p>
        </div>
    );
};

export default HistoryDivider;

