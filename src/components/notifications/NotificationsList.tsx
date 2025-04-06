import { Notification } from "interfaces/notifications/notification.interface";
import NotificationsItem from "./NotificationsItem";

const NotificationsList = ({
  notifications,
}: {
  notifications: Notification[];
}) => {
  return (
    <div className="flex flex-col gap-0">
      {notifications.map((notification) => (
        <NotificationsItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

export default NotificationsList;
