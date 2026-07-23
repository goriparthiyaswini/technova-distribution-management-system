import api from "../api/axios";
import type { Product } from "../types";
export const getProducts = (search?: string) => api.get<Product[]>("/products", { params: { search } }).then((r) => r.data);
export const createProduct = (data: Partial<Product>) => api.post("/products", data);
export const updateProduct = (id: string, data: Partial<Product>) => api.put(`/products/${id}`, data);
export const deleteProduct = (id: string) => api.delete(`/products/${id}`);