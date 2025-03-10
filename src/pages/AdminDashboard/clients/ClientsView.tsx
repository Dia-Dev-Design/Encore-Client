import { getAdminUser } from "api/dashboard.api";
import Clients from "components/common/clients/Clients";
import AdminLayout from "components/common/layouts/AdminLayout";
import { adminSidebarOptions } from "consts/dashboard.const";
import { HeaderTitle } from "interfaces/dashboard/headerTitle.enum";
import { ViewProps } from "interfaces/dashboard/viewProps.interface";


const ClientsView: React.FC<ViewProps> = ({
    isSideBarCollapsed,
    setIsSideBarCollapsed,
}) => {
    const { data, isLoading } = getAdminUser();

    return (
        <AdminLayout
            isUser={HeaderTitle.Admin}
            title="Clients"
            user={data as any}
            options={adminSidebarOptions}
            isSideBarCollapsed={isSideBarCollapsed}
            setIsSideBarCollapsed={setIsSideBarCollapsed}
        >
            <Clients isPage={true} />
        </AdminLayout>
    );
};

export { ClientsView };
