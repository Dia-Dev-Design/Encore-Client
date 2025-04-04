import React, { useEffect } from "react";
import AdminLayout from "components/common/layouts/AdminLayout";
import { userSidebarOption } from "consts/dashboard.const";
import { HeaderTitle } from "interfaces/dashboard/headerTitle.enum";
import { getUser } from "api/dashboard.api";
import { ViewProps } from "interfaces/dashboard/viewProps.interface";
import DocHub from "components/userDashboard/DocHub";

import { useParams } from "react-router-dom";
import { useAuth } from "context/auth.context";


const DocHubView: React.FC<ViewProps> = ({isSideBarCollapsed, setIsSideBarCollapsed}) => {
    // const { data, isLoading } = getUser();

    const { user, isLoading } = useAuth()

    const { params } = useParams()

    useEffect(() => {
        console.log("These are the params of where I'm being called======>>", params)
    }, [])

    return (
        <AdminLayout 
            isUser={HeaderTitle.Client}
            isDarkBackground
            title={"Doc Hub"}
            user={user as any}
            options={userSidebarOption}
            isSideBarCollapsed={isSideBarCollapsed}
            setIsSideBarCollapsed={setIsSideBarCollapsed}
        >
            <DocHub/>
        </AdminLayout>
    );
};

export { DocHubView };
