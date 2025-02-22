"use strict";
// import { Request, Response } from "express";
// import bcrypt from "bcrypt";
// import { AppDataSource } from "../config/db";
// import { Driver } from "../entities/Driver";
// import { Route } from "../entities/Route";
// import { PickupPoint } from "../entities/PickupPoint";
// import { Destination } from "../entities/Destination";
// import logger from "../services/logger";
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
exports.createRoute = exports.registerDriver = exports.loginAdmin = exports.registerAdmin = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../config/db");
const Driver_1 = require("../entities/Driver");
const Admin_1 = require("../entities/Admin");
const Route_1 = require("../entities/Route");
const PickupPoint_1 = require("../entities/PickupPoint");
const Destination_1 = require("../entities/Destination");
const logger_1 = __importDefault(require("../services/logger"));
const googleMaps_1 = require("../services/googleMaps");
const registerAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const adminRepo = db_1.AppDataSource.getRepository(Admin_1.Admin);
        const existingAdmin = yield adminRepo.findOne({ where: { username } });
        if (existingAdmin) {
            logger_1.default.warn("Admin already exists", { username });
            return res.status(400).json({ message: "Admin already exists" });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const admin = adminRepo.create({
            username,
            password: hashedPassword,
        });
        yield adminRepo.save(admin);
        logger_1.default.info("Admin registered", { adminId: admin.id });
        res.status(201).json({ message: "Admin registered", adminId: admin.id });
    }
    catch (error) {
        logger_1.default.error("Admin registration error", { error });
        res.status(500).json({ message: "Server error" });
    }
});
exports.registerAdmin = registerAdmin;
const loginAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const adminRepo = db_1.AppDataSource.getRepository(Admin_1.Admin);
        const admin = yield adminRepo.findOne({ where: { username } });
        if (!admin) {
            logger_1.default.warn("Admin not found", { username });
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isMatch = yield bcrypt_1.default.compare(password, admin.password);
        if (!isMatch) {
            logger_1.default.warn("Invalid password", { username });
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ id: admin.id, role: "admin" }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        logger_1.default.info("Admin logged in", { adminId: admin.id });
        res.json({ token, adminId: admin.id });
    }
    catch (error) {
        logger_1.default.error("Admin login error", { error });
        res.status(500).json({ message: "Server error" });
    }
});
exports.loginAdmin = loginAdmin;
const registerDriver = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { vehicleNumber, password, name, licenseNumber, panNumber, aadharNumber, vehicleColor, vehicleSize, vehicleType, } = req.body;
    try {
        const driverRepo = db_1.AppDataSource.getRepository(Driver_1.Driver);
        const existingDriver = yield driverRepo.findOne({ where: { vehicleNumber } });
        if (existingDriver) {
            logger_1.default.warn("Driver already exists", { vehicleNumber });
            return res.status(400).json({ message: "Driver already exists" });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const driver = driverRepo.create({
            vehicleNumber,
            password: hashedPassword,
            name,
            licenseNumber,
            panNumber,
            aadharNumber,
            vehicleColor,
            vehicleSize,
            vehicleType,
        });
        yield driverRepo.save(driver);
        logger_1.default.info("Driver registered", { driverId: driver.id });
        res.status(201).json({ message: "Driver registered", driverId: driver.id });
    }
    catch (error) {
        logger_1.default.error("Driver registration error", { error });
        res.status(500).json({ message: "Server error" });
    }
});
exports.registerDriver = registerDriver;
const createRoute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { driverId, pickupPoints, destinations, startTime } = req.body;
    try {
        const driverRepo = db_1.AppDataSource.getRepository(Driver_1.Driver);
        const routeRepo = db_1.AppDataSource.getRepository(Route_1.Route);
        const pickupRepo = db_1.AppDataSource.getRepository(PickupPoint_1.PickupPoint);
        const destRepo = db_1.AppDataSource.getRepository(Destination_1.Destination);
        const driver = yield driverRepo.findOne({ where: { id: driverId } });
        if (!driver) {
            logger_1.default.warn("Driver not found", { driverId });
            return res.status(404).json({ message: "Driver not found" });
        }
        const route = routeRepo.create({
            driverId,
            startTime: new Date(startTime),
        });
        const savedRoute = yield routeRepo.save(route);
        // Validate and set coordinates using Google Maps API
        const pickups = yield Promise.all(pickupPoints.map((p) => __awaiter(void 0, void 0, void 0, function* () {
            const coords = yield (0, googleMaps_1.getCoordinates)(p.address);
            return pickupRepo.create({
                route: savedRoute,
                lat: coords.lat,
                lng: coords.lng,
                address: p.address,
                scheduledPickupTime: new Date(p.scheduledPickupTime),
            });
        })));
        yield pickupRepo.save(pickups);
        const dests = yield Promise.all(destinations.map((d) => __awaiter(void 0, void 0, void 0, function* () {
            const coords = yield (0, googleMaps_1.getCoordinates)(d.address);
            return destRepo.create({
                route: savedRoute,
                lat: coords.lat,
                lng: coords.lng,
                address: d.address,
                maxTimeToReach: d.maxTimeToReach,
            });
        })));
        yield destRepo.save(dests);
        logger_1.default.info("Route created", { routeId: savedRoute.id });
        res.status(201).json({ message: "Route created", routeId: savedRoute.id });
    }
    catch (error) {
        logger_1.default.error("Route creation error", { error });
        res.status(500).json({ message: "Server error" });
    }
});
exports.createRoute = createRoute;
