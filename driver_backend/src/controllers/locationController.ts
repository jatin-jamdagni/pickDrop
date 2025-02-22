// import { Request, Response } from "express";
// import { AppDataSource } from "../config/db";
// import { Driver } from "../entities/Driver";
// import { DriverLocation } from "../entities/DriverLocation";
// import { io } from "../services/socket";
// import logger from "../services/logger";

// export const updateLocation = async (req: Request, res: Response):Promise<any> => {
//   const { driverId, lat, lng } = req.body;

//   try {
//     const driverRepo = AppDataSource.getRepository(Driver);
//     const locationRepo = AppDataSource.getRepository(DriverLocation);

//     const driver = await driverRepo.findOne({ where: { id: driverId } });
//     if (!driver) {
//       logger.warn("Driver not found", { driverId });
//       return res.status(404).json({ message: "Driver not found" });
//     }

//     driver.lat = lat;
//     driver.lng = lng;
//     await driverRepo.save(driver);

//     // Save location every 10 minutes (handled by frontend or cron job; here for demo)
//     const lastLocation = await locationRepo.findOne({
//       where: { driverId },
//       order: { timestamp: "DESC" },
//     });
//     const now = new Date();
//     if (!lastLocation || (now.getTime() - lastLocation.timestamp.getTime()) >= 10 * 60 * 1000) {
//       const newLocation = locationRepo.create({
//         driverId,
//         lat,
//         lng,
//         timestamp: now,
//       });
//       await locationRepo.save(newLocation);
//       logger.info("Driver location saved", { driverId, lat, lng });
//     }

//     io.emit("driverLocationUpdate", { driverId, lat, lng });
//     res.json({ message: "Location updated" });
//   } catch (error) {
//     logger.error("Update location error", { error });
//     res.status(500).json({ message: "Server error" });
//   }
// };


import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import { Driver } from "../entities/Driver";
import { DriverLocation } from "../entities/DriverLocation";
import { Route } from "../entities/Route";
import { io } from "../services/socket";
import logger from "../services/logger";
import { calculateDistance } from "../services/googleMaps";

export const updateLocation = async (req: Request, res: Response):Promise<any> => {
  const { driverId, lat, lng } = req.body;

  try {
    const driverRepo = AppDataSource.getRepository(Driver);
    const locationRepo = AppDataSource.getRepository(DriverLocation);
    const routeRepo = AppDataSource.getRepository(Route);

    const driver = await driverRepo.findOne({ where: { id: driverId } });
    if (!driver) {
      logger.warn("Driver not found", { driverId });
      return res.status(404).json({ message: "Driver not found" });
    }

    driver.lat = lat;
    driver.lng = lng;
    await driverRepo.save(driver);

    // Save location every 5-10 minutes
    const lastLocation = await locationRepo.findOne({
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
      await locationRepo.save(newLocation);
      logger.info("Driver location saved", { driverId, lat, lng });
    }

    // Check proximity to pickup/destination
    const route = await routeRepo.findOne({
      where: { driverId },
      relations: ["pickupPoints", "destinations"],
    });
    if (route) {
      const nextPickup = route.pickupPoints.find((p) => p.status === "pending");
      const nextDest = route.destinations.find((d) => d.status === "unlocked");

      if (nextPickup) {
        const distance = await calculateDistance({ lat, lng }, { lat: nextPickup.lat, lng: nextPickup.lng });
        const timeToPickup = (nextPickup.scheduledPickupTime.getTime() - now.getTime()) / 60000; // Minutes
        if (distance <= 100 && timeToPickup <= 15 && timeToPickup >= 10) {
          io.to(driverId).emit("notification", {
            message: "Driver is within 100 meters of pickup point",
            pickupId: nextPickup.id,
          });
          logger.info("Proximity notification sent", { driverId, pickupId: nextPickup.id });
        }
      }

      if (nextDest) {
        const distance = await calculateDistance({ lat, lng }, { lat: nextDest.lat, lng: nextDest.lng });
        if (distance <= 100) {
          io.to(driverId).emit("notification", {
            message: "Driver is within 100 meters of destination",
            destinationId: nextDest.id,
          });
          logger.info("Proximity notification sent", { driverId, destinationId: nextDest.id });
        }
      }
    }

    io.emit("driverLocationUpdate", { driverId, lat, lng });
    res.json({ message: "Location updated" });
  } catch (error) {
    logger.error("Update location error", { error });
    res.status(500).json({ message: "Server error" });
  }
};