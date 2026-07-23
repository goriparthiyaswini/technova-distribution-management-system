import { Request, Response } from "express";
import { z } from "zod";
import * as challanService from "./challan.service";

const createSchema = z.object({
  customerId: z.string().uuid(),
  items: z.array(z.object({ productId: z.string().uuid(), qty: z.number().int().positive() })).min(1),
});
const statusSchema = z.object({ status: z.enum(["CONFIRMED", "CANCELLED"]) });

export async function getChallans(req: Request, res: Response) {
  res.status(200).json(await challanService.listChallans(req.query.status as string));
}

export async function getChallan(req: Request, res: Response) {
  try { res.status(200).json(await challanService.getChallanById(req.params.id as string)); }
  catch (err: any) { res.status(err.status || 500).json({ message: err.message }); }
}

export async function createChallan(req: Request, res: Response) {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten() });
  try { res.status(201).json(await challanService.createChallan({ ...parsed.data, createdBy: (req as any).user.id })); }
  catch (err: any) { res.status(err.status || 500).json({ message: err.message }); }
}

export async function updateChallanStatus(req: Request, res: Response) {
  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten() });
  try { res.status(200).json(await challanService.updateChallanStatus(req.params.id as string, parsed.data.status, (req as any).user.id)); }
  catch (err: any) { res.status(err.status || 500).json({ message: err.message }); }
}