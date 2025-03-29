import React, { useEffect } from "react";
import AdminLayout from "components/common/layouts/AdminLayout";
import AiChatbot from "components/userDashboard/AiChatbot";
import { userSidebarOption } from "consts/dashboard.const";
import { HeaderTitle } from "interfaces/dashboard/headerTitle.enum";
import { getUser } from "api/dashboard.api";
import { ViewProps } from "interfaces/dashboard/viewProps.interface";
import { useParams } from "react-router-dom";


const AiChatbotView: React.FC<ViewProps> = ({isSideBarCollapsed, setIsSideBarCollapsed}) => {
    const { data, isLoading } = getUser();

    const params = useParams()

    useEffect(() => {
        console.log("These are the params of where I'm being called======>>", params)
    }, [])

    return (
        <AdminLayout 
            isUser={HeaderTitle.Client}
            isDarkBackground
            title={"AI Chatbot"}
            user={data as any}
            options={userSidebarOption}
            isSideBarCollapsed={isSideBarCollapsed}
            setIsSideBarCollapsed={setIsSideBarCollapsed}
        >
            <AiChatbot/>
        </AdminLayout>
    );
};

export { AiChatbotView };
