import { TabsProps } from "antd";
import { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";
import { getCompany } from "api/company.api";
import { getAdminUser, getDissolutionTasks } from "api/dashboard.api";
import AdminAIChatbot from "components/clients/company/ai-chatbot/AdminAIChatbot";
import IARequest from "components/clients/company/ia-request/IARequest";
import AdminLayout from "components/common/layouts/AdminLayout";
import NavigationTabBar from "components/layouts/NavigationTabBar";
import { adminSidebarOptions } from "consts/dashboard.const";
import { COMPANY, DISSOLUTION_CLIENTS } from "consts/query.const";
import { appRoute } from "consts/routes.const";
import { CompanyResponse } from "interfaces/company/company.interface";
import { HeaderTitle } from "interfaces/dashboard/headerTitle.enum";
import { ViewProps } from "interfaces/dashboard/viewProps.interface";
import { useParams } from "react-router-dom";
import "wx-react-gantt/dist/gantt.css";
import DissolutionRoadMap from "components/clients/company/dissolutionRoadmap/DissolutionRoadmap";

const columns = [
    { id: "text", header: "Task name", flexGrow: 2, width: 200 },
    {
        id: "start",
        header: "Start date",
        flexGrow: 1,
        align: "center",
    },
    {
        id: "duration",
        header: "Duration",
        width: 100,
        flexGrow: 1,
        align: "center",
    },
    {
        id: "action",
        header: "",
        width: 30,
        align: "center",
    },
];

const scales = [
    { unit: "month", step: 1, format: "MMMM yyy" },
    { unit: "day", step: 1, format: "d" },
];

const breadcrumbItems = (companyName: string): BreadcrumbItemType[] => [
    {
        title: "Dissolution Clients",
        href: `${appRoute.admin}${appRoute.clients}?clientsTableTab=${DISSOLUTION_CLIENTS}`,
    },
    {
        title: companyName,
    },
];

const DissolutionRoadmapView: React.FC<ViewProps> = ({
    isSideBarCollapsed,
    setIsSideBarCollapsed,
}) => {

    const { companyId } = useParams<{ companyId: string }>();
    const { data } = getAdminUser();
    const { data: dataCompany, isLoading: isLoadingCompany } = getCompany(
        COMPANY,
        companyId
    );

    const itemsTabs = (
        company: CompanyResponse,
        isLoadingCompany: boolean
    ): TabsProps["items"] => [
        {
            key: "1",
            label: "Info & Roadmap",
            children:<DissolutionRoadMap isLoadingCompany={isLoadingCompany} company={company}/>
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
            label: "Doc Hub",
            children: (
                <div>
                    <h1>Option 3</h1>
                </div>
            ),
        },
        {
            key: "5",
            label: "AI Chatbot",
            children: <AdminAIChatbot />,
        },
    ];



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
                    breadcrumbItems={breadcrumbItems(
                        dataCompany?.name as string
                    )}
                    companyName={dataCompany?.name as string}
                    type={dataCompany?.type as string}
                    tabs={itemsTabs(
                        dataCompany as CompanyResponse,
                        isLoadingCompany
                    )}
                    isLoading={isLoadingCompany}
                />
            </div>
        </AdminLayout>
    );
};
export default DissolutionRoadmapView;
