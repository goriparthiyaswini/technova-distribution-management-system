import { Request, Response } from "express";
import { z } from "zod";
import * as customerService from "./customer.service";

const schema = z.object({
  name: z.string().min(1), phone: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  business: z.string().optional(), gst: z.string().optional(), address: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(), notes: z.string().optional(), followUpDate: z.string().optional(),
});

export async function getCustomers(req: Request, res: Response) {
  const { search, status } = req.query;
  res.status(200).json(await customerService.listCustomers({ search: search as string, status: status as any }));
}

export async function getCustomer(req: Request, res: Response) {
  try { res.status(200).json(await customerService.getCustomerById(req.params.id as string)); }
  catch (err: any) { res.status(err.status || 500).json({ message: err.message }); }
}

export async function createCustomer(req: Request, res: Response) {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten() });
  res.status(201).json(await customerService.createCustomer(parsed.data));
}

export async function updateCustomer(req: Request, res: Response) {
  const parsed = schema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten() });
  try { res.status(200).json(await customerService.updateCustomer(req.params.id as string, parsed.data)); }
  catch (err: any) { res.status(err.status || 500).json({ message: err.message }); }
}

export async function deleteCustomer(req: Request, res: Response) {
  try { await customerService.deleteCustomer(req.params.id as string); res.status(204).send(); }
  catch (err: any) { res.status(err.status || 500).json({ message: err.message }); }
}