import React from "react";
import { useCreateRoleMutation } from "../../hooks/mutations/useRolesMutation";

export const CreateRoles = () => {
  const [roleName, setRoleName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const { mutate, isPending } = useCreateRoleMutation();

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-semibold">Creating role...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <div className="text-2xl font-bold mb-4">Create Roles Page</div>
        <form>
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
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              mutate(
                {
                  name: roleName,
                  description: description,
                },
                {
                  onSuccess: () => {
                    setRoleName("");
                    setDescription("");
                  },
                }
              );
            }}
          >
            Create Role
          </button>
        </form>
      </div>
    </div>
  );
};
