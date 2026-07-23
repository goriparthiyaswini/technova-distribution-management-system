import api from "../api/axios";
import type { User } from "../types";

export async function login(email: string, password: string) {
  const { data } = await api.post<{ token: string; user: User }>("/auth/login", { email, password });
  return data;
}