import { useNavigate } from "react-router-dom";
import { useCreateUserMutation } from "../../hooks/mutations/useUsersMutation";
import { useState } from "react";
import { useRolesQuery } from "../../hooks/queries/useRolesQuery";
import { Role } from "@repo/types";

export const CreateUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState<number>(0);

  const navigate = useNavigate();
  const { mutate, isPending } = useCreateUserMutation();
  const { data: roles } = useRolesQuery();

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-center">Creating user...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Create User</h1>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter username"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Roles
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            value={roleId}
            onChange={(e) => setRoleId(Number(e.target.value))}
            required
          >
            <option value="">Select a role</option>
            {roles?.map((role: Role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
          onClick={(e) => {
            e.preventDefault();
            mutate(
              {
                name,
                email,
                password,
                roleId,
              },
              {
                onSuccess: () => {
                  setEmail("");
                  setName("");
                  setPassword("");
                  setRoleId(0);
                  navigate("/");
                },
              }
            );
          }}
        >
          Create User
        </button>
      </form>
    </div>
  );
};
