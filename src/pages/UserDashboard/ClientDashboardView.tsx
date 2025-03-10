import React from "react";
import AdminLayout from "components/common/layouts/AdminLayout";
import { userSidebarOption } from "consts/dashboard.const";
import { HeaderTitle } from "interfaces/dashboard/headerTitle.enum";
import { getUser } from "api/dashboard.api";
import ClientMetrics from "components/userDashboard/ClientMetrics";
import { ViewProps } from "interfaces/dashboard/viewProps.interface";

const ClientDashboardView: React.FC<ViewProps> = ({isSideBarCollapsed, setIsSideBarCollapsed}) => {
    const { data, isLoading } = getUser();

    return (
        <AdminLayout
            isUser={HeaderTitle.Client}
            title="Dashboard"
            user={data as any}
            options={userSidebarOption}
            isSideBarCollapsed={isSideBarCollapsed}
            setIsSideBarCollapsed={setIsSideBarCollapsed}
        >
            <ClientMetrics />
        </AdminLayout>
    );
};

export { ClientDashboardView };
