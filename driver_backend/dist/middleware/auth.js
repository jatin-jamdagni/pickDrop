"use strict";
// import jwt from "jsonwebtoken";
// import { Request, Response, NextFunction } from "express";
// import logger from "../services/logger";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = exports.authMiddleware = void 0;
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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = __importDefault(require("../services/logger"));
const authMiddleware = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        logger_1.default.warn("No token provided", { path: req.path });
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        logger_1.default.error("Invalid token", { error, path: req.path });
        res.status(401).json({ message: "Invalid token" });
    }
};
exports.authMiddleware = authMiddleware;
const adminMiddleware = (req, res, next) => {
    (0, exports.authMiddleware)(req, res, () => {
        var _a, _b;
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "admin") {
            logger_1.default.warn("Unauthorized access attempt", { userId: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id });
            return res.status(403).json({ message: "Admin access required" });
        }
        next();
    });
};
exports.adminMiddleware = adminMiddleware;
