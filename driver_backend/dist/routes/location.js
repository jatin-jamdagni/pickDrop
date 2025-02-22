"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const locationController_1 = require("../controllers/locationController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post("/update", auth_1.authMiddleware, locationController_1.updateLocation);
exports.default = router;
