import { prisma } from "../../config/db";
import { CustomerStatus, Prisma } from "@prisma/client";

interface CustomerInput {
  name: string; phone: string; email?: string; business?: string; gst?: string;
  address?: string; status?: CustomerStatus; notes?: string; followUpDate?: string;
}

export async function listCustomers({ search, status }: { search?: string; status?: CustomerStatus }) {
  const where: Prisma.CustomerWhereInput = {
    ...(status ? { status } : {}),
    ...(search ? { OR: [
      { name: { contains: search, mode: "insensitive" } },
      { business: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ] } : {}),
  };
  return prisma.customer.findMany({ where, orderBy: { createdAt: "desc" } });
}

export async function getCustomerById(id: string) {
  const customer = await prisma.customer.findUnique({ where: { id } });
  if (!customer) throw { status: 404, message: "Customer not found" };
  return customer;
}

export async function createCustomer(data: CustomerInput) {
  return prisma.customer.create({ data: { ...data, followUpDate: data.followUpDate ? new Date(data.followUpDate) : undefined } });
}

export async function updateCustomer(id: string, data: Partial<CustomerInput>) {
  await getCustomerById(id);
  return prisma.customer.update({ where: { id }, data: { ...data, followUpDate: data.followUpDate ? new Date(data.followUpDate) : undefined } });
}

export async function deleteCustomer(id: string) {
  await getCustomerById(id);
  await prisma.customer.delete({ where: { id } });
}