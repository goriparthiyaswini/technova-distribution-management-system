import { prisma } from "../../config/db";
import { recordMovement } from "../inventory/inventory.service";

interface CreateChallanInput {
  customerId: string; items: { productId: string; qty: number }[]; createdBy: string;
}

async function generateChallanNo(): Promise<string> {
  const count = await prisma.challan.count();
  return `CH-${String(count + 1).padStart(4, "0")}`;
}

export async function listChallans(status?: string) {
  return prisma.challan.findMany({
    where: status ? { status: status as any } : {},
    include: { customer: true, items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getChallanById(id: string) {
  const challan = await prisma.challan.findUnique({
    where: { id }, include: { customer: true, items: { include: { product: true } } },
  });
  if (!challan) throw { status: 404, message: "Challan not found" };
  return challan;
}

export async function createChallan({ customerId, items, createdBy }: CreateChallanInput) {
  if (!items.length) throw { status: 400, message: "A challan needs at least one product" };
  const challanNo = await generateChallanNo();
  return prisma.challan.create({
    data: { challanNo, customerId, createdBy, status: "DRAFT", items: { create: items.map((i) => ({ productId: i.productId, qty: i.qty })) } },
    include: { customer: true, items: { include: { product: true } } },
  });
}

export async function updateChallanStatus(id: string, newStatus: "CONFIRMED" | "CANCELLED", userId: string) {
  const challan = await getChallanById(id);
  if (challan.status !== "DRAFT") throw { status: 400, message: `Challan is already ${challan.status} and cannot be changed` };

  if (newStatus === "CANCELLED") {
    return prisma.challan.update({ where: { id }, data: { status: "CANCELLED" } });
  }

  return prisma.$transaction(async (tx) => {
    for (const item of challan.items) {
      await recordMovement(
        { productId: item.productId, quantity: item.qty, type: "OUT", reason: `Challan ${challan.challanNo} confirmed`, createdBy: userId },
        tx
      );
    }
    return tx.challan.update({
      where: { id }, data: { status: "CONFIRMED" },
      include: { customer: true, items: { include: { product: true } } },
    });
  });
}