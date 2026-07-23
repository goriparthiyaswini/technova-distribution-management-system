// Catch-all error handler — every controller that forgets a try/catch lands here.
import { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Internal server error" });
}

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ message: "Route not found" });
}