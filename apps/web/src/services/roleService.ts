import { CreateRole } from "@repo/types";
import api from "./axios";

export const getRoles = async () => {
  const { data } = await api.get("/roles");
  return data;
};

export const createRole = async (role: CreateRole) => {
  const { data } = await api.post("/roles", role);
  return data;
};

export const updateRole = async (id: string, role: any) => {
  const { data } = await api.put(`/roles/${id}`, role);
  return data;
};

export const deleteRole = async (id: string) => {
  const { data } = await api.delete(`/roles/${id}`);
  return data;
};
