import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Form from "./pages/Form";
import ProtectedRoute from "./components/ProtectedRoutes";
import RoleManagement from "./pages/RoleManagement";
import { DeleteRoles } from "./components/roles/DeleteRoles";
import { EditRoles } from "./components/roles/EditRoles";
import { CreateRoles } from "./components/roles/CreateRoles";
import { DeleteUser } from "./components/users/DeleteUser";
import { EditUser } from "./components/users/EditUser";
import { CreateUser } from "./components/users/CreateUser";

function App() {
  return (
    <>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Form />} />
            <Route
              path="/users"
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "TEACHER"]}>
                  <CreateUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/edit/:userId"
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "TEACHER"]}>
                  <EditUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/delete/:userId"
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "TEACHER"]}>
                  <DeleteUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/roles"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <RoleManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/roles/create/"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <CreateRoles />
                </ProtectedRoute>
              }
            />
            <Route
              path="/roles/edit/:roleId"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <EditRoles />
                </ProtectedRoute>
              }
            />
            <Route
              path="/roles/delete/:roleId"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <DeleteRoles />
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
