import { useNavigate, useParams } from "react-router-dom";
import { useDeleteRoleMutation } from "../../hooks/mutations/useRolesMutation";
import { useRoleByIdQuery } from "../../hooks/queries/useRolesQuery";
import toast from "react-hot-toast";

export const DeleteRoles = () => {
  const { roleId } = useParams<{ roleId: string }>();
  if (!roleId) {
    return <div className="text-red-500">Role ID is required</div>;
  }

  const navigate = useNavigate();

  const { mutate, isPending } = useDeleteRoleMutation();
  const { data } = useRoleByIdQuery(roleId);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        {isPending ? (
          <div className="text-blue-500">Deleting role...</div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-4">Delete Role</h2>
            <p className="mb-4">
              Are you sure you want to delete the role:{" "}
              <span className="font-semibold">{data?.name}</span>?
            </p>
            <p className="mb-2">
              Description:{" "}
              <span className="font-semibold">{data?.description}</span>
            </p>
            {data?.permission && data?.permission?.length > 0 && (
              <div className="mb-4">
                <p className="font-semibold">Permissions:</p>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {data?.permission.map((permWrapper, index) => (
                    <li key={index}>{permWrapper.permission?.name}</li>
                  ))}
                </ul>
              </div>
            )}
            <button
              className="w-full bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition-colors"
              onClick={() =>
                mutate(roleId, {
                  onSuccess: () => {
                    toast.success("Role deleted successfully");
                    navigate("/roles");
                  },
                })
              }
            >
              Delete Role
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
