"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routeController_1 = require("../controllers/routeController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get("/:driverId", auth_1.authMiddleware, routeController_1.getRoute);
router.patch("/:routeId/pickup/:pickupId", auth_1.authMiddleware, routeController_1.markPickupComplete);
router.patch("/:routeId/destination/:destId/reach", auth_1.authMiddleware, routeController_1.markReached);
router.patch("/:routeId/destination/:destId/deliver", auth_1.authMiddleware, routeController_1.markDelivered);
exports.default = router;
