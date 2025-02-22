// import express from "express";
// import { registerDriver, createRoute } from "../controllers/adminController";
// import { adminMiddleware } from "../middleware/auth";
 
// const router = express.Router();

// router.post("/drivers", adminMiddleware, registerDriver);
// router.post("/routes", adminMiddleware, createRoute);

// export default router;
import express from "express";
import { registerDriver, createRoute, registerAdmin, loginAdmin, getDriver } from "../controllers/adminController";
import { adminMiddleware } from "../middleware/auth";

const router = express.Router();

router.post("/register", registerAdmin); // Public endpoint for first admin
router.post("/login", loginAdmin); // Public endpoint for admin login
router.post("/drivers", adminMiddleware, registerDriver); // Protected
router.get("/drivers", adminMiddleware, getDriver); // Protected

router.post("/routes", adminMiddleware, createRoute); // Protected

export default router;