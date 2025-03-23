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
  id?: string;
  email?: string;
  name?: string;
  phoneNumber?: string;
  lastPasswordChange?: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  accessToken?: string;
}

interface RegularUser extends BaseUser {
  isAdmin: false;
  hasRegisteredCompanies?: boolean;
  companies?: any[];
}

interface AdminUser extends BaseUser {
  isAdmin: true;
}

type User = RegularUser | AdminUser;

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: User | null;
  storeToken: (token: string) => void;
  authenticateUser: () => void;
  logOutUser: () => void;
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
    localStorage.removeItem("authToken");
  };

  const authenticateUser = (): void => {
    const storedToken = localStorage.getItem("authToken");

    if (storedToken) {
      get("api/auth/me")
        .then((response) => {
          const data = response.data;

          const baseUser: BaseUser = {
            id: data.id,
            email: data.email,
            name: data.name,
            phoneNumber: data.phoneNumber,
            lastPasswordChange: data.lastPasswordChange,
            isVerified: data.isVerified,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            accessToken: data.accessToken,
          };

          let userData: User;

          if (data.isAdmin) {
            userData = {
              ...baseUser,
              isAdmin: true
            } as AdminUser;
          } else {
            userData = {
              ...baseUser,
              isAdmin: false,
              hasRegisteredCompanies: data.hasRegisteredCompanies,
              companies: data.companies,
            } as RegularUser;
          }

          setIsLoggedIn(true);
          setIsLoading(false);
          setUser(userData);
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
    }
  };

  const logOutUser = (): void => {
    removeToken();
    authenticateUser();
    navigate("/login");
  };

  useEffect(() => {
    authenticateUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        user,
        storeToken,
        authenticateUser,
        logOutUser,
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
