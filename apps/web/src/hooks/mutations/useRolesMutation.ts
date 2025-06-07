import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createRole, deleteRole, updateRole } from "../../services/roleService";
import { CreateRole, UpdateRole } from "@repo/types";

export const useCreateRoleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (role: CreateRole) => await createRole(role),
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

export const useUpdateRoleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, role }: { id: string; role: UpdateRole }) =>
      await updateRole(id, role),
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

export const useDeleteRoleMutation = () => {
  return useMutation({
    mutationFn: async (id: string) => await deleteRole(id),
    onSuccess: () => {
      toast.success("Role deleted successfully");
    },
    onError: (error) => {
      toast.error(
        `Error deleting role: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    },
  });
};
