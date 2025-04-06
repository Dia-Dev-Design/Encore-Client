// src/components/DrawerHeader.tsx
import { Button } from "antd";
import { SettingOutlined, CloseOutlined } from "@ant-design/icons";

const NotificationsHeader = ({
  setOpen,
  markAllNotificationsAsRead,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  markAllNotificationsAsRead?: () => void;
}) => {
  return (
    <div className="flex flex-col justify-between items-center w-full p-2">
      <div className="flex justify-end w-full">
        <Button
          type="text"
          icon={<CloseOutlined />}
          size="small"
          onClick={() => setOpen(false)}
        ></Button>
      </div>
      <div className="flex items-center w-full p-4 pb-2 justify-between">
        <div className="font-semibold font-figtree text-2xl text-primaryMariner-900">
          Notifications
        </div>

        <Button
          type="text"
          size="small"
          onClick={() => markAllNotificationsAsRead?.()}
          style={{
            padding: "16px 12px",
            backgroundColor: "#1975D2", // Tailwind: bg-primaryMariner-700
            borderRadius: "0.5rem",
            color: "#fff",
            fontFamily: "Figtree, sans-serif",
            fontWeight: 500,
            fontSize: "16px",
            lineHeight: "1.5",
          }}
        >
          Mark all as read
        </Button>
      </div>
    </div>
  );
};

export default NotificationsHeader;
