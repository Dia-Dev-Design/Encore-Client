import { TabsProps } from "antd";
import { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";
import { getCompany } from "api/company.api";
import { getAdminUser } from "api/dashboard.api";
import AdminAIChatbot from "components/clients/company/ai-chatbot/AdminAIChatbot";
import CallSchedule from "components/clients/company/basic-information/CallSchedule";
import CompanyInfo from "components/clients/company/basic-information/CompanyInfo";
import DocHub from "components/userDashboard/DocHub";
import IARequest from "components/clients/company/ia-request/IARequest";
import AdminLayout from "components/common/layouts/AdminLayout";
import NavigationTabBar from "components/layouts/NavigationTabBar";
import { adminSidebarOptions } from "consts/dashboard.const";
import { COMPANY, PROSPECT_CLIENTS } from "consts/query.const";
import { appRoute } from "consts/routes.const";
import { CompanyResponse } from "interfaces/company/company.interface";
import { HeaderTitle } from "interfaces/dashboard/headerTitle.enum";
import { ViewProps } from "interfaces/dashboard/viewProps.interface";
import { useParams } from "react-router-dom";

const breadcrumbItems = (companyName: string): BreadcrumbItemType[] => [
  {
    title: "Prospect Clients",
    href: `${appRoute.admin}${appRoute.clients}?clientsTableTab=${PROSPECT_CLIENTS}`,
  },
  {
    title: companyName,
  },
];

const CompanyDetail = ({
  isSideBarCollapsed,
  setIsSideBarCollapsed,
}: ViewProps) => {
  const { companyId } = useParams<{ companyId: string }>();
  const { data, isLoading } = getAdminUser();

  const itemsTabs = (
    company: CompanyResponse,
    isLoadingCompany: boolean
  ): TabsProps["items"] => [
    {
      key: "1",
      label: "Basic Information",
      children: (
        <>
          <CompanyInfo data={company} isLoading={isLoadingCompany} />
          <CallSchedule />
        </>
      ),
    },
    {
      key: "2",
      label: "AI Request for Intake Call",
      children: <IARequest />,
    },
    {
      key: "3",
      label: "Contract and Fee",
      children: (
        <div>
          <h1>Option 3</h1>
        </div>
      ),
    },
    {
      key: "4",
      label: "AI Chatbot",
      children: <AdminAIChatbot />,
    },
  ];

  const { data: dataCompany, isLoading: isLoadingCompany } = getCompany(
    COMPANY,
    companyId
  );

  return (
    <AdminLayout
      isUser={HeaderTitle.Admin}
      user={data as any}
      options={adminSidebarOptions}
      isSideBarCollapsed={isSideBarCollapsed}
      setIsSideBarCollapsed={setIsSideBarCollapsed}
    >
      <div className="mt-10">
        <NavigationTabBar
          breadcrumbItems={breadcrumbItems(dataCompany?.name as string)}
          companyName={dataCompany?.name as string}
          type={dataCompany?.type as string}
          tabs={itemsTabs(dataCompany as CompanyResponse, isLoadingCompany)}
          isLoading={isLoadingCompany}
        />
      </div>
    </AdminLayout>
  );
};
export default CompanyDetail;
