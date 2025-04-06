import { Drawer, Button } from "antd";
import { useEffect, useState } from "react";
import NotificationsHeader from "./NotificationsHeader";
import NotificationsTab from "./NotificationsTab";
import NotificationsList from "./NotificationsList";
import { useAuth } from "context/auth.context";
import { Notification } from "interfaces/notifications/notification.interface";
const NotificationSlideover = ({
  open,
  setOpen,
  markAllNotificationsAsRead,
  notificationsData,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  markAllNotificationsAsRead?: () => void;
  notificationsData?: any;
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    console.log("notificationsData", notificationsData);
    if (notificationsData && notificationsData.list) {
      const filteredNotifications = notificationsData.list.filter(
        (notification: Notification) =>
          user?.isAdmin
            ? notification.lawyerRequest?.lawyerId === user?.user.id
            : notification.lawyerRequest?.userId === user?.user.id
      );
      setNotifications(filteredNotifications);
    }
  }, [notificationsData]);

  return (
    <>
      <Drawer
        title={
          <NotificationsHeader
            setOpen={setOpen}
            markAllNotificationsAsRead={markAllNotificationsAsRead}
          />
        }
        placement="right" // 'left', 'top', 'bottom' also available
        onClose={() => setOpen(false)}
        open={open}
        width={400}
        closable={false}
        styles={{
          header: { padding: 0 },
          body: {
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: "0px",
          },
        }}
      >
        <NotificationsTab />
        <NotificationsList notifications={notifications} />
      </Drawer>
    </>
  );
};

export default NotificationSlideover;
