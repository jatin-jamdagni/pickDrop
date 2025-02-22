// import jwt from "jsonwebtoken";
// import { Request, Response, NextFunction } from "express";
// import logger from "../services/logger";

// interface AuthRequest extends Request {
//   driver?: { id: string };
// }

// export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): any  => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) {
//     logger.warn("No token provided", { path: req.path });
//     return res.status(401).json({ message: "No token provided" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
//     req.driver = { id: decoded.id };
//     next();
//   } catch (error) {
//     logger.error("Invalid token", { error, path: req.path });
//     res.status(401).json({ message: "Invalid token" });
//   }
// };

// // Admin-specific middleware (e.g., for portal)
// export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
//   // Add admin check logic here (e.g., role-based JWT or separate admin token)
//   next();
// };

import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import logger from "../services/logger";

interface AuthRequest extends Request {
  user?: { id: string; role?: string };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction):any=> {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    logger.warn("No token provided", { path: req.path });
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; role?: string };
    req.user = decoded;
    next();
  } catch (error) {
    logger.error("Invalid token", { error, path: req.path });
    res.status(401).json({ message: "Invalid token" });
  }
};

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  authMiddleware(req, res, () => {
    if (req.user?.role !== "admin") {
      logger.warn("Unauthorized access attempt", { userId: req.user?.id });
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  });
};