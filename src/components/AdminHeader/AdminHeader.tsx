import React, { useState } from "react";
import { Tooltip } from "antd";
import NotificationIcon from "assets/icons/notificationsIcon.svg";
import DarkNotificationIcon from "assets/icons/DarkNotificationsIcon.svg";
import GenericAvatarImage from "assets/icons/GenericAvatar.svg";
import DarkGenericAvatarImage from "assets/icons/DarkGenericAvatar.svg";
import EncoreLogoImage from "assets/images/EncoreLogo2.svg";
import EncoreMobileLogoImage from "assets/images/EncoreLogo.svg";
import BlackXImage from "assets/icons/BlackX.svg";
import { ClientDataReceived } from "interfaces/dashboard/clientDataReceived.interface";
import { HeaderTitle } from "interfaces/dashboard/headerTitle.enum";
import { useAuth } from "context/auth.context";

interface AdminHeaderProps {
  isUser: HeaderTitle;
  user: ClientDataReceived;
  notificationBadgeCounter?: number;
  hideNotifications?: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  isUser,
  user,
  notificationBadgeCounter,
  hideNotifications,
}) => {
  const [isProfileMenuCollapsed, setIsProfileMenuCollapsed] = useState(false);
  const [isBugModalOpen, setIsBugModalOpen] = useState(false);
  const [bugSubject, setBugSubject] = useState("");
  const [bugMessage, setBugMessage] = useState("");
  const [bugSubmitted, setBugSubmitted] = useState(false);
  const { logOutUser } = useAuth();

  const handleLogout = () => {
    logOutUser();
  };

  const handleNotifications = () => {
    if (
      isUser === HeaderTitle.Admin &&
      notificationBadgeCounter &&
      notificationBadgeCounter > 0 &&
      hideNotifications
    ) {
      // hideNotifications();
    }
  };

  const handleBugSubmit = () => {
    setBugSubmitted(true);
    setTimeout(() => {
      setBugSubmitted(false);
      setIsBugModalOpen(false);
      setBugSubject('')
      setBugMessage('')
    }, 4000);
  };

  return (
    <>
      <header
        className="flex justify-between items-center h-14 fixed w-screen z-50 md:p-4
                bg-primaryMariner-50 md:bg-primaryViking-800"
      >
        <img
          src={EncoreLogoImage}
          alt="Encore Logo"
          className="pl-4 py-4 hidden md:flex"
        />
        <img
          src={EncoreMobileLogoImage}
          alt="Encore Logo"
          className="pl-4 py-4 md:hidden"
        />
        <div className="flex items-center space-x-4">
          <Tooltip title="Notifications">
            <button className="relative" onClick={handleNotifications}>
              {typeof notificationBadgeCounter === 'number' && notificationBadgeCounter > 0 && (
                <p className="w-4 h-4 text-xs text-neutrals-white bg-statesRed-red rounded-xl text-center absolute bottom-4 left-3">
                  {notificationBadgeCounter < 9 ? notificationBadgeCounter : 9}
                </p>
              )}
              <img
                src={NotificationIcon}
                alt="Notifications"
                className="w-6 h-6 hidden md:flex"
              />
              <img
                src={DarkNotificationIcon}
                alt="Notifications"
                className="w-fit h-5 md:hidden"
              />
            </button>
          </Tooltip>

          <div className="flex items-center space-x-2 pr-1 md:pr-6">
            <span className="text-base font-medium font-figtree text-neutrals-black md:text-neutrals-white">
              {user && user.name
                ? user.name
                : user && user.user && user.user.name
                ? user.user.name
                : "User"}
            </span>
            <button
              className="w-10 h-10 rounded-full overflow-hidden"
              onClick={() => setIsProfileMenuCollapsed(!isProfileMenuCollapsed)}
            >
              <img
                src={GenericAvatarImage}
                alt="User Avatar"
                className="w-full h-full object-cover hidden md:flex"
              />
              <img
                src={DarkGenericAvatarImage}
                alt="User Avatar"
                className="w-full h-full object-cover md:hidden"
              />
            </button>
          </div>
        </div>
      </header>
      {isProfileMenuCollapsed && (
        <div className="absolute top-14 right-0 w-1/4 bg-neutrals-white border border-greys-300 z-40 h-4/5 flex flex-col">
          <div className="border border-greys-300 py-2 px-4 h-1/4 flex flex-col items-center justify-center gap-1">
            <img
              src={GenericAvatarImage}
              alt="User Avatar"
              className="w-fit h-16 object-cover"
            />
            <p className="font-figtree text-2xl text-primaryMariner-900 font-medium">
              {user && user.name
                ? user.name
                : user && user.user && user.user.name
                ? user.user.name
                : "User"}
            </p>
            <p className="font-figtree text-sm text-primaryMariner-900 font-medium">
              {user.email}
            </p>
          </div>
          <div className="border border-greys-300 py-2 px-4 h-3/4">
            {/* <button className="w-full py-2 px-4 text-left text-primaryLinkWater-950 bg-primaryLinkWater-50">
              Change profile picture
            </button> */}
            <button
              className="w-full py-2 px-4 text-left text-primaryLinkWater-950"
              onClick={() => setIsBugModalOpen(true)}
            >
              Report a Bug
            </button>
            <button
              className="w-full py-2 px-4 text-left text-primaryLinkWater-950"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
          <button
            className="absolute right-4 top-4"
            onClick={() => setIsProfileMenuCollapsed(!isProfileMenuCollapsed)}
          >
            <img src={BlackXImage} alt="Close" />
          </button>
        </div>
      )}
      {isBugModalOpen && (
        <div className="absolute top-20 right-20 w-1/4 bg-gray-100 border border-greys-300 z-40 h-4/4 flex flex-col">
          <div className="border border-greys-300 py-2 px-4 h-1/4 flex flex-col items-center justify-center gap-1">
            <p className="font-figtree text-2xl text-primaryMariner-900 font-medium">
              {user && user.name
                ? user.name
                : user && user.user && user.user.name
                ? user.user.name
                : "User"}
            </p>
            <br />
            <hr />
            {!bugSubmitted && (
              <p className="font-figtree text-sm text-primaryMariner-900 font-medium">
                Please help us with a description of your bug.
              </p>
            )}
          </div>
          <div className="border border-greys-300 py-2 px-4 h-3/4 flex flex-col items-center justify-center w-[100%]">
            <>
              {bugSubmitted ? (
                <div className="bg-white shadow-md rounded text-center px-8 pt-6 pb-8 mb-4 h-3/4 w-[100%] max-w-md mx-auto mt-3">
                  <h2>Thank you for reporting the bug</h2>
                  <p>Our team will be addressing this soon!</p>
                </div>
              ) : (
                <form
                  onSubmit={() => handleBugSubmit()}
                  className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-[100%] max-w-md mx-auto mt-3"
                >
                  <div>
                    <label htmlFor="subject">Subject</label>
                    <br />

                    <input
                      value={bugSubject}
                      onChange={(e) => setBugSubject(e.target.value)}
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      className="mt-1 p-2 block w-full rounded-md border outline-none border-gray-300 focus:primaryMariner-900 focus:ring-1 focus:ring-primaryMariner-900"
                    />
                  </div>

                  <div>
                    <label htmlFor="message">Message:</label>
                    <br />

                    <textarea
                      id="message"
                      name="message"
                      value={bugMessage}
                      onChange={(e) => setBugMessage(e.target.value)}
                      rows={12}
                      required
                      className="mt-1 p-2 block w-full rounded-md border outline-none border-gray-300 focus:primaryMariner-900 focus:ring-1 focus:ring-primaryMariner-900"
                    ></textarea>
                  </div>
                  <button
                    className="w-full py-3 px-4 text-white font-semibold bg-primaryViking-800 rounded-md focus:outline-none focus:bg-indigo-600 hover:bg-primaryMariner-900"
                    type="submit"
                  >
                    Submit
                  </button>
                </form>
              )}
            </>
          </div>
          <button
            type="button"
            className="absolute right-4 top-4"
            onClick={() => setIsBugModalOpen(false)}
          >
            <img src={BlackXImage} alt="Close" />
          </button>
        </div>
      )}
    </>
  );
};

export default AdminHeader;
