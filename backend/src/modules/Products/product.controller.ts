import { Request, Response } from "express";
import { z } from "zod";
import * as productService from "./product.service";

const schema = z.object({
  name: z.string().min(1), sku: z.string().min(1), category: z.string().optional(),
  price: z.number().positive(), minStock: z.number().int().nonnegative().optional(), warehouse: z.string().optional(),
});

export async function getProducts(req: Request, res: Response) {
  res.status(200).json(await productService.listProducts(req.query.search as string));
}

export async function getProduct(req: Request, res: Response) {
  try { res.status(200).json(await productService.getProductById(req.params.id as string)); }
  catch (err: any) { res.status(err.status || 500).json({ message: err.message }); }
}

export async function createProduct(req: Request, res: Response) {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten() });
  try { res.status(201).json(await productService.createProduct(parsed.data)); }
  catch (err: any) {
    if (err.code === "P2002") return res.status(409).json({ message: "SKU already exists" });
    res.status(500).json({ message: "Failed to create product" });
  }
}

export async function updateProduct(req: Request, res: Response) {
  const parsed = schema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten() });
  try { res.status(200).json(await productService.updateProduct(req.params.id as string, parsed.data)); }
  catch (err: any) { res.status(err.status || 500).json({ message: err.message }); }
}

export async function deleteProduct(req: Request, res: Response) {
  try { await productService.deleteProduct(req.params.id as string ); res.status(204).send(); }
  catch (err: any) { res.status(err.status || 500).json({ message: err.message }); }
}