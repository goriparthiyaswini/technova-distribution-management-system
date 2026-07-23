import { prisma } from "../../config/db";
import { InventoryType, Prisma } from "@prisma/client";

interface MovementInput {
  productId: string; quantity: number; type: InventoryType; reason?: string; createdBy: string;
}

export async function recordMovement(
  { productId, quantity, type, reason, createdBy }: MovementInput,
  tx: Prisma.TransactionClient = prisma
) {
  const product = await tx.product.findUnique({ where: { id: productId } });
  if (!product) throw { status: 404, message: "Product not found" };

  if (type === "OUT" && product.stock < quantity) {
    throw { status: 400, message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${quantity}` };
  }

  const newStock = type === "IN" ? product.stock + quantity : product.stock - quantity;

  const [, log] = await Promise.all([
    tx.product.update({ where: { id: productId }, data: { stock: newStock } }),
    tx.inventoryLog.create({ data: { productId, quantity, type, reason, createdBy } }),
  ]);
  return { newStock, log };
}

export async function listMovements(productId?: string) {
  return prisma.inventoryLog.findMany({
    where: productId ? { productId } : {},
    include: { product: true, creator: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
}