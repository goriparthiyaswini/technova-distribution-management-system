import { Request, Response } from "express";
import { z } from "zod";
import { loginUser } from "./auth.service";

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten() });
  try {
    const result = await loginUser(parsed.data);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message || "Login failed" });
  }
}
export async function me(req: Request, res: Response) {
  res.status(200).json({ user: (req as any).user });
}