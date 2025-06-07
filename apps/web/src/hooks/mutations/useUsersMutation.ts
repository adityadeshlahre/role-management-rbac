import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser, deleteUser, updateUser } from "../../services/userService";
import { CreateUser, UpdateUser } from "@repo/types";
import toast from "react-hot-toast";

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user: CreateUser) => await createUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toast.error(
        `Error creating user: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    },
  });
};

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, user }: { id: string; user: UpdateUser }) =>
      await updateUser(id, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully");
    },
    onError: (error) => {
      toast.error(
        `Error updating user: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    },
  });
};

export const useDeleteUserMutation = () => {
  return useMutation({
    mutationFn: async (id: string) => await deleteUser(id),
    onSuccess: () => {
      toast.success("User deleted successfully");
    },
    onError: (error) => {
      toast.error(
        `Error deleting user: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    },
  });
};
