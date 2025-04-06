import { Button } from "antd";
import { Notification } from "interfaces/notifications/notification.interface";
import { MoreOutlined } from "@ant-design/icons";
const NotificationsItem = ({
  notification,
}: {
  notification: Notification;
}) => {
  const options: Intl.DateTimeFormatOptions = {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  const dateFormatter = new Intl.DateTimeFormat(
    navigator.language || "en-US",
    options
  );

  const bgColorClass = notification.readed
    ? "bg-white"
    : "bg-primaryMariner-50";

  const iconColorClass = notification.readed
    ? "bg-white"
    : "bg-primaryMariner-700";
  return (
    <div
      className={`flex items-center px-6 py-2 h-24 border-b border-greys-100 ${bgColorClass}`}
    >
      {/* left side */}
      <div
        className={`p-1 border border-primaryMariner-700 rounded-full h-2 ${iconColorClass}`}
      ></div>
      {/* content */}
      <div className="flex flex-col flex-1 px-4 items-start h-full justify-between">
        <p className="font-figtree font-medium text-base text-neutrals-black">
          A scope of work has been approved for [Chat Name] Document Review.
        </p>
        <p className="font-figtree font-medium text-sm text-[#6F7886] ">
          {dateFormatter.format(new Date(notification.createdAt))}
        </p>
      </div>
      {/* right side */}
      <div className="flex h-full items-center">
        <Button
          variant="text"
          icon={<MoreOutlined />}
          style={{
            border: "none",
            boxShadow: "none",
            backgroundColor: "transparent",
          }}
        ></Button>
      </div>
    </div>
  );
};

export default NotificationsItem;
