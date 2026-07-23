import { Request, Response } from "express";
import { z } from "zod";
import * as userService from "./user.service";

const createSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"]),
});

export async function getUsers(_req: Request, res: Response) {
  res.status(200).json(await userService.listUsers());
}

export async function createUser(req: Request, res: Response) {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten() });
  try {
    res.status(201).json(await userService.createUser(parsed.data));
  } catch (err: any) {
    if (err.code === "P2002") return res.status(409).json({ message: "Email already exists" });
    res.status(500).json({ message: "Failed to create user" });
  }
}

export async function deleteUser(req: Request, res: Response) {
  await userService.deleteUser(req.params.id as string as string);
  res.status(204).send();
}
