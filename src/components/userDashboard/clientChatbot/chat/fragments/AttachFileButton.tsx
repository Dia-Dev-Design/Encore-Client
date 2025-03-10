import React, { useState } from "react";
import { Tooltip } from "antd";
import AttachIcon from "assets/icons/chat/AttachIcon.svg";

interface AttachFileButtonProps {
    uploadedFile: File | null;
    setUploadedFile: (file: File) => void;
}

const AttachFileButton: React.FC<AttachFileButtonProps> =({uploadedFile, setUploadedFile}) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploadedFile(file);
        }
    };

    return (
        <Tooltip title={uploadedFile ? uploadedFile.name : "Attach File"} open={uploadedFile !== null}>
            <button>
                <label htmlFor="file-upload" className="cursor-pointer">
                    <img src={AttachIcon} alt="Attach File" />
                </label>
            </button>
            <input
                id="file-upload"
                type="file"
                accept="application/pdf"
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
        </Tooltip>
    );
};

export default AttachFileButton;

