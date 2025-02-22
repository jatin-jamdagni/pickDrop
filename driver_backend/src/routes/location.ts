import express from "express";
import { updateLocation } from "../controllers/locationController";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.post("/update", authMiddleware, updateLocation);

export default router;