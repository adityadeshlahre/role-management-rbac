import { useQuery } from "@tanstack/react-query";
import {
  getCurrentUser,
  getUserById,
  getUsers,
} from "../../services/userService";

export const useCurrentUserQuery = () => {
  const token = localStorage.getItem("token");
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: () => getCurrentUser(),
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useUsersQuery = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
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
