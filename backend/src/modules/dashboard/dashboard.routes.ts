import { Router, Request, Response } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { prisma } from "../../config/db";
import { getLowStockProducts } from "../products/product.service";

const router = Router();
router.use(authenticate);

router.get("/summary", async (_req: Request, res: Response) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [totalCustomers, allProducts, lowStock, todaysChallans] = await Promise.all([
    prisma.customer.count(),
    prisma.product.findMany(),
    getLowStockProducts(),
    prisma.challan.findMany({ where: { createdAt: { gte: startOfToday } } }),
  ]);

  const totalInventoryValue = allProducts.reduce((sum, p) => sum + p.stock * Number(p.price), 0);

  res.status(200).json({
    totalCustomers,
    totalProducts: allProducts.length,
    lowStock: lowStock.length,
    todaysChallans: todaysChallans.length,
    totalInventoryValue,
  });
});

export default router;