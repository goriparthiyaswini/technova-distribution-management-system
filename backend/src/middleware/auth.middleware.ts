import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.util";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    (req as any).user = verifyToken(authHeader.split(" ")[1]);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}