import React from "react";
import { UserTable } from "../components/users/UserTable";
import { useAuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Landing: React.FC = () => {
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <UserTable />
      </div>
    </>
  );
};

export default Landing;
