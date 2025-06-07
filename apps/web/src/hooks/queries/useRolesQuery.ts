import { useQuery } from "@tanstack/react-query";
import { getRoles } from "../../services/roleService";

export const useRolesQuery = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
