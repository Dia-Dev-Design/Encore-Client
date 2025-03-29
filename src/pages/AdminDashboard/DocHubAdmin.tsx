import React from "react";
import AdminLayout from "components/common/layouts/AdminLayout";
import { adminSidebarOptions } from "consts/dashboard.const";
import { HeaderTitle } from "interfaces/dashboard/headerTitle.enum";
import { getAdminUser } from "api/dashboard.api";
import { ViewProps } from "interfaces/dashboard/viewProps.interface";
import DocHub from "components/userDashboard/DocHub";

const AdminDocHubView: React.FC<ViewProps> = ({
  isSideBarCollapsed,
  setIsSideBarCollapsed,
}) => {
  const { data, isLoading } = getAdminUser();

  return (
    <AdminLayout
      isUser={HeaderTitle.Admin}
      isDarkBackground
      title={"Doc Hub"}
      user={data as any}
      options={adminSidebarOptions}
      isSideBarCollapsed={isSideBarCollapsed}
      setIsSideBarCollapsed={setIsSideBarCollapsed}
    >
      <DocHub />
    </AdminLayout>
  );
};

export { AdminDocHubView };
