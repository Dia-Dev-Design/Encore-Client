import React, { useEffect, useState } from "react";
import Metrics from "components/dashboard/metrics/Metrics";
import ActionableTasks from "components/dashboard/actionableTask/ActionableTask";
import Clients from "components/common/clients/Clients";
import AdminLayout from "components/common/layouts/AdminLayout";
import {
  ADMIN_NOTiFICATIONS,
  adminSidebarOptions,
} from "consts/dashboard.const";
import { HeaderTitle } from "interfaces/dashboard/headerTitle.enum";
import {
  getAdminNotifications,
  getAdminUser,
  hideAdminNotifications,
} from "api/dashboard.api";
import { ViewProps } from "interfaces/dashboard/viewProps.interface";
import { useQueryParams } from "helper/query.helper";
import { AdminNotificationParams } from "interfaces/dashboard/adminNotifications.interface";
import { useNavigate } from "react-router-dom";
import { appRoute } from "consts/routes.const";
import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js'

interface TableRecord {
    id: number;
    field_name: string;
    // Add other fields as needed
  }

const DashboardView: React.FC<ViewProps> = ({
  isSideBarCollapsed,
  setIsSideBarCollapsed,
}) => {
  const navigate = useNavigate();

  
  
  
  // const [params, setParams] = useQueryParams<AdminNotificationParams>({
    //     limit: 50, page: 1, category: null
    // });
    const { data: userData, isLoading: userDataLoading } = getAdminUser();
    //   const { data: notificationsData, isLoading: notificationDataLoading } = getAdminNotifications(ADMIN_NOTiFICATIONS, params);
    
    const [notificationsData, setNotificationsData] = useState(Array)
    
    const [lastNotificationCounter, setLastNotificationCounter] =
    useState<number>(-1);
    const { mutate, isPending } = hideAdminNotifications();
    
  //   useEffect(() => {

        
  //   console.log("Here we are hitting the UseEffect!!!!")

  //   const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

  //   const channel: RealtimeChannel = supabase
  //     .channel("inserts-only")
  //     .on(
  //       "postgres_changes",
  //       {
  //         event: "INSERT",
  //         schema: "public",
  //         table: "ChatThread",
  //         filter: 'chatType=eq.CHAT_LAWYER',
  //       },
  //       (payload) => {
  //         console.log("New record inserted:", payload);
  //         setNotificationsData((previous: any) => [...previous, payload.new as TableRecord])
  //       }
  //     )
  //     .subscribe();
  //   // if (lastNotificationCounter < 0) {
  //   //     setLastNotificationCounter(notificationsData?.totalUnread);
  //   // } else {
  //   //     if (lastNotificationCounter !== notificationsData?.totalUnread){
  //   //         setLastNotificationCounter(notificationsData?.totalUnread);
  //   //     }
  //   // }
  //   return () => {
  //       channel.unsubscribe()
  //     }
  // }, []);

//   const hideAllNotifications = async () => {
//     if (notificationsData && notificationsData.list) {
//       try {
//         await Promise.all(
//           notificationsData.list
//             .filter((notification: any) => !notification.isRead)
//             .map((notification: any) => {
//               mutate(notification.id, {
//                 onSuccess: (data) => {
//                   console.log("Endpoint result:", data);
//                 },
//                 onError: (error, payload) => {
//                   console.error("Error:", error, payload);
//                 },
//               });
//             })
//         );

//         setLastNotificationCounter(-1);
//         navigate(appRoute.admin.clients);
//       } catch (error) {
//         console.error("Error hiding notifications:", error);
//       }
//     }
//   };

  return (
    <AdminLayout
      isUser={HeaderTitle.Admin}
      title="Admin Dashboard"
      user={userData as any}
      options={adminSidebarOptions}
      isSideBarCollapsed={isSideBarCollapsed}
      setIsSideBarCollapsed={setIsSideBarCollapsed}
      notificationBadgeCounter={lastNotificationCounter}
    //   hideNotifications={hideAllNotifications}
    >
      <Metrics />
      <ActionableTasks />
      <Clients />
    </AdminLayout>
  );
};

export { DashboardView };
