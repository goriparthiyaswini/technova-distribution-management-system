import bcrypt from "bcryptjs";
import { prisma } from "../../config/db";
import { Role } from "@prisma/client";

export async function listUsers() {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createUser(data: { name: string; email: string; password: string; role: Role }) {
  const password = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({ data: { ...data, password } });
  const { password: _pw, ...safeUser } = user;
  return safeUser;
}

export async function deleteUser(id: string) {
  await prisma.user.delete({ where: { id } });
}