import React, { useState } from "react";
import CollapseIcon from "assets/icons/DarkIncompleteHamburger.svg";
import ExpandIcon from "assets/icons/DarkHamburger.svg";
import EncoreIcon from "assets/icons/EncoreIsotype.svg";
import AdminHeader from "components/AdminHeader/AdminHeader";
import Option from "components/common/sidebar/Option";
import { SidebarOption } from "interfaces/dashboard/sidebarOption.interface";
import clsx from "clsx";
import { Tooltip } from "antd";
import { ClientDataReceived } from "interfaces/dashboard/clientDataReceived.interface";
import { HeaderTitle } from "interfaces/dashboard/headerTitle.enum";

interface AdminLayoutProps {
  isUser: HeaderTitle;
  isDarkBackground?: boolean;
  title?: string;
  user: ClientDataReceived;
  children: React.ReactNode;
  options: SidebarOption[];
  isSideBarCollapsed: boolean;
  setIsSideBarCollapsed: (value: boolean) => void;
  notificationBadgeCounter?: number;
  markAllNotificationsAsRead?: () => void;
  notificationsData?: any;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  isUser,
  isDarkBackground = false,
  title,
  user,
  children,
  options,
  isSideBarCollapsed,
  setIsSideBarCollapsed,
  notificationBadgeCounter,
  markAllNotificationsAsRead,
  notificationsData,
}) => {
  return (
    <div className="flex flex-col md:min-h-screen">
      <AdminHeader
        isUser={isUser}
        user={user}
        notificationBadgeCounter={notificationBadgeCounter}
        markAllNotificationsAsRead={markAllNotificationsAsRead}
        notificationsData={notificationsData}
      />
      <div className="flex flex-1 h-max md:h-auto relative">
        <div
          className={`
          flex flex-col h-20 md:h-full 
          w-full ${isSideBarCollapsed ? "md:w-20" : "md:w-52"}
          bg-primaryMariner-50 transition-all duration-300 ease-in-out
          items-center py-4 absolute md:fixed md:pt-16 bottom-0 z-40  `}
        >
          {!isSideBarCollapsed && (
            <div className="hidden md:flex flex-row justify-start w-full mt-4 mb-5">
              <img src={EncoreIcon} alt="Logo" className="w-auto pl-7 h-6" />
            </div>
          )}

          <Tooltip
            title={isSideBarCollapsed ? "Expand Menu" : "Minimize Menu"}
            placement="right"
          >
            <button
              className={`${
                !isSideBarCollapsed
                  ? "hidden md:flex absolute top-[80px] right-3"
                  : " mt-4 mb-2"
              } `}
              onClick={() => setIsSideBarCollapsed(!isSideBarCollapsed)}
            >
              <img
                src={isSideBarCollapsed ? ExpandIcon : CollapseIcon}
                alt="Logo"
                className="h-6"
              />
            </button>
          </Tooltip>
          <nav className="w-full md:w-auto px-14 md:px-0">
            <ul className="flex flex-row md:flex-col md:space-y-0 justify-between md:justify-normal">
              {options.map((option) => (
                <Option
                  key={option.path}
                  iconOn={option.iconOn}
                  iconOff={option.iconOff}
                  label={option.label}
                  href={option.path}
                  isCollapsed={isSideBarCollapsed}
                />
              ))}
            </ul>
          </nav>
        </div>

        <main
          className={`flex-1 h-screen md:h-auto py-8 transition-all duration-300 ease-in-out
              ${isDarkBackground ? "bg-greys-100" : "bg-neutrals-white"}
              ${isSideBarCollapsed ? "md:pl-20" : "md:pl-52"}
              overflow-y-auto md:overflow-y-hidden`}
        >
          {title && (
            <h1
              className="hidden md:flex h-20 text-3xl font-medium px-8 text-primaryMariner-900 fixed w-full 
              pt-10 pb-14 bg-neutrals-white border-y border-greys-300 z-30 font-figtree"
            >
              {title}
            </h1>
          )}
          <div
            className={clsx("content-dashboard", { "pt-6 md:pt-24": title })}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
