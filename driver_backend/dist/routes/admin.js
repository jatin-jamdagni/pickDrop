"use strict";
// import express from "express";
// import { registerDriver, createRoute } from "../controllers/adminController";
// import { adminMiddleware } from "../middleware/auth";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const router = express.Router();
// router.post("/drivers", adminMiddleware, registerDriver);
// router.post("/routes", adminMiddleware, createRoute);
// export default router;
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post("/register", adminController_1.registerAdmin); // Public endpoint for first admin
router.post("/login", adminController_1.loginAdmin); // Public endpoint for admin login
router.post("/drivers", auth_1.adminMiddleware, adminController_1.registerDriver); // Protected
router.post("/routes", auth_1.adminMiddleware, adminController_1.createRoute); // Protected
exports.default = router;
