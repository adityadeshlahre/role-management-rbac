import { useQuery } from "@tanstack/react-query";
import { getUserById, getUsers } from "../../services/userService";

export const useUsersQuery = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useUserByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => getUserById(id),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
