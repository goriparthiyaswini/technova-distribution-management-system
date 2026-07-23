import bcrypt from "bcryptjs";
import { prisma } from "../../config/db";
import { signToken } from "../../utils/jwt.util";

export async function loginUser({ email, password }: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw { status: 401, message: "Invalid email or password" };

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw { status: 401, message: "Invalid email or password" };

  const token = signToken({ id: user.id, role: user.role, email: user.email });
  const { password: _pw, ...safeUser } = user;
  return { token, user: safeUser };
}