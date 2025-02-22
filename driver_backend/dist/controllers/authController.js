"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../config/db");
const Driver_1 = require("../entities/Driver");
const logger_1 = __importDefault(require("../services/logger"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { vehicleNumber, password } = req.body;
    try {
        const driverRepo = db_1.AppDataSource.getRepository(Driver_1.Driver);
        const driver = yield driverRepo.findOne({ where: { vehicleNumber } });
        if (!driver) {
            logger_1.default.warn("Driver not found", { vehicleNumber });
            return res.status(400).json({ message: "Driver not found" });
        }
        const isMatch = yield bcrypt_1.default.compare(password, driver.password);
        if (!isMatch) {
            logger_1.default.warn("Invalid credentials", { vehicleNumber });
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ id: driver.id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        logger_1.default.info("Driver logged in", { driverId: driver.id });
        res.json({ token, driverId: driver.id });
    }
    catch (error) {
        logger_1.default.error("Login error", { error });
        res.status(500).json({ message: "Server error" });
    }
});
exports.login = login;
