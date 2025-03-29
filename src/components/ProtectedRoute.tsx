import { appRoute } from "consts/routes.const";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth, isAdminUser } from "../context/auth.context";

interface ProtectedRouteProps {
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requireAdmin = false,
}) => {
  const { isLoggedIn, isLoading, user, isAdmin } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isLoggedIn) {
    return <Navigate to={appRoute.clients.login} />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to={appRoute.clients.dashboard} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
