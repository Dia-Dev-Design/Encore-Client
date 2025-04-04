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
import AdminLogin from "./pages/Login/AdminLogin";
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
import { DissolutionMapView } from "pages/UserDashboard/DissolutionMapView";
import { AiChatbotView } from "pages/UserDashboard/AiChatbotView";
import CompanyDetail from "pages/AdminDashboard/clients/company/CompanyDetail";
import { appRoute } from "consts/routes.const";
import { ClientDashboardView } from "pages/UserDashboard/ClientDashboardView";
import DissolutionRoadmap from "pages/AdminDashboard/clients/dissolutionRoadmap/DissolutionRoadmap";
import { DocHubView } from "pages/UserDashboard/DocHubView";
import { AdminDocHubView } from "pages/AdminDashboard/DocHubAdmin";
import { AuthProvider, useAuth } from "./context/auth.context";

import { SupabaseProvider } from "context/supabase.context";
import { RedirectProvider } from "context/redirect.context";


const RedirectIfLoggedIn: React.FC<{
  children: JSX.Element;
}> = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Navigate to="/" replace /> : children;
};

const AppRoutes: React.FC = () => {
  const { isLoggedIn, isLoading, user, isAdmin } = useAuth();
  const [isSideBarCollapsed, setIsSideBarCollapsed] = useState<boolean>(false);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          isLoggedIn && isAdmin ? (
            <Navigate to={appRoute.admin.dashboard} replace />
          ) : !isAdmin &&
            isLoggedIn &&
            (user?.user.name === null || !user?.user.name) ? (
            <Navigate to={appRoute.clients.registerProcess} />
          ) : isLoggedIn ? (
            <Navigate to={appRoute.clients.dashboard} replace />
          ) : (
            <Navigate to={appRoute.clients.login} replace />
          )
        }
      />
      <Route
        path={appRoute.clients.login}
        element={
          <RedirectIfLoggedIn>
            <Login />
          </RedirectIfLoggedIn>
        }
      />
      <Route
        path={appRoute.clients.register}
        element={
          <RedirectIfLoggedIn>
            <Register />
          </RedirectIfLoggedIn>
        }
      />
      <Route
        path={appRoute.admin.login}
        element={
          <RedirectIfLoggedIn>
            <AdminLogin />
          </RedirectIfLoggedIn>
        }
      />
      <Route
        path={appRoute.clients.registerProcess}
        element={<RegisterWizard />}
      />
      <Route
        path={appRoute.clients.registered}
        element={<RegisterCompleted />}
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
        element={<ProtectedRoute requireAdmin={true} />}
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
        element={<ProtectedRoute requireAdmin={false} />}
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

      <Route path={appRoute.clients.dashboard} element={<ProtectedRoute />}>
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
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <RedirectProvider>
          <SupabaseProvider>
            <AppRoutes />
          </SupabaseProvider>
        </RedirectProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
