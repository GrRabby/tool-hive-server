import { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role?: string | null;
  image?: string | null;
}

export interface AuthRequest extends Request {
  user?: SessionUser;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      res.status(401).json({ message: "Not authorized, no session" });
      return;
    }

    req.user = session.user as SessionUser;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, session invalid" });
  }
};
