import React from "react";
import DarkAvatarIcon from "assets/icons/chat/DarkGenericAavatar.svg";

interface ClientBlockProps {
    message: string;
}

const ClientBlock: React.FC<ClientBlockProps> =({message}) => {
    
    return (
        <div className="min-h-20 flex flex-row gap-2 p-6 justify-start items-center">
            <img src={DarkAvatarIcon} alt="Client" />
            <p className="font-figtree text-base text-primaryMariner-950">{message}</p>
        </div>
    );
};

export default ClientBlock;
