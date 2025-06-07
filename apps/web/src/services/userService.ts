import api from "./axios";
import { CreateUser } from "@repo/types/";

export const getCurrentUser = async () => {
  const { data } = await api.get("/me");
  return data;
};

export const getUsers = async () => {
  const { data } = await api.get(`/users`);
  return data;
};

export const getUserById = async (id: string) => {
  const { data } = await api.get(`/users/${id}`);
  return data;
};

export const createUser = async (user: CreateUser) => {
  const { data } = await api.post("/users", user);
  return data;
};

export const updateUser = async (id: string, user: CreateUser) => {
  const { data } = await api.put(`/users/${id}`, user);
  return data;
};

export const deleteUser = async (id: string) => {
  const { data } = await api.delete(`/users/${id}`);
  return data;
};
