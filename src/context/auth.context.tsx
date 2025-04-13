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
    isActivated: boolean;
    registered: boolean;
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
  storeToken: (token: string, isAdmin: boolean) => void;
  authenticateUser: () => Promise<void>;
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

  // Store token in localStorage
  const storeToken = (token: string, isAdmin: boolean = false): void => {
    try {
      if (!token) {
        console.error("Attempted to store empty token");
        return;
      }
      
      localStorage.setItem("authToken", token);
      localStorage.setItem("isAdmin", String(isAdmin));
      console.log("Token stored successfully:", { token: token.substring(0, 10) + "...", isAdmin });
    } catch (error) {
      console.error("Error storing token:", error);
    }
  };

  // Remove token from localStorage
  const removeToken = (): void => {
    try {
      localStorage.removeItem("authToken");
      localStorage.removeItem("isAdmin");
      console.log("Token removed successfully");
    } catch (error) {
      console.error("Error removing token:", error);
    }
  };

  // Logout user
  const logOutUser = (): void => {
    removeToken();
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUser(null);
    navigate("/login");
  };

  // Authenticate user
  const authenticateUser = async (): Promise<void> => {
    try {
      const storedToken = localStorage.getItem("authToken");
      const storedIsAdmin = localStorage.getItem("isAdmin");
      
      console.log("Debug - stored token:", storedToken ? storedToken.substring(0, 10) + "..." : null);
      console.log("Debug - stored isAdmin:", storedIsAdmin);
      
      // If no token exists, user is not authenticated
      if (!storedToken) {
        console.log("No token found, user not authenticated");
        setIsLoggedIn(false);
        setIsLoading(false);
        setUser(null);
        return;
      }

      const isAdminUser = storedIsAdmin === "true";
      
      try {
        // Choose appropriate endpoint based on user type
        const endpoint = isAdminUser ? "api/auth/admin/me" : "api/auth/me";
        console.log(`Attempting to authenticate with endpoint: ${endpoint}`);
        
        const response = await get(endpoint);
        const data = response.data;
        
        if (isAdminUser) {
          const adminUser: AdminUser = {
            accessToken: data.accessToken || storedToken,
            isAdmin: true,
            user: data.user,
          };
          
          setUser(adminUser);
          setIsAdmin(true);
          console.log("Admin user authenticated:", adminUser);
        } else {
          const regularUser: RegularUser = {
            accessToken: data.accessToken || storedToken,
            isAdmin: data.isAdmin || false,
            user: data,
            hasRegisteredCompanies: data.hasRegisteredCompanies,
            companies: data.companies,
          };
          
          setUser(regularUser);
          setIsAdmin(false);
          console.log("Regular user authenticated:", regularUser);
        }
        
        setIsLoggedIn(true);
        
        // Update token in storage if a new one was returned
        if (data.accessToken && data.accessToken !== storedToken) {
          storeToken(data.accessToken, isAdminUser);
        }
      } catch (error: any) {
        console.error(`Authentication failed with ${isAdminUser ? 'admin' : 'regular'} endpoint:`, error);
        
        // If we get 401 Unauthorized, clear auth data
        if (error.response && error.response.status === 401) {
          removeToken();
          setIsLoggedIn(false);
          setUser(null);
          setIsAdmin(false);
        }
      }
    } catch (error) {
      console.error("Error in authenticateUser:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize authentication on component mount
  useEffect(() => {
    console.log("AuthProvider mounted, authenticating user...");
    authenticateUser();
  }, []);

  // Log user state changes
  useEffect(() => {
    if (user) {
      console.log("User state updated:", {
        id: user.user.id,
        name: user.user.name,
        isAdmin: user.isAdmin
      });
    } else {
      console.log("User state cleared");
    }
  }, [user]);

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
