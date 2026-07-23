import { Router, Request, Response } from "express";
import { prisma } from "../config/db";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: "ok", server: "running", database: "connected", timestamp: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: "error", server: "running", database: "unreachable" });
  }
});

export default router;