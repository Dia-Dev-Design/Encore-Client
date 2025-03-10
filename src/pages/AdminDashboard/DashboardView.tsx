import React, { useEffect, useState } from "react";
import Metrics from "components/dashboard/metrics/Metrics";
import ActionableTasks from "components/dashboard/actionableTask/ActionableTask";
import Clients from "components/common/clients/Clients";
import AdminLayout from "components/common/layouts/AdminLayout";
import { ADMIN_NOTiFICATIONS, adminSidebarOptions } from "consts/dashboard.const";
import { HeaderTitle } from "interfaces/dashboard/headerTitle.enum";
import { getAdminNotifications, getAdminUser, hideAdminNotifications } from "api/dashboard.api";
import { ViewProps } from "interfaces/dashboard/viewProps.interface";
import { useQueryParams } from "helper/query.helper";
import { AdminNotificationParams } from "interfaces/dashboard/adminNotifications.interface";
import { useNavigate } from "react-router-dom";
import { appRoute } from "consts/routes.const";

const DashboardView: React.FC<ViewProps> = ({isSideBarCollapsed, setIsSideBarCollapsed}) => {
    const navigate = useNavigate();

    const [params, setParams] = useQueryParams<AdminNotificationParams>({
        limit: 50, page: 1, category: null
    });
    const { data: userData, isLoading: userDataLoading } = getAdminUser();
    const { data: notificationsData, isLoading: notificationDataLoading } = getAdminNotifications(ADMIN_NOTiFICATIONS, params);
    const [lastNotificationCounter, setLastNotificationCounter] = useState<number>(-1);
    const { mutate, isPending } = hideAdminNotifications();

    useEffect(()=>{
        if (lastNotificationCounter < 0) {
            setLastNotificationCounter(notificationsData?.totalUnread);
        } else {
            if (lastNotificationCounter !== notificationsData?.totalUnread){
                setLastNotificationCounter(notificationsData?.totalUnread);
            }
        }
    }, [notificationsData]);

    const hideAllNotifications = async () => {
        if (notificationsData && notificationsData.list) {
            try {
                await Promise.all(
                    notificationsData.list
                        .filter((notification: any) => !notification.isRead)
                        .map((notification:any) => {
                            mutate(notification.id, {
                                onSuccess: (data) => {
                                    console.log("Endpoint result:", data);
                                },
                                onError: (error, payload) => {
                                    console.error("Error:", error, payload);
                                },
                            })
                        })
                );
        
                setLastNotificationCounter(-1); 
                navigate(appRoute.admin.clients);

            } catch (error) {
                console.error("Error hiding notifications:", error);
            }
        }
    };

    return (
        <AdminLayout
            isUser={HeaderTitle.Admin}
            title="Admin Dashboard"
            user={userData as any}
            options={adminSidebarOptions}
            isSideBarCollapsed={isSideBarCollapsed}
            setIsSideBarCollapsed={setIsSideBarCollapsed}
            notificationBadgeCounter={lastNotificationCounter}
            hideNotifications={hideAllNotifications}
        >
            <Metrics />
            <ActionableTasks />
            <Clients />
        </AdminLayout>
    );
};

export { DashboardView };
