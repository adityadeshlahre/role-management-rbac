import { Login, LoginSchema } from "@repo/types/";
import { useEffect, useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Form = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { loginUser, isLoading, isAuthenticated, authChecked } =
    useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = LoginSchema.safeParse({ email, password });

    if (!result.success) {
      console.error(result.error.errors);
      return;
    }

    const user: Login = result.data;

    loginUser(user.email, user.password);
  };

  useEffect(() => {
    if (authChecked && isAuthenticated) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [authChecked, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        Loading...
      </div>
    );
  }

  if (!authChecked || (authChecked && isAuthenticated)) {
    return (
      <>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <div>Checking authentication...</div>
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="flex-1 flex flex-col items-center justify-center">
        {isAuthenticated ? (
          <div className="text-green-700 mb-4">
            Welcome back! Redirecting...
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col items-center gap-4">
              <div className="text-md text-center">
                <div>
                  <code>
                    ADMIN | Email : tim@apple.com & Password : password
                  </code>
                </div>
                <div>
                  <code>
                    TEACHER | Email : jin@apple.com & Password : password
                  </code>
                </div>
                <div>
                  <code>
                    STUDENT | Email : psh@apple.com & Password : password
                  </code>
                </div>
              </div>
              <input
                className="border-2 border-neutral-900"
                type="email"
                value={email}
                placeholder="email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="border-2 border-neutral-900"
                type="password"
                value={password}
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit">Submit</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Form;
