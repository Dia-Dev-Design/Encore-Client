import { Button } from "antd";

const NotificationsTab = () => {
  return (
    <div className="w-full h-12 flex border-b border-greys-100">
      <Button
        style={{
          width: "116px",
          height: "48px",
          color: "#1975D2",
          fontFamily: "Figtree, sans-serif",
          fontWeight: 500,
          fontSize: "16px",
          border: "none",
          borderBottom: "1px solid #EAEDEF",
          boxShadow: "none",
          position: "relative",
        }}
      >
        All
        {/* pending implementation of active tab */}
        {true && <div className="w-4 h-1 bg-primaryMariner-700 absolute bottom-0 rounded-t-md" />}
      </Button>
    </div>
  );
};

export default NotificationsTab;
