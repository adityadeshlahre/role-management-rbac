import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../../services/axios";

export const useLogin = () => {
  const mutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await api.post("/login", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Login successful");
    },
    onError: (error) => {
      toast.error(
        `Login failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    },
  });

  return {
    login: mutation.mutate,
    isLoading: mutation.isPending,
  };
};
