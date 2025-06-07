import { useQuery } from "@tanstack/react-query";
import { getRoleById, getRoles } from "../../services/roleService";
import { Role } from "@repo/types";

export const useRolesQuery = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useRoleByIdQuery = (roleId: string) => {
  return useQuery<Role>({
    queryKey: ["roles", roleId],
    queryFn: () => getRoleById(roleId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
