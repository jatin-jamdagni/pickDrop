"use strict";
// import { Request, Response } from "express";
// import { AppDataSource } from "../config/db";
// import { Route } from "../entities/Route";
// import { PickupPoint } from "../entities/PickupPoint";
// import { Destination } from "../entities/Destination";
// import { DriverLocation } from "../entities/DriverLocation";
// import { Driver } from "../entities/Driver";
// import { RouteMetadata } from "../entities/RouteMetadata";
// import redisClient from "../config/redis";
// import { io } from "../services/socket";
// import logger from "../services/logger";
// import { generateRouteMapImage } from "../services/mapGenerator";
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
exports.markDelivered = exports.markReached = exports.markPickupComplete = exports.getRoute = void 0;
const db_1 = require("../config/db");
const Route_1 = require("../entities/Route");
const PickupPoint_1 = require("../entities/PickupPoint");
const Destination_1 = require("../entities/Destination");
const DriverLocation_1 = require("../entities/DriverLocation");
const Driver_1 = require("../entities/Driver");
const RouteMetadata_1 = require("../entities/RouteMetadata");
const redis_1 = __importDefault(require("../config/redis"));
const socket_1 = require("../services/socket");
const logger_1 = __importDefault(require("../services/logger"));
const mapGenerator_1 = require("../services/mapGenerator");
const googleMaps_1 = require("../services/googleMaps");
const getRoute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { driverId } = req.params;
    try {
        const cacheKey = `route:${driverId}`;
        const cachedRoute = yield redis_1.default.get(cacheKey);
        if (cachedRoute) {
            logger_1.default.info("Route served from cache", { driverId });
            return res.json(JSON.parse(cachedRoute));
        }
        const routeRepo = db_1.AppDataSource.getRepository(Route_1.Route);
        const route = yield routeRepo.findOne({
            where: { driverId },
            relations: ["pickupPoints", "destinations", "metadata"],
        });
        if (!route) {
            logger_1.default.warn("Route not found", { driverId });
            return res.status(404).json({ message: "Route not found" });
        }
        yield redis_1.default.setEx(cacheKey, 3600, JSON.stringify(route));
        res.json(route);
    }
    catch (error) {
        logger_1.default.error("Get route error", { error });
        res.status(500).json({ message: "Server error" });
    }
});
exports.getRoute = getRoute;
const markPickupComplete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { routeId, pickupId } = req.params;
    try {
        const routeRepo = db_1.AppDataSource.getRepository(Route_1.Route);
        const pickupRepo = db_1.AppDataSource.getRepository(PickupPoint_1.PickupPoint);
        const route = yield routeRepo.findOne({
            where: { id: routeId },
            relations: ["pickupPoints", "destinations"],
        });
        if (!route)
            return res.status(404).json({ message: "Route not found" });
        const pickup = yield pickupRepo.findOne({ where: { id: pickupId, route: { id: routeId } } });
        if (!pickup)
            return res.status(404).json({ message: "Pickup not found" });
        pickup.status = "completed";
        pickup.completedAt = new Date();
        yield pickupRepo.save(pickup);
        const allPickupsDone = route.pickupPoints.every((p) => p.status === "completed");
        if (allPickupsDone && route.destinations.length > 0) {
            const destRepo = db_1.AppDataSource.getRepository(Destination_1.Destination);
            const firstDest = route.destinations[0];
            firstDest.status = "unlocked";
            yield destRepo.save(firstDest);
            socket_1.io.to(route.driverId).emit("notification", {
                message: "Proceed to your first destination",
            });
        }
        yield redis_1.default.del(`route:${route.driverId}`);
        res.json(yield routeRepo.findOne({ where: { id: routeId }, relations: ["pickupPoints", "destinations"] }));
    }
    catch (error) {
        logger_1.default.error("Mark pickup complete error", { error });
        res.status(500).json({ message: "Server error" });
    }
});
exports.markPickupComplete = markPickupComplete;
const markReached = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { routeId, destId, pickupId } = req.params;
    try {
        const routeRepo = db_1.AppDataSource.getRepository(Route_1.Route);
        const destRepo = db_1.AppDataSource.getRepository(Destination_1.Destination);
        const pickupRepo = db_1.AppDataSource.getRepository(PickupPoint_1.PickupPoint);
        const driverRepo = db_1.AppDataSource.getRepository(Driver_1.Driver);
        const route = yield routeRepo.findOne({
            where: { id: routeId },
            relations: ["pickupPoints", "destinations"],
        });
        if (!route)
            return res.status(404).json({ message: "Route not found" });
        const driver = yield driverRepo.findOne({ where: { id: route.driverId } });
        if (!driver)
            return res.status(404).json({ message: "Driver not found" });
        const now = new Date();
        if (pickupId) {
            const pickup = yield pickupRepo.findOne({ where: { id: pickupId, route: { id: routeId } } });
            if (!pickup || pickup.status !== "pending") {
                return res.status(400).json({ message: "Invalid pickup or already completed" });
            }
            const distance = yield (0, googleMaps_1.calculateDistance)({ lat: driver.lat, lng: driver.lng }, { lat: pickup.lat, lng: pickup.lng });
            const timeToPickup = (pickup.scheduledPickupTime.getTime() - now.getTime()) / 60000; // Minutes
            if (distance > 100 || timeToPickup > 10) {
                return res.status(400).json({
                    message: "Can only mark reached within 100 meters and 10 minutes before pickup time",
                });
            }
            pickup.status = "reached";
            pickup.reachedAt = now; // Now valid with the updated entity
            yield pickupRepo.save(pickup);
            socket_1.io.to(route.driverId).emit("notification", {
                message: "Driver has reached pickup location",
                pickupId,
                reachedAt: now,
            });
        }
        else if (destId) {
            const destination = yield destRepo.findOne({ where: { id: destId, route: { id: routeId } } });
            if (!destination || destination.status !== "unlocked") {
                return res.status(400).json({ message: "Invalid destination or not unlocked" });
            }
            const distance = yield (0, googleMaps_1.calculateDistance)({ lat: driver.lat, lng: driver.lng }, { lat: destination.lat, lng: destination.lng });
            if (distance > 100) {
                return res.status(400).json({ message: "Can only mark reached within 100 meters" });
            }
            destination.status = "reached";
            destination.reachedAt = now;
            yield destRepo.save(destination);
            socket_1.io.to(route.driverId).emit("notification", {
                message: "Driver has reached destination",
                destinationId: destId,
                reachedAt: now,
            });
        }
        else {
            return res.status(400).json({ message: "Must specify pickupId or destId" });
        }
        yield redis_1.default.del(`route:${route.driverId}`);
        res.json(yield routeRepo.findOne({ where: { id: routeId }, relations: ["pickupPoints", "destinations"] }));
    }
    catch (error) {
        logger_1.default.error("Mark reached error", { error });
        res.status(500).json({ message: "Server error" });
    }
});
exports.markReached = markReached;
const markDelivered = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { routeId, destId } = req.params;
    const { remarks } = req.body;
    try {
        const routeRepo = db_1.AppDataSource.getRepository(Route_1.Route);
        const destRepo = db_1.AppDataSource.getRepository(Destination_1.Destination);
        const driverRepo = db_1.AppDataSource.getRepository(Driver_1.Driver);
        const locationRepo = db_1.AppDataSource.getRepository(DriverLocation_1.DriverLocation);
        const metadataRepo = db_1.AppDataSource.getRepository(RouteMetadata_1.RouteMetadata);
        const route = yield routeRepo.findOne({
            where: { id: routeId },
            relations: ["pickupPoints", "destinations"],
        });
        if (!route)
            return res.status(404).json({ message: "Route not found" });
        const destination = yield destRepo.findOne({ where: { id: destId, route: { id: routeId } } });
        if (!destination || destination.status !== "reached") {
            return res.status(400).json({ message: "Invalid destination or not reached" });
        }
        destination.status = "delivered";
        destination.deliveredAt = new Date();
        destination.remarks = remarks;
        yield destRepo.save(destination);
        const currentIndex = route.destinations.findIndex((d) => d.id === destId);
        if (currentIndex < route.destinations.length - 1) {
            const nextDest = route.destinations[currentIndex + 1];
            const allPreviousDelivered = route.destinations
                .slice(0, currentIndex + 1)
                .every((d) => d.status === "delivered");
            if (allPreviousDelivered) {
                nextDest.status = "unlocked";
                yield destRepo.save(nextDest);
                socket_1.io.to(route.driverId).emit("notification", {
                    message: "Proceed to your next destination",
                });
            }
        }
        else {
            const driver = yield driverRepo.findOne({ where: { id: route.driverId } });
            const locations = yield locationRepo.find({
                where: { driverId: route.driverId },
                order: { timestamp: "ASC" },
            });
            if (driver && locations.length > 0) {
                const imagePath = yield (0, mapGenerator_1.generateRouteMapImage)(routeId, locations, route.destinations);
                const travelTimes = locations.slice(1).map((loc, i) => ({
                    from: { lat: locations[i].lat, lng: locations[i].lng },
                    to: { lat: loc.lat, lng: loc.lng },
                    timeMinutes: (loc.timestamp.getTime() - locations[i].timestamp.getTime()) / 60000,
                }));
                const metadata = metadataRepo.create({
                    routeId,
                    travelTimes,
                    driverName: driver.name,
                    vehicleNumber: driver.vehicleNumber,
                    vehicleColor: driver.vehicleColor,
                    vehicleSize: driver.vehicleSize,
                    vehicleType: driver.vehicleType,
                    imagePath,
                });
                yield metadataRepo.save(metadata);
                route.endTime = new Date();
                yield routeRepo.save(route);
                logger_1.default.info("Delivery completed, metadata and image saved", { routeId, imagePath });
            }
        }
        yield redis_1.default.del(`route:${route.driverId}`);
        res.json(yield routeRepo.findOne({ where: { id: routeId }, relations: ["pickupPoints", "destinations", "metadata"] }));
    }
    catch (error) {
        logger_1.default.error("Mark delivered error", { error });
        res.status(500).json({ message: "Server error" });
    }
});
exports.markDelivered = markDelivered;
