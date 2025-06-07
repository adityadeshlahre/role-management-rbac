import { useNavigate, useParams } from "react-router-dom";
import { useUserByIdQuery } from "../../hooks/queries/useUsersQuery";
import { useUpdateUserMutation } from "../../hooks/mutations/useUsersMutation";
import { useEffect, useState } from "react";
import { Role } from "@repo/types";
import { useRolesQuery } from "../../hooks/queries/useRolesQuery";

export const EditUser = () => {
  const { userId } = useParams<{ userId: string }>();
  if (!userId) {
    return <div className="text-red-500">User ID is required</div>;
  }

  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<number>(0);

  const { data: userData } = useUserByIdQuery(userId!);
  const { mutate, isPending } = useUpdateUserMutation();
  const { data: rolesData } = useRolesQuery();

  useEffect(() => {
    if (userData && userData.length > 0) {
      const user = userData[0];
      setName(user.name);
      setEmail(user.email);
      setRole(user.roleId || 0);
    }
  }, [userData]);

  if (isPending) {
    return <div className="text-blue-500">Updating user...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Edit User</h1>
      <div className="mb-4">
        <label className="block mb-2">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Role</label>
        <select
          value={role ?? ""}
          onChange={(e) => {
            setRole(Number(e.target.value));
          }}
          className="border p-2 rounded w-full"
        >
          <option value="">Select Role</option>
          {rolesData?.map((r: Role) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={() => {
          mutate(
            {
              id: userId,
              user: {
                name,
                email,
                password,
                roleId: role,
              },
            },
            {
              onSuccess: () => {
                navigate(`/users/edit/${userId}`);
                setName("");
                setEmail("");
                setPassword("");
                setRole(0);
              },
            }
          );
        }}
      >
        Update User
      </button>
    </div>
  );
};
