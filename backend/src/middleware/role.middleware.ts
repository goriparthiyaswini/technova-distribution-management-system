// Factory: authorize("ADMIN","SALES") -> middleware allowing only those roles.
import { Request, Response, NextFunction } from "express";

export function authorize(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!(req as any).user) return res.status(401).json({ message: "Not authenticated" });
    if (!allowedRoles.includes((req as any).user.role)) {
      return res.status(403).json({ message: `Role '${user.role}' is not permitted to perform this action` });
    }
    next();
  };
}