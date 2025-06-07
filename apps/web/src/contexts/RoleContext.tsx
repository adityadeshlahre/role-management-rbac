import React, { createContext, useContext } from "react";
import { useCurrentUserQuery } from "../hooks/queries/useUsersQuery";

type RoleContextType = {
  role: string | undefined;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data } = useCurrentUserQuery();

  return (
    <RoleContext.Provider value={{ role: data?.role }}>
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
