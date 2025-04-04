// src/context/auth.context.tsx

import {
  useState,
  useEffect,
  createContext,
  ReactNode,
  useContext,
} from "react";
import { useNavigate } from "react-router-dom";
import { get } from "../utils/api-calls";

interface BaseUser {
  accessToken: string;
  isAdmin: boolean;
  user: {
    createdAt: string;
    email: string;
    id: string;
    isVerified: boolean;
    lastPasswordChange: string | null;
    name: string;
    password: string;
    phoneNumber: string;
    updatedAt: string;
    isAdmin: boolean;
  };
}

export interface RegularUser extends BaseUser {
  hasRegisteredCompanies?: boolean;
  companies?: any[];
}

export interface AdminUser extends BaseUser {
  isAdmin: true;
}

type User = RegularUser | AdminUser;

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  user: User | null;
  storeToken: (token: string) => void;
  authenticateUser: () => void;
  logOutUser: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
}

export function isAdminUser(user: User | null): user is AdminUser {
  return user !== null && user.isAdmin === true;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      console.log(user);
    }
  }, [user]);

  const storeToken = (token: string): void => {
    localStorage.setItem("authToken", token);
  };

  const removeToken = (): void => {
    localStorage.clear();
  };

  const logOutUser = (): void => {
    removeToken();
    setIsLoggedIn(false);
    setUser(null);
    navigate("/login");
  };

  const authenticateUser = (): void => {
    const storedToken: any = localStorage.getItem("authToken");
    const storedIsAdmin: any = localStorage.getItem("isAdmin");
    const isAdminUser = storedIsAdmin === "true";

    if (storedToken && !isAdminUser) {
      get("api/auth/me")
        .then((response) => {
          const data = response.data;

          const baseUser: RegularUser = {
            accessToken: data.accessToken,
            isAdmin: data.isAdmin || false,
            user: data,
            hasRegisteredCompanies: data.hasRegisteredCompanies,
            companies: data.companies,
          };

          setIsLoggedIn(true);
          setIsLoading(false);
          console.log("This is the baseUser", baseUser);
          setUser(baseUser);
        })
        .catch((error) => {
          removeToken();
          setIsLoggedIn(false);
          setIsLoading(false);
          setUser(null);
          console.log(error);
        });
    } else if (storedToken && isAdminUser) {
      get("api/auth/admin/me")
        .then((response) => {
          const data = response.data;

          const baseUser: AdminUser = {
            accessToken: data.accessToken,
            isAdmin: true,
            user: data.user,
          };

          setIsLoggedIn(true);
          setIsLoading(false);
          setUser(baseUser);
        })
        .catch((error) => {
          removeToken();
          setIsLoggedIn(false);
          setIsLoading(false);
          setUser(null);
          console.log(error);
        });
    } else {
      setIsLoggedIn(false);
      setIsLoading(false);
      setUser(null);
      removeToken();
    }
  };

  useEffect(() => {
    authenticateUser();
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin === "true") {
      setIsAdmin(true);
    }
  }, []);

  useEffect(() => {
    if(user){
      console.log("this is our user", user)
    }
  }, [user])
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        user,
        isAdmin,
        storeToken,
        authenticateUser,
        logOutUser,
        setIsAdmin,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext };

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
