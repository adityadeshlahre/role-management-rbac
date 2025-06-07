import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuthContext } from "./AuthContext";
import { Role } from "@repo/types";

type RoleContextType = {
  role: Role | null;
  isAdmin: boolean;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuthContext();
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    if (user?.role) {
      setRole(user.role);
    }
  }, [user]);

  const isAdmin = role?.name === "ADMIN";

  return (
    <RoleContext.Provider value={{ role, isAdmin }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRoleContext = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRoleContext must be used within RoleProvider");
  }
  return context;
};
