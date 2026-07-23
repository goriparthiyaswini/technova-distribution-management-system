import api from "../api/axios";
import type { User, Role } from "../types";

export const getUsers = () => api.get<User[]>("/users").then((r) => r.data);
export const createUser = (data: { name: string; email: string; password: string; role: Role }) => api.post("/users", data);
export const deleteUser = (id: string) => api.delete(`/users/${id}`);