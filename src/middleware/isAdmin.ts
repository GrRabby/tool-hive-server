import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.js";

export const isAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user && req.user.role === "admin") {
    next();
    return;
  }
  res.status(403).json({ message: "Admin access required" });
};
