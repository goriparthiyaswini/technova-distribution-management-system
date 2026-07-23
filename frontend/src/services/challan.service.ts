import api from "../api/axios";
import type { Challan } from "../types";

export const getChallans = (status?: string) => api.get<Challan[]>("/challans", { params: { status } }).then((r) => r.data);
export const createChallan = (data: { customerId: string; items: { productId: string; qty: number }[] }) =>
  api.post("/challans", data);
export const setChallanStatus = (id: string, status: "CONFIRMED" | "CANCELLED") =>
  api.put(`/challans/${id}`, { status });