import axios from "axios";
import { SERVER_URL } from "../utils/base";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || SERVER_URL || "https://rbac-server-x02l.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
