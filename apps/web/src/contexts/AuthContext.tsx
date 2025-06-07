import React from "react";
import { User } from "@repo/types";
import { useLogin } from "../hooks/mutations/useLogin";
import toast from "react-hot-toast";

type UserSchema = User;

type AuthContextType = {
  isAuthenticated: boolean;
  user: UserSchema | null;
  isLoading: boolean;
  isError: boolean;
  loginUser: (email: string, password: string) => void;
  logoutUser: () => void;
};

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);
  const [user, setUser] = React.useState<UserSchema | null>(null);
  const [isError, setIsError] = React.useState<boolean>(false);

  const { login, isLoading } = useLogin();

  const loginUser = (email: string, password: string) => {
    login(
      { email, password },
      {
        onSuccess: (data) => {
          setUser(data.user);
          setIsAuthenticated(true);
          localStorage.setItem("token", data.token);
        },
        onError: () => {
          setIsError(true);
          setIsAuthenticated(false);
          setUser(null);
        },
      }
    );
  };

  const logoutUser = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
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
