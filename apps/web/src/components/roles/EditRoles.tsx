import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUpdateRoleMutation } from "../../hooks/mutations/useRolesMutation";
import { useRoleByIdQuery } from "../../hooks/queries/useRolesQuery";

export const EditRoles = () => {
  const { roleId } = useParams<{ roleId: string }>();
  if (!roleId) {
    return <div className="text-red-500">Role ID is required</div>;
  }

  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState<string[]>([]);
  const [permissionInput, setPermissionInput] = useState("");

  const { mutate, isPending } = useUpdateRoleMutation();
  const { data } = useRoleByIdQuery(roleId);

  useEffect(() => {
    if (data) {
      setRoleName(data.name);
      setDescription(data.description || "");
      setPermissions(data.permission?.map((p) => p.permission.name) || []);
    }
  }, [data]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-semibold">Editing role...</div>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Edit Roles Page</h2>
        <form></form>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role Name
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter role name"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter role description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Permission (CAPS only)
          </label>
          <input
            type="text"
            value={permissionInput}
            onChange={(e) => {
              const value = e.target.value
                .toUpperCase()
                .replace(/[^A-Z_]/g, "");
              setPermissionInput(value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const trimmed = permissionInput.trim();
                if (trimmed && !permissions.includes(trimmed)) {
                  setPermissions((prev) => [...prev, trimmed]);
                  setPermissionInput("");
                }
              }
            }}
            onBlur={() => {
              const trimmed = permissionInput.trim();
              if (trimmed && !permissions.includes(trimmed)) {
                setPermissions((prev) => [...prev, trimmed]);
                setPermissionInput("");
              }
            }}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="e.g. CREATE_USER"
          />
          <div className="mt-2 text-sm text-gray-500">
            Current: {permissions.join(", ")}
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
          onClick={(e) => {
            e.preventDefault();
            mutate(
              {
                id: roleId,
                role: {
                  name: roleName,
                  description: description,
                  permissions: permissions,
                },
              },
              {
                onSuccess: () => {
                  setRoleName("");
                  setDescription("");
                  setPermissions([]);
                },
              }
            );
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};
