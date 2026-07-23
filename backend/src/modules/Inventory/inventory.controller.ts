import { Request, Response } from "express";
import { z } from "zod";
import * as inventoryService from "./inventory.service";

const schema = z.object({
  productId: z.string().uuid(), quantity: z.number().int().positive(),
  type: z.enum(["IN", "OUT"]), reason: z.string().optional(),
});

export async function getMovements(req: Request, res: Response) {
  res.status(200).json(await inventoryService.listMovements(req.query.productId as string));
}

export async function createMovement(req: Request, res: Response) {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten() });
  try {
    res.status(201).json(await inventoryService.recordMovement({ ...parsed.data, createdBy: (req as any).user.id }));
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message || "Failed to record movement" });
  }
}
