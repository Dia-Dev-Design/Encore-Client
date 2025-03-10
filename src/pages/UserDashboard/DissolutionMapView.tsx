import React from "react";
import AdminLayout from "components/common/layouts/AdminLayout";
import { userSidebarOption } from "consts/dashboard.const";
import DissolutionMap from "components/userDashboard/DissoluitionMap";
import { HeaderTitle } from "interfaces/dashboard/headerTitle.enum";
import { getUser } from "api/dashboard.api";
import { ViewProps } from "interfaces/dashboard/viewProps.interface";

const DissolutionMapView: React.FC<ViewProps> = ({isSideBarCollapsed, setIsSideBarCollapsed}) => {
    const { data, isLoading } = getUser();

    return (
        <AdminLayout
            isUser={HeaderTitle.Client}
            title="Dissolution Map"
            user={data as any}
            options={userSidebarOption}
            isSideBarCollapsed={isSideBarCollapsed}
            setIsSideBarCollapsed={setIsSideBarCollapsed}
        >
            <DissolutionMap/>
        </AdminLayout>
    );
};

export { DissolutionMapView };
