import express from "express";
import {
  getRoute,
  markPickupComplete,
  markReached,
  markDelivered,
} from "../controllers/routeController";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.get("/:driverId", authMiddleware, getRoute);
router.patch("/:routeId/pickup/:pickupId", authMiddleware, markPickupComplete);
router.patch("/:routeId/destination/:destId/reach", authMiddleware, markReached);
router.patch("/:routeId/destination/:destId/deliver", authMiddleware, markDelivered);

export default router;