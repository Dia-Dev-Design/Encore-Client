import { createContext, ReactNode, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./auth.context";

interface RedirectContextType {
  checkUserActivation: () => void;
}

const RedirectContext = createContext<RedirectContextType | null>(null);

function RedirectProvider({ children }: { children: ReactNode }) {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const checkUserActivation = () => {
    if (
      user &&
      !user.isAdmin &&
      !user.user.isActivated &&
      user.hasRegisteredCompanies
    ) {
      navigate("/registered");
    } else if (
      location.pathname === "/registered" &&
      user &&
      !user.isAdmin &&
      user.user.isActivated &&
      user.hasRegisteredCompanies
    ) {
      navigate("/home");
    }
    else if (
    user &&
      !user.isAdmin &&
      !user.user.isActivated &&
      !user.hasRegisteredCompanies
    ) {
      navigate("/register-process");
    }
  };

  useEffect(() => {
    if (isLoggedIn && user) {
      checkUserActivation();
    }
  }, [user, isLoggedIn, location.pathname]);

  return (
    <RedirectContext.Provider
      value={{
        checkUserActivation,
      }}
    >
      {children}
    </RedirectContext.Provider>
  );
}

export { RedirectProvider, RedirectContext };

export function useRedirect() {
  const context = useContext(RedirectContext);
  if (context === null) {
    throw new Error("useRedirect must be used within a RedirectProvider");
  }
  return context;
}
