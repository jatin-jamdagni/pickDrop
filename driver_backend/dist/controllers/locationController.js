"use strict";
// import { Request, Response } from "express";
// import { AppDataSource } from "../config/db";
// import { Driver } from "../entities/Driver";
// import { DriverLocation } from "../entities/DriverLocation";
// import { io } from "../services/socket";
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
exports.updateLocation = void 0;
const db_1 = require("../config/db");
const Driver_1 = require("../entities/Driver");
const DriverLocation_1 = require("../entities/DriverLocation");
const Route_1 = require("../entities/Route");
const socket_1 = require("../services/socket");
const logger_1 = __importDefault(require("../services/logger"));
const googleMaps_1 = require("../services/googleMaps");
const updateLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { driverId, lat, lng } = req.body;
    try {
        const driverRepo = db_1.AppDataSource.getRepository(Driver_1.Driver);
        const locationRepo = db_1.AppDataSource.getRepository(DriverLocation_1.DriverLocation);
        const routeRepo = db_1.AppDataSource.getRepository(Route_1.Route);
        const driver = yield driverRepo.findOne({ where: { id: driverId } });
        if (!driver) {
            logger_1.default.warn("Driver not found", { driverId });
            return res.status(404).json({ message: "Driver not found" });
        }
        driver.lat = lat;
        driver.lng = lng;
        yield driverRepo.save(driver);
        // Save location every 5-10 minutes
        const lastLocation = yield locationRepo.findOne({
            where: { driverId },
            order: { timestamp: "DESC" },
        });
        const now = new Date();
        if (!lastLocation || (now.getTime() - lastLocation.timestamp.getTime()) >= 5 * 60 * 1000) {
            const newLocation = locationRepo.create({
                driverId,
                lat,
                lng,
                timestamp: now,
            });
            yield locationRepo.save(newLocation);
            logger_1.default.info("Driver location saved", { driverId, lat, lng });
        }
        // Check proximity to pickup/destination
        const route = yield routeRepo.findOne({
            where: { driverId },
            relations: ["pickupPoints", "destinations"],
        });
        if (route) {
            const nextPickup = route.pickupPoints.find((p) => p.status === "pending");
            const nextDest = route.destinations.find((d) => d.status === "unlocked");
            if (nextPickup) {
                const distance = yield (0, googleMaps_1.calculateDistance)({ lat, lng }, { lat: nextPickup.lat, lng: nextPickup.lng });
                const timeToPickup = (nextPickup.scheduledPickupTime.getTime() - now.getTime()) / 60000; // Minutes
                if (distance <= 100 && timeToPickup <= 15 && timeToPickup >= 10) {
                    socket_1.io.to(driverId).emit("notification", {
                        message: "Driver is within 100 meters of pickup point",
                        pickupId: nextPickup.id,
                    });
                    logger_1.default.info("Proximity notification sent", { driverId, pickupId: nextPickup.id });
                }
            }
            if (nextDest) {
                const distance = yield (0, googleMaps_1.calculateDistance)({ lat, lng }, { lat: nextDest.lat, lng: nextDest.lng });
                if (distance <= 100) {
                    socket_1.io.to(driverId).emit("notification", {
                        message: "Driver is within 100 meters of destination",
                        destinationId: nextDest.id,
                    });
                    logger_1.default.info("Proximity notification sent", { driverId, destinationId: nextDest.id });
                }
            }
        }
        socket_1.io.emit("driverLocationUpdate", { driverId, lat, lng });
        res.json({ message: "Location updated" });
    }
    catch (error) {
        logger_1.default.error("Update location error", { error });
        res.status(500).json({ message: "Server error" });
    }
});
exports.updateLocation = updateLocation;
