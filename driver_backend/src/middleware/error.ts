import { Request, Response, NextFunction } from "express";
import logger from "../services/logger";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error("Unhandled error", { error: err.message, stack: err.stack, path: req.path });
  res.status(500).json({ message: "Internal server error" });
};