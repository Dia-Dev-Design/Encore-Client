import React from "react";
import AdminLayout from "components/common/layouts/AdminLayout";
import { userSidebarOption } from "consts/dashboard.const";
import { HeaderTitle } from "interfaces/dashboard/headerTitle.enum";
import { getUser } from "api/dashboard.api";
import { ViewProps } from "interfaces/dashboard/viewProps.interface";
import DocHub from "components/userDashboard/DocHub";


const DocHubView: React.FC<ViewProps> = ({isSideBarCollapsed, setIsSideBarCollapsed}) => {
    const { data, isLoading } = getUser();

    return (
        <AdminLayout 
            isUser={HeaderTitle.Client}
            isDarkBackground
            title={"Doc Hub"}
            user={data as any}
            options={userSidebarOption}
            isSideBarCollapsed={isSideBarCollapsed}
            setIsSideBarCollapsed={setIsSideBarCollapsed}
        >
            <DocHub/>
        </AdminLayout>
    );
};

export { DocHubView };
