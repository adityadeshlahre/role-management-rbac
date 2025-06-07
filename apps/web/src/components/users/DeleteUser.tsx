import { useNavigate, useParams } from "react-router-dom";
import { useUserByIdQuery } from "../../hooks/queries/useUsersQuery";
import { useDeleteUserMutation } from "../../hooks/mutations/useUsersMutation";

export const DeleteUser = () => {
  const { userId } = useParams<{ userId: string }>();
  if (!userId) {
    return <div className="text-red-500">Role ID is required</div>;
  }

  const { data: userData } = useUserByIdQuery(userId);
  const { mutate, isPending } = useDeleteUserMutation();
  const navigate = useNavigate();

  if (!userData || userData?.length === 0) {
    return <div className="text-center mt-8">Loading user...</div>;
  }

  const createdAt = new Date(userData[0].createdAt).toLocaleString();

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-center">Deleting user...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Delete User</h1>
        <div className="mb-4 space-y-1">
          <p>
            <strong>Name:</strong> {userData[0].name}
          </p>
          <p>
            <strong>Email:</strong> {userData[0].email}
          </p>
          <p>
            <strong>Role:</strong> {userData[0].role?.name}
          </p>
          <p>
            <strong>Created At:</strong> {createdAt}
          </p>
        </div>
        <p className="mb-4">Are you sure you want to delete this user?</p>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={() =>
            mutate(userId, {
              onSuccess: () => navigate("/"),
            })
          }
        >
          Confirm Delete
        </button>
      </div>
    </div>
  );
};
