import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser, deleteUser, updateUser } from "../../services/userService";
import { CreateUser } from "@repo/types";
import toast from "react-hot-toast";

const queryClient = useQueryClient();

export const useCreateUserMutation = async (user: CreateUser) => {
  return useMutation({
    mutationFn: async () => await createUser(user),
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

export const useUpdateUserMutation = async (id: string, user: CreateUser) => {
  return useMutation({
    mutationFn: async () => await updateUser(id, user),
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

export const useDeleteUserMutation = async (id: string) => {
  return useMutation({
    mutationFn: async () => await deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully");
    },
    onError: (error) => {
      toast.error(
        `Error deleting user: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    },
  });
};
