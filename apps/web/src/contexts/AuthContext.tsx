import React, { useEffect } from "react";
import { useLogin } from "../hooks/mutations/useLogin";
import toast from "react-hot-toast";

type AuthContextType = {
  isAuthenticated: boolean;
  authChecked: boolean;
  isLoading: boolean;
  isError: boolean;
  loginUser: (email: string, password: string) => void;
  logoutUser: () => void;
};

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authChecked, setAuthChecked] = React.useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);
  const [isError, setIsError] = React.useState<boolean>(false);

  const { login, isLoading } = useLogin();

  const loginUser = (email: string, password: string) => {
    login(
      { email, password },
      {
        onSuccess: (data) => {
          localStorage.setItem("token", data.token);
          setIsAuthenticated(true);
        },
        onError: () => {
          setIsError(true);
          setIsAuthenticated(false);
          setAuthChecked(false);
        },
      }
    );
  };

  const logoutUser = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
    setAuthChecked(true);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        authChecked,
        isLoading,
        isError,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
