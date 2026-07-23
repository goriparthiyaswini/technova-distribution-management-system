export type Role = "ADMIN" | "SALES" | "WAREHOUSE" | "ACCOUNTS";

export interface User {
  id: string; name: string; email: string; role: Role; createdAt?: string;
}
export interface Customer {
  id: string; name: string; phone: string; email?: string; business?: string;
  gst?: string; address?: string; status: "ACTIVE" | "INACTIVE"; notes?: string;
}
export interface Product {
  id: string; name: string; sku: string; category?: string; price: number;
  stock: number; minStock: number; warehouse?: string;
}
export interface InventoryMovement {
  id: string; quantity: number; type: "IN" | "OUT"; reason?: string; createdAt: string;
  product: { name: string; sku: string }; creator: { name: string };
}
export interface ChallanItem { id: string; qty: number; product: Product; }
export interface Challan {
  id: string; challanNo: string; status: "DRAFT" | "CONFIRMED" | "CANCELLED";
  createdAt: string; customer: Customer; items: ChallanItem[];
}
export interface DashboardSummary {
  totalCustomers: number; totalProducts: number; lowStock: number;
  todaysChallans: number; totalInventoryValue: number;
}