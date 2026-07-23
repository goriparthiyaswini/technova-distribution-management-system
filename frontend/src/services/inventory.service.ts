import api from "../api/axios";
import type { InventoryMovement } from "../types";
export const getMovements = () => api.get<InventoryMovement[]>("/inventory").then((r) => r.data);
export const recordMovement = (data: { productId: string; quantity: number; type: "IN" | "OUT"; reason?: string }) =>
  api.post("/inventory", data);