import React from "react";
import LawyerAvatarIcon from "assets/icons/chat/LawyerAvatar.svg";

interface ClientBlockProps {
    message: string;
}

const AdminLawyerBlock: React.FC<ClientBlockProps> =({message}) => {
    
    return (
        <div className="min-h-20 flex flex-row gap-2 p-6 justify-end items-center bg-primaryMagicMint-50">
            <img src={LawyerAvatarIcon} alt="Client" />
            <p className="font-figtree text-base text-primaryMariner-950">{message}</p>
        </div>
    );
};

export default AdminLawyerBlock;
