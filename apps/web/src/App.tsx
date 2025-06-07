import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Form from "./pages/Form";
import ProtectedRoute from "./components/ProtectedRoutes";
import RoleManagement from "./pages/RoleManagement";

function App() {
  return (
    <>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Form />} />
            <Route
              path="/roles"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <RoleManagement />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
