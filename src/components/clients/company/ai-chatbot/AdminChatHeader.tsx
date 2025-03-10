import React from "react";
import EncoreWhite from "assets/icons/chat/EncoreIconWhite.svg";

interface AdminChatHeaderProps {
    title: string;
}

const AdminChatHeader: React.FC<AdminChatHeaderProps> =({title}) => {

    return (
        <div className="flex justify-between h-14 px-6 py-2.5 items-center bg-primaryMariner-900 rounded-t-lg"> 
            <h3 className="text-lg font-medium font-figtree text-neutrals-white">{title}</h3>
            <div className="relative flex flex-row gap-x-4">
                {/* <Tooltip title="Tag Chat">
                    <button>
                        <img src={CreateFolderIcon} alt="Tag Chat" />
                    </button>
                </Tooltip> */}
                <img src={EncoreWhite} alt="Logo" />
            </div>
        </div>
    );
};

export default AdminChatHeader;
