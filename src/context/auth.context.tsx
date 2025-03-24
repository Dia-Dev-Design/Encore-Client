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
  isAdmin: boolean
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
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>
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
  const [isAdmin, setIsAdmin] = useState<boolean>(false)

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

  const authenticateUser = (): void => {
    const storedToken: any = localStorage.getItem("authToken");
    console.log("This is the storedToken-------->", storedToken)
    console.log("State of is Admin", isAdmin)

    if (storedToken && !isAdmin) {
      get("api/auth/me")
        .then((response) => {
          const data = response.data;

          const baseUser: RegularUser = {
            id: data.id,
            email: data.email,
            name: data.name,
            phoneNumber: data.phoneNumber,
            lastPasswordChange: data.lastPasswordChange,
            isVerified: data.isVerified,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            accessToken: data.accessToken,
            isAdmin: data.isAdmin,
          };

          

          // if (data.isAdmin) {
          //   userData = {
          //     ...baseUser,
          //     isAdmin: true
          //   } as AdminUser;
          // } else {
          //   userData = {
          //     ...baseUser,
          //     isAdmin: false,
          //     hasRegisteredCompanies: data.hasRegisteredCompanies,
          //     companies: data.companies,
          //   } as RegularUser;
          // }

          // if (userData.hasRegisteredCompanies,
          // )

          console.log("This is the userData=======>", baseUser)

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
    } else if (storedToken && isAdmin ){

      get("api/auth/admin/me")
      .then((response) => {
        const data = response.data;

        const baseUser: AdminUser = {
          id: data.id,
          email: data.email,
          name: data.name,
          phoneNumber: data.phoneNumber,
          lastPasswordChange: data.lastPasswordChange,
          isVerified: data.isVerified,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          accessToken: data.accessToken,
          isAdmin: data.isAdmin,
        };


        
        console.log("This is the userData=======>", baseUser)

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
        setIsAdmin,
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
