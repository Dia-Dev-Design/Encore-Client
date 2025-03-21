import DashboardIconOn from "assets/icons/dashboardIconOn.svg";
import DashboardIconOff from "assets/icons/dashboardIconOff.svg";
import ClientsIconOn from "assets/icons/clientsIconOn.svg";
import ClientsIconOff from "assets/icons/clientsIconOff.svg";
import UsersIconOn from "assets/icons/usersIconOn.svg";
import UsersIconOff from "assets/icons/usersIconOff.svg";
import AiChatbotIconOn from "assets/icons/chatbotIconOn.svg";
import AiChatbotIconOff from "assets/icons/chatbotIconOff.svg";
import DissolutionIconOn from "assets/icons/dissolutionIconOn.svg";
import DissolutionIconOff from "assets/icons/dissolutionIconOff.svg";
import DocHubOn from "assets/icons/DocHubOn.svg";
import DocHubOff from "assets/icons/DocHubOff.svg";
import { SidebarOption } from "interfaces/dashboard/sidebarOption.interface";
import { appRoute } from "./routes.const";
export const ADMIN_NOTiFICATIONS = "adminNotifications";

export const adminSidebarOptions: SidebarOption[] = [
    {
        path: appRoute.admin.dashboard,
        label: "Dashboard",
        iconOn: DashboardIconOn,
        iconOff: DashboardIconOff,
    },
    {
        path: appRoute.admin.clients,
        label: "Clients",
        iconOn: ClientsIconOn,
        iconOff: ClientsIconOff,
    },
    {
        path: appRoute.admin.users,
        label: "Users",
        iconOn: UsersIconOn,
        iconOff: UsersIconOff,
    },
    {
        path: appRoute.admin.aiChatBot,
        label: "AI Chatbot",
        iconOn: AiChatbotIconOn,
        iconOff: AiChatbotIconOff,
    },
    {
        path: appRoute.admin.docHub,
        label: "Doc Hub",
        iconOn: DocHubOn,
        iconOff: DocHubOff,
    },
];

export const userSidebarOption: SidebarOption[] = [
    {
        path: appRoute.clients.dashboard,
        label: "Dashboard",
        iconOn: DashboardIconOn,
        iconOff: DashboardIconOff,
    },
    {
        path: appRoute.clients.dissolutionMap,
        label: "Dissolution Map",
        iconOn: DissolutionIconOn,
        iconOff: DissolutionIconOff,
    },
    {
        path: appRoute.clients.aiChatBot,
        label: "AI Chatbot",
        iconOn: AiChatbotIconOn,
        iconOff: AiChatbotIconOff,
    },
    {
        path: appRoute.clients.docHub,
        label: "Doc Hub",
        iconOn: DocHubOn,
        iconOff: DocHubOff,
    },
]