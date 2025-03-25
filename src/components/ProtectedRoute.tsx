import { appRoute } from "consts/routes.const";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth, isAdminUser } from "../context/auth.context";

interface ProtectedRouteProps {
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
}) => {
  const { isLoggedIn, isLoading, user } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isLoggedIn) {
    return <Navigate to={appRoute.clients.login} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
