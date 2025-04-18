import React, { useState, useEffect } from "react";
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

import apiClient from "api/client.config";
import { unwrapAxiosResponse } from "api/client.config";

import { useSupabase } from "context/supabase.contest";
import { RealtimeChannel } from "@supabase/supabase-js";


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

  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const [featureSubject, setFeatureSubject] = useState("");
  const [featureMessage, setFeatureMessage] = useState("");
  const [featureSubmitted, setFeatureSubmitted] = useState(false);

  const [feedbackSubject, setFeedbackSubject] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");

  useEffect(() => {
    if (isBugModalOpen || isFeatureModalOpen || isFeedbackModalOpen) {
      const contextName = isUser === HeaderTitle.Admin ? user?.user?.name : user?.name;
      const contextEmail = isUser === HeaderTitle.Admin ? user?.user?.email : user?.email;

      setSenderName(contextName || "");
      setSenderEmail(contextEmail || "");
    }
  }, [isBugModalOpen, isFeatureModalOpen, isFeedbackModalOpen]);

  const { logOutUser } = useAuth();
  const supabase = useSupabase();

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
      hideNotifications();
    }
  };


  // const handleBugSubmit = () => {
  //   setBugSubmitted(true);
  //   setTimeout(() => {
  //     setBugSubmitted(false);
  //     setIsBugModalOpen(false);
  //     setBugSubject('')
  //     setBugMessage('')
  //   }, 4000);
  // };

  const handleBugSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await apiClient.post('/api/email/bug-report', {
        name: senderName,
        subject: bugSubject,
        message: bugMessage,
        email: senderEmail,
      });

      setBugSubmitted(true);
      setBugSubject('');
      setBugMessage('');

      setTimeout(() => {
        setBugSubmitted(false);
        setIsBugModalOpen(false);
      }, 1500);
    } catch (error) {
      console.log("Error sending bug report:", error);
      alert('Error sending bug report. Please try again.');
    }

  };

  const handleFeatureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post("/api/email/feature-request", {
        name: senderName,
        email: senderEmail,
        subject: featureSubject,
        message: featureMessage,
      });
      setFeatureSubmitted(true);
      setFeatureSubject("");
      setFeatureMessage("");
      setTimeout(() => {
        setFeatureSubmitted(false);
        setIsFeatureModalOpen(false);
      }, 1500);
    } catch (error) {
      alert("Error sending feature request.");
      console.error(error);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post("/api/email/feedback", {
        name: senderName,
        email: senderEmail,
        subject: feedbackSubject,
        message: feedbackMessage,
      });
      setFeedbackSubmitted(true);
      setFeedbackSubject("");
      setFeedbackMessage("");
      setTimeout(() => {
        setFeedbackSubmitted(false);
        setIsFeedbackModalOpen(false);
      }, 1500);
    } catch (error) {
      alert("Error sending feedback.");
      console.error(error);
    }
  };


  // useEffect(() => {
  //   console.log("Setting up update monitoring for chatType field");

  //   const channel: RealtimeChannel = supabase
  //     .channel("chat-type-updates")
  //     .on(
  //       "postgres_changes",
  //       {
  //         event: "UPDATE", // Change to UPDATE instead of INSERT
  //         schema: "public",
  //         table: "ChatThread",
  //         // filter: 'chatType=eq."CHAT_LAWYER"', // Only get updates where chatType is CHAT_LAWYER
  //       },
  //       (payload) => {
  //         console.log("Chat updated to CHAT_LAWYER:", payload);
  //         console.log("Updated chat data:", payload.new);
  //         console.log("Previous chat data:", payload.old);

  //         // Optional: Check if this was actually a change from something else to CHAT_LAWYER
  //         if (payload.old.chatType !== "CHAT_LAWYER" && payload.new.chatType === "CHAT_LAWYER") {
  //           console.log("Chat was converted to lawyer chat!");
  //           // Handle notification or state update here
  //           // setNotificationsData((previous: any) => [
  //           //   ...previous,
  //           //   payload.new as TableRecord,
  //           // ]);
  //         }
  //       }
  //     )
  //     .subscribe((status) => {
  //       console.log("Subscription status:", status);

  //       if (status === 'SUBSCRIBED') {
  //         console.log("Successfully subscribed to chatType updates");
  //       }

  //       if (status === 'CHANNEL_ERROR') {
  //         console.error("Failed to subscribe to chatType updates");
  //       }
  //     });

  //   console.log("Channel status:", channel.state);

  //   return () => {
  //     console.log("Cleaning up subscription");
  //     channel.unsubscribe();
  //   };
  // }, []);

  // if (lastNotificationCounter < 0) {
  //     setLastNotificationCounter(notificationsData?.totalUnread);
  // } else {
  //     if (lastNotificationCounter !== notificationsData?.totalUnread){
  //         setLastNotificationCounter(notificationsData?.totalUnread);
  //     }
  // }
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
              {notificationBadgeCounter && notificationBadgeCounter >= 1 && (
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
              onClick={() => setIsFeatureModalOpen(true)}
            >
              Request a Feature
            </button>

            <button
              className="w-full py-2 px-4 text-left text-primaryLinkWater-950"
              onClick={() => setIsFeedbackModalOpen(true)}
            >
              Leave Feedback
            </button>

            <button
              className="w-full py-2 px-4 text-left text-primaryMariner-950"
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
      {/* {isBugModalOpen && (
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
                  onSubmit={handleBugSubmit}
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
      )} */}
      {isBugModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-100 border border-gray-300 rounded-lg shadow-lg w-full max-w-xl mx-4 md:mx-0">
            <div className="py-4 px-6 border-b border-gray-300 flex justify-between items-center">
              <h2 className="font-figtree text-2xl text-primaryMariner-900 font-medium">
                Report a Bug
              </h2>
              <button
                type="button"
                onClick={() => setIsBugModalOpen(false)}
                className="hover:opacity-70"
              >
                <img src={BlackXImage} alt="Close" />
              </button>
            </div>

            <div className="py-4 px-6">
              {bugSubmitted ? (
                <div className="text-center py-8">
                  <h3 className="text-xl font-semibold">Thank you for reporting the bug!</h3>
                  <p className="text-gray-600">Our team will address this soon.</p>
                </div>
              ) : (
                <form onSubmit={handleBugSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-primaryMariner-900 focus:ring-primaryMariner-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-primaryMariner-900 focus:ring-primaryMariner-900"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Subject
                    </label>
                    <input
                      value={bugSubject}
                      onChange={(e) => setBugSubject(e.target.value)}
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-primaryMariner-900 focus:ring-primaryMariner-900"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={bugMessage}
                      onChange={(e) => setBugMessage(e.target.value)}
                      rows={8}
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-primaryMariner-900 focus:ring-primaryMariner-900"
                    ></textarea>
                  </div>

                  <button
                    className="w-full py-2 px-4 text-white font-semibold bg-primaryViking-800 rounded-md hover:bg-primaryMariner-900 transition-colors"
                    type="submit"
                  >
                    Submit
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
      {isFeatureModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-100 border border-gray-300 rounded-lg shadow-lg w-full max-w-xl mx-4 md:mx-0">
            <div className="py-4 px-6 border-b border-gray-300 flex justify-between items-center">
              <h2 className="font-figtree text-2xl text-primaryMariner-900 font-medium">
                Request a Feature
              </h2>
              <button onClick={() => setIsFeatureModalOpen(false)} className="hover:opacity-70">
                <img src={BlackXImage} alt="Close" />
              </button>
            </div>
            <div className="py-4 px-6">
              {featureSubmitted ? (
                <div className="text-center py-8">
                  <h3 className="text-xl font-semibold">Thank you for your suggestion!</h3>
                  <p className="text-gray-600">We appreciate your input.</p>
                </div>
              ) : (
                <form onSubmit={handleFeatureSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-primaryMariner-900 focus:ring-primaryMariner-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-primaryMariner-900 focus:ring-primaryMariner-900"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700"
                    >
                      Subject
                    </label>
                    <input
                      value={featureSubject}
                      onChange={(e) => setFeatureSubject(e.target.value)}
                      type="text"
                      required
                      className="block w-full rounded-md border border-gray-300 p-2"
                    />
                  </div>
                  <textarea
                    value={featureMessage}
                    onChange={(e) => setFeatureMessage(e.target.value)}
                    placeholder="Describe the feature"
                    rows={6}
                    required
                    className="block w-full rounded-md border border-gray-300 p-2"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 px-4 text-white font-semibold bg-primaryViking-800 rounded-md hover:bg-primaryMariner-900"
                  >
                    Submit
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
      {isFeedbackModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-100 border border-gray-300 rounded-lg shadow-lg w-full max-w-xl mx-4 md:mx-0">
            <div className="py-4 px-6 border-b border-gray-300 flex justify-between items-center">
              <h2 className="font-figtree text-2xl text-primaryMariner-900 font-medium">
                Leave Feedback
              </h2>
              <button
                type="button"
                onClick={() => setIsFeedbackModalOpen(false)}
                className="hover:opacity-70"
              >
                <img src={BlackXImage} alt="Close" />
              </button>
            </div>

            <div className="py-4 px-6">
              {feedbackSubmitted ? (
                <div className="text-center py-8">
                  <h3 className="text-xl font-semibold">Thanks for your feedback!</h3>
                  <p className="text-gray-600">We value your opinion and will use it to improve.</p>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-primaryMariner-900 focus:ring-primaryMariner-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-primaryMariner-900 focus:ring-primaryMariner-900"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700"
                    >
                      Subject
                    </label>
                    <input
                      value={feedbackSubject}
                      onChange={(e) => setFeedbackSubject(e.target.value)}
                      type="text"
                      id="feedback-subject"
                      name="subject"
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-primaryMariner-900 focus:ring-primaryMariner-900"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="feedback-message"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Message
                    </label>
                    <textarea
                      id="feedback-message"
                      name="message"
                      value={feedbackMessage}
                      onChange={(e) => setFeedbackMessage(e.target.value)}
                      rows={8}
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-primaryMariner-900 focus:ring-primaryMariner-900"
                    ></textarea>
                  </div>

                  <button
                    className="w-full py-2 px-4 text-white font-semibold bg-primaryViking-800 rounded-md hover:bg-primaryMariner-900 transition-colors"
                    type="submit"
                  >
                    Submit
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminHeader;
