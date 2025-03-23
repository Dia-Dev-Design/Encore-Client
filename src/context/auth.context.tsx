// src/context/auth.context.tsx

import { useState, useEffect, createContext, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { get } from "../utils/api-calls";

// Define the User type
interface User {
  // Add the user properties here
  // For example:
  _id?: string;
  email?: string;
  name?: string;
  // ... other user properties
}

// Define the AuthContext type
interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: User | null;
  storeToken: (token: string) => void;
  authenticateUser: () => void;
  logOutUser: () => void;
}

// Define props for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  const navigate = useNavigate();

  /* 
    Functions for handling the authentication status (isLoggedIn, isLoading, user)
    will be added here later in the next step
  */

  const storeToken = (token: string): void => {
    localStorage.setItem("authToken", token);
  };

  const removeToken = (): void => {
    localStorage.removeItem("authToken");
  };

  const authenticateUser = (): void => {
    const storedToken = localStorage.getItem("authToken");

    if (storedToken) {
      get("/auth/verify")
        .then((response) => {
          const user: User = response.data;
          setIsLoggedIn(true);
          setIsLoading(false);
          setUser(user);
        })
        .catch((error) => {
          removeToken();
          setIsLoggedIn(false);
          setIsLoading(false);
          setUser(null);
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
    navigate('/');
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