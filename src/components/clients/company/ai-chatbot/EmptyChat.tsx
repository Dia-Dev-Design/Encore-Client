import React, { useState } from "react";
import EncoreBlack from "assets/icons/chat/EncoreIconBlack.svg";

const EmptyChat: React.FC =() => {

    return (
        <div className="flex flex-col flex-grow gap-8 px-14 py-9 justify-center items-center overflow-y-auto">
            <div className="flex flex-row gap-x-2 w-full justify-center">
                <img src={EncoreBlack} alt="Logo" />
                <p className="text-2xl font-medium font-figtree text-primaryMariner-950 select-none">Select a chat to continue</p>
            </div>
        </div>
    );
};

export default EmptyChat;

