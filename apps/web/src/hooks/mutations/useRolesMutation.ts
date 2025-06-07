import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createRole, deleteRole, updateRole } from "../../services/roleService";
import { CreateRole } from "@repo/types";

const queryClient = useQueryClient();

export const useCreateRoleMutation = async (role: CreateRole) => {
  return useMutation({
    mutationFn: async () => await createRole(role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role created successfully");
    },
    onError: (error) => {
      toast.error(
        `Error creating role: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    },
  });
};

export const useUpdateRoleMutation = async (id: string, role: CreateRole) => {
  return useMutation({
    mutationFn: async () => await updateRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role updated successfully");
    },
    onError: (error) => {
      toast.error(
        `Error updating role: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    },
  });
};

export const useDeleteRoleMutation = async (id: string) => {
  return useMutation({
    mutationFn: async () => await deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role deleted successfully");
    },
    onError: (error) => {
      toast.error(
        `Error deleting role: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    },
  });
};
