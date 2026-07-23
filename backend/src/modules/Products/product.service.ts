import { prisma } from "../../config/db";
import { Prisma } from "@prisma/client";

interface ProductInput {
  name: string; sku: string; category?: string; price: number; minStock?: number; warehouse?: string;
}

export async function listProducts(search?: string) {
  const where: Prisma.ProductWhereInput = search ? { OR: [
    { name: { contains: search, mode: "insensitive" } },
    { sku: { contains: search, mode: "insensitive" } },
    { category: { contains: search, mode: "insensitive" } },
  ] } : {};
  return prisma.product.findMany({ where, orderBy: { createdAt: "desc" } });
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw { status: 404, message: "Product not found" };
  return product;
}

// Stock always starts at 0 — use the Inventory module to stock it in, so every
// unit is logged.
export async function createProduct(data: ProductInput) {
  return prisma.product.create({ data: { ...data, stock: 0 } });
}

export async function updateProduct(id: string, data: Partial<ProductInput>) {
  await getProductById(id);
  return prisma.product.update({ where: { id }, data });
}

export async function deleteProduct(id: string) {
  await getProductById(id);
  await prisma.product.delete({ where: { id } });
}

export async function getLowStockProducts() {
  const products = await prisma.product.findMany();
  return products.filter((p) => p.stock <= p.minStock);
}
