import api from "../api/axios";
import type { Customer } from "../types";

export const getCustomers = (search?: string, status?: string) =>
  api.get<Customer[]>("/customers", { params: { search, status } }).then((r) => r.data);
export const createCustomer = (data: Partial<Customer>) => api.post("/customers", data);
export const updateCustomer = (id: string, data: Partial<Customer>) => api.put(`/customers/${id}`, data);
export const deleteCustomer = (id: string) => api.delete(`/customers/${id}`);