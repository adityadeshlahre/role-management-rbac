import React, { useEffect, useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { useRoleContext } from "../contexts/RoleContext";
import { useNavigate } from "react-router-dom";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles: string[];
};

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, authChecked } = useAuthContext();
  const { role } = useRoleContext();

  const navigate = useNavigate();

  const [showChecking, setShowChecking] = useState(true);
  const [notAuthorized, setNotAuthorized] = useState(false);

  useEffect(() => {
    if (authChecked) {
      const timer = setTimeout(() => setShowChecking(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [authChecked]);

  useEffect(() => {
    if (authChecked && !isAuthenticated && !showChecking) {
      const timer = setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [authChecked, isAuthenticated, showChecking, navigate]);

  useEffect(() => {
    if (
      authChecked &&
      isAuthenticated &&
      !allowedRoles.includes(role || "") &&
      !showChecking
    ) {
      setNotAuthorized(true);
      const timer = setTimeout(() => {
        navigate("/", { replace: true });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [
    authChecked,
    isAuthenticated,
    role,
    allowedRoles,
    showChecking,
    navigate,
  ]);

  if (showChecking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        Checking authentication...
      </div>
    );
  }

  if (notAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        You are not authorized to view this page.
      </div>
    );
  }

  if (isAuthenticated && allowedRoles.includes(role || "")) {
    return <>{children}</>;
  }

  return null;
};

export default ProtectedRoute;
