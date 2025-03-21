import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.scss";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import "@fontsource/figtree";
import "@fontsource/figtree/400.css";
import "@fontsource/figtree/400-italic.css";
import RegisterWizard from "./pages/RegisterWizard/RegisterWizard";
import RegisterCompleted from "./pages/RegisterCompleted/RegisterCompleted";
import GoogleRedirectHandler from "./pages/GoogleRedirectHandler/GoogleRedirectHandler";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import Loading from "pages/Loading/Loading";
import { ClientsView as AdminClientsView } from "./pages/AdminDashboard/clients/ClientsView";
import { DashboardView as AdminDashboardView } from "./pages/AdminDashboard/DashboardView";
import {
  cleanlocalStorageWithExpiry,
  getLocalItem,
} from "helper/localStorage.helper";
import { DissolutionMapView } from "pages/UserDashboard/DissolutionMapView";
import { AiChatbotView } from "pages/UserDashboard/AiChatbotView";
import CompanyDetail from "pages/AdminDashboard/clients/company/CompanyDetail";
import { appRoute } from "consts/routes.const";
import { ClientDashboardView } from "pages/UserDashboard/ClientDashboardView";
import DissolutionRoadmap from "pages/AdminDashboard/clients/dissolutionRoadmap/DissolutionRoadmap";
import { DocHubView } from "pages/UserDashboard/DocHubView";
import { AdminDocHubView } from "pages/AdminDashboard/DocHubAdmin";

const RedirectIfLoggedIn: React.FC<{
  isAuthenticated: boolean;
  children: JSX.Element;
}> = ({ isAuthenticated, children }) => {
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  const [isSideBarCollapsed, setIsSideBarCollapsed] = useState<boolean>(false);

  useEffect(() => {
    const checkAuthState = () => {
      try {
        const userLoggedIn = getLocalItem("isLoggedIn") === "true";
        const adminLoggedIn = getLocalItem("isAdminLoggedIn") === "true";
        const connectionStr = getLocalItem("connection");

        if (!connectionStr) {
          console.warn("No connection found in localStorage");
          setIsLoggedIn(false);
          setIsAdminLoggedIn(false);
          setIsLoading(false);
          return;
        }

        setIsLoggedIn(userLoggedIn);
        setIsAdminLoggedIn(adminLoggedIn);
      } catch (error) {
        console.error("Error checking auth state:", error);
        setIsLoggedIn(false);
        setIsAdminLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    cleanlocalStorageWithExpiry();
    checkAuthState();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to={appRoute.clients.dashboard} replace />
            ) : (
              <Navigate to={appRoute.clients.login} replace />
            )
          }
        />
        <Route
          path={appRoute.clients.login}
          element={
            <Login
              setIsLoggedIn={setIsLoggedIn}
              setIsAdminLoggedIn={setIsAdminLoggedIn}
            />
          }
        />
        <Route
          path={appRoute.clients.register}
          element={
            <RedirectIfLoggedIn isAuthenticated={isLoggedIn}>
              <Register />
            </RedirectIfLoggedIn>
          }
        />
        <Route
          path={appRoute.admin.login}
          element={
            <Login
              setIsAdminLoggedIn={setIsAdminLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              adminLogin
            />
          }
        />
        <Route
          path={appRoute.clients.registerProcess}
          element={<RegisterWizard />}
        />
        <Route
          path={appRoute.clients.registered}
          element={
            <RedirectIfLoggedIn isAuthenticated={isLoggedIn}>
              <RegisterCompleted setIsLoggedIn={setIsLoggedIn} />
            </RedirectIfLoggedIn>
          }
        />
        <Route
          path={appRoute.clients.authRedirection}
          element={<GoogleRedirectHandler />}
        />
        <Route
          path={appRoute.generic.forgotPassword}
          element={<ForgotPassword />}
        />
        <Route
          path={appRoute.generic.resetPassword}
          element={<ResetPassword />}
        />

        <Route
          path={appRoute.admin.dashboard}
          element={<ProtectedRoute isAuthenticated={isAdminLoggedIn} />}
        >
          <Route
            index
            element={
              <AdminDashboardView
                isSideBarCollapsed={isSideBarCollapsed}
                setIsSideBarCollapsed={setIsSideBarCollapsed}
              />
            }
          />
          <Route path={appRoute.admin.clients}>
            <Route
              index
              element={
                <AdminClientsView
                  isSideBarCollapsed={isSideBarCollapsed}
                  setIsSideBarCollapsed={setIsSideBarCollapsed}
                />
              }
            />
            <Route
              path={`${appRoute.admin.company}/:companyId`}
              element={
                <CompanyDetail
                  isSideBarCollapsed={isSideBarCollapsed}
                  setIsSideBarCollapsed={setIsSideBarCollapsed}
                />
              }
            />
            <Route
              path={`${appRoute.admin.dissolution}/:companyId`}
              element={
                <DissolutionRoadmap
                  isSideBarCollapsed={isSideBarCollapsed}
                  setIsSideBarCollapsed={setIsSideBarCollapsed}
                />
              }
            />
          </Route>
          <Route
            path="ai-chatbot"
            element={
              <AiChatbotView
                isSideBarCollapsed={isSideBarCollapsed}
                setIsSideBarCollapsed={setIsSideBarCollapsed}
              />
            }
          />
        </Route>
        <Route
          path={appRoute.admin.docHub}
          element={<ProtectedRoute isAuthenticated={isAdminLoggedIn} />}
        >
          <Route
            index
            element={
              <AdminDocHubView
                isSideBarCollapsed={isSideBarCollapsed}
                setIsSideBarCollapsed={setIsSideBarCollapsed}
              />
            }
          />
        </Route>

        <Route
          path={appRoute.clients.dashboard}
          element={<ProtectedRoute isAuthenticated={isLoggedIn} />}
        >
          <Route
            index
            element={
              <ClientDashboardView
                isSideBarCollapsed={isSideBarCollapsed}
                setIsSideBarCollapsed={setIsSideBarCollapsed}
              />
            }
          />
          <Route
            path="dissolution"
            element={
              <DissolutionMapView
                isSideBarCollapsed={isSideBarCollapsed}
                setIsSideBarCollapsed={setIsSideBarCollapsed}
              />
            }
          />
          <Route
            path="ai-chatbot"
            element={
              <AiChatbotView
                isSideBarCollapsed={isSideBarCollapsed}
                setIsSideBarCollapsed={setIsSideBarCollapsed}
              />
            }
          />
          <Route
            path="doc-hub"
            element={
              <DocHubView
                isSideBarCollapsed={isSideBarCollapsed}
                setIsSideBarCollapsed={setIsSideBarCollapsed}
              />
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
