"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = __importDefault(require("../services/logger"));
const errorHandler = (err, req, res, next) => {
    logger_1.default.error("Unhandled error", { error: err.message, stack: err.stack, path: req.path });
    res.status(500).json({ message: "Internal server error" });
};
exports.errorHandler = errorHandler;
