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

// export const getRoute = async (req: Request, res: Response):Promise<any> => {
//   const { driverId } = req.params;

//   try {
//     const cacheKey = `route:${driverId}`;
//     const cachedRoute = await redisClient.get(cacheKey);
//     if (cachedRoute) {
//       logger.info("Route served from cache", { driverId });
//       return res.json(JSON.parse(cachedRoute));
//     }

//     const routeRepo = AppDataSource.getRepository(Route);
//     const route = await routeRepo.findOne({
//       where: { driverId },
//       relations: ["pickupPoints", "destinations", "metadata"],
//     });
//     if (!route) {
//       logger.warn("Route not found", { driverId });
//       return res.status(404).json({ message: "Route not found" });
//     }

//     await redisClient.setEx(cacheKey, 3600, JSON.stringify(route));
//     res.json(route);
//   } catch (error) {
//     logger.error("Get route error", { error });
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const markPickupComplete = async (req: Request, res: Response):Promise<any> => {
//   const { routeId, pickupId } = req.params;

//   try {
//     const routeRepo = AppDataSource.getRepository(Route);
//     const pickupRepo = AppDataSource.getRepository(PickupPoint);

//     const route = await routeRepo.findOne({
//       where: { id: routeId },
//       relations: ["pickupPoints", "destinations"],
//     });
//     if (!route) return res.status(404).json({ message: "Route not found" });

//     const pickup = await pickupRepo.findOne({ where: { id: pickupId, route: { id: routeId } } });
//     if (!pickup) return res.status(404).json({ message: "Pickup not found" });

//     pickup.status = "completed";
//     pickup.completedAt = new Date();
//     await pickupRepo.save(pickup);

//     const allPickupsDone = route.pickupPoints.every((p) => p.status === "completed");
//     if (allPickupsDone && route.destinations.length > 0) {
//       const destRepo = AppDataSource.getRepository(Destination);
//       const firstDest = route.destinations[0];
//       firstDest.status = "unlocked";
//       await destRepo.save(firstDest);
//       io.to(route.driverId).emit("notification", {
//         message: "Proceed to your first destination",
//       });
//     }

//     await redisClient.del(`route:${route.driverId}`);
//     res.json(await routeRepo.findOne({ where: { id: routeId }, relations: ["pickupPoints", "destinations"] }));
//   } catch (error) {
//     logger.error("Mark pickup complete error", { error });
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const markReached = async (req: Request, res: Response):Promise<any> => {
//   const { routeId, destId } = req.params;

//   try {
//     const routeRepo = AppDataSource.getRepository(Route);
//     const destRepo = AppDataSource.getRepository(Destination);

//     const route = await routeRepo.findOne({ where: { id: routeId }, relations: ["destinations"] });
//     if (!route) return res.status(404).json({ message: "Route not found" });

//     const destination = await destRepo.findOne({ where: { id: destId, route: { id: routeId } } });
//     if (!destination || destination.status !== "unlocked") {
//       return res.status(400).json({ message: "Invalid destination or not unlocked" });
//     }

//     destination.status = "reached";
//     destination.reachedAt = new Date();
//     await destRepo.save(destination);

//     await redisClient.del(`route:${route.driverId}`);
//     res.json(await routeRepo.findOne({ where: { id: routeId }, relations: ["pickupPoints", "destinations"] }));
//   } catch (error) {
//     logger.error("Mark reached error", { error });
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const markDelivered = async (req: Request, res: Response):Promise<any> => {
//   const { routeId, destId } = req.params;
//   const { remarks } = req.body;

//   try {
//     const routeRepo = AppDataSource.getRepository(Route);
//     const destRepo = AppDataSource.getRepository(Destination);
//     const driverRepo = AppDataSource.getRepository(Driver);
//     const locationRepo = AppDataSource.getRepository(DriverLocation);
//     const metadataRepo = AppDataSource.getRepository(RouteMetadata);

//     const route = await routeRepo.findOne({
//       where: { id: routeId },
//       relations: ["pickupPoints", "destinations"],
//     });
//     if (!route) return res.status(404).json({ message: "Route not found" });

//     const destination = await destRepo.findOne({ where: { id: destId, route: { id: routeId } } });
//     if (!destination || destination.status !== "reached") {
//       return res.status(400).json({ message: "Invalid destination or not reached" });
//     }

//     destination.status = "delivered";
//     destination.deliveredAt = new Date();
//     destination.remarks = remarks;
//     await destRepo.save(destination);

//     const currentIndex = route.destinations.findIndex((d) => d.id === destId);
//     if (currentIndex < route.destinations.length - 1) {
//       const nextDest = route.destinations[currentIndex + 1];
//       nextDest.status = "unlocked";
//       await destRepo.save(nextDest);
//       io.to(route.driverId).emit("notification", {
//         message: "Proceed to your next destination",
//       });
//     } else {
//       // All destinations delivered, generate map and metadata
//       const driver = await driverRepo.findOne({ where: { id: route.driverId } });
//       const locations = await locationRepo.find({
//         where: { driverId: route.driverId },
//         order: { timestamp: "ASC" },
//       });

//       if (driver && locations.length > 0) {
//         // Generate route map image
//         const imagePath = await generateRouteMapImage(routeId, locations, route.destinations);

//         // Calculate travel times
//         const travelTimes = locations.slice(1).map((loc, i) => ({
//           from: { lat: locations[i].lat, lng: locations[i].lng },
//           to: { lat: loc.lat, lng: loc.lng },
//           timeMinutes: (loc.timestamp.getTime() - locations[i].timestamp.getTime()) / 60000,
//         }));

//         // Save metadata
//         const metadata = metadataRepo.create({
//           routeId,
//           travelTimes,
//           driverName: driver.name,
//           vehicleNumber: driver.vehicleNumber,
//           vehicleColor: driver.vehicleColor,
//           vehicleSize: driver.vehicleSize,
//           vehicleType: driver.vehicleType,
//           imagePath,
//         });
//         await metadataRepo.save(metadata);

//         route.endTime = new Date();
//         await routeRepo.save(route);

//         logger.info("Delivery completed, metadata and image saved", { routeId, imagePath });
//       }
//     }

//     await redisClient.del(`route:${route.driverId}`);
//     res.json(await routeRepo.findOne({ where: { id: routeId }, relations: ["pickupPoints", "destinations", "metadata"] }));
//   } catch (error) {
//     logger.error("Mark delivered error", { error });
//     res.status(500).json({ message: "Server error" });
//   }
// };



import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import { Route } from "../entities/Route";
import { PickupPoint } from "../entities/PickupPoint";
import { Destination } from "../entities/Destination";
import { DriverLocation } from "../entities/DriverLocation";
import { Driver } from "../entities/Driver";
import { RouteMetadata } from "../entities/RouteMetadata";
import redisClient from "../config/redis";
import { io } from "../services/socket";
import logger from "../services/logger";
import { generateRouteMapImage } from "../services/mapGenerator";
import { calculateDistance } from "../services/googleMaps";

export const getRoute = async (req: Request, res: Response):Promise<any> => {
  const { driverId } = req.params;

  try {
    const cacheKey = `route:${driverId}`;
    const cachedRoute = await redisClient.get(cacheKey);
    if (cachedRoute) {
      logger.info("Route served from cache", { driverId });
      return res.json(JSON.parse(cachedRoute));
    }

    const routeRepo = AppDataSource.getRepository(Route);
    const route = await routeRepo.findOne({
      where: { driverId },
      relations: ["pickupPoints", "destinations", "metadata"],
    });
    if (!route) {
      logger.warn("Route not found", { driverId });
      return res.status(404).json({ message: "Route not found" });
    }

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(route));
    res.json(route);
  } catch (error) {
    logger.error("Get route error", { error });
    res.status(500).json({ message: "Server error" });
  }
};

export const markPickupComplete = async (req: Request, res: Response):Promise<any> => {
  const { routeId, pickupId } = req.params;

  try {
    const routeRepo = AppDataSource.getRepository(Route);
    const pickupRepo = AppDataSource.getRepository(PickupPoint);

    const route = await routeRepo.findOne({
      where: { id: routeId },
      relations: ["pickupPoints", "destinations"],
    });
    if (!route) return res.status(404).json({ message: "Route not found" });

    const pickup = await pickupRepo.findOne({ where: { id: pickupId, route: { id: routeId } } });
    if (!pickup) return res.status(404).json({ message: "Pickup not found" });

    pickup.status = "completed";
    pickup.completedAt = new Date();
    await pickupRepo.save(pickup);

    const allPickupsDone = route.pickupPoints.every((p) => p.status === "completed");
    if (allPickupsDone && route.destinations.length > 0) {
      const destRepo = AppDataSource.getRepository(Destination);
      const firstDest = route.destinations[0];
      firstDest.status = "unlocked";
      await destRepo.save(firstDest);
      io.to(route.driverId).emit("notification", {
        message: "Proceed to your first destination",
      });
    }

    await redisClient.del(`route:${route.driverId}`);
    res.json(await routeRepo.findOne({ where: { id: routeId }, relations: ["pickupPoints", "destinations"] }));
  } catch (error) {
    logger.error("Mark pickup complete error", { error });
    res.status(500).json({ message: "Server error" });
  }
};



export const markReached = async (req: Request, res: Response) :Promise<any>=> {
  const { routeId, destId, pickupId } = req.params;

  try {
    const routeRepo = AppDataSource.getRepository(Route);
    const destRepo = AppDataSource.getRepository(Destination);
    const pickupRepo = AppDataSource.getRepository(PickupPoint);
    const driverRepo = AppDataSource.getRepository(Driver);

    const route = await routeRepo.findOne({
      where: { id: routeId },
      relations: ["pickupPoints", "destinations"],
    });
    if (!route) return res.status(404).json({ message: "Route not found" });

    const driver = await driverRepo.findOne({ where: { id: route.driverId } });
    if (!driver) return res.status(404).json({ message: "Driver not found" });

    const now = new Date();

    if (pickupId) {
      const pickup = await pickupRepo.findOne({ where: { id: pickupId, route: { id: routeId } } });
      if (!pickup || pickup.status !== "pending") {
        return res.status(400).json({ message: "Invalid pickup or already completed" });
      }

      const distance = await calculateDistance(
        { lat: driver.lat, lng: driver.lng },
        { lat: pickup.lat, lng: pickup.lng }
      );
      const timeToPickup = (pickup.scheduledPickupTime.getTime() - now.getTime()) / 60000; // Minutes

      if (distance > 100 || timeToPickup > 10) {
        return res.status(400).json({
          message: "Can only mark reached within 100 meters and 10 minutes before pickup time",
        });
      }

      pickup.status = "reached";
      pickup.reachedAt = now; // Now valid with the updated entity
      await pickupRepo.save(pickup);

      io.to(route.driverId).emit("notification", {
        message: "Driver has reached pickup location",
        pickupId,
        reachedAt: now,
      });
    } else if (destId) {
      const destination = await destRepo.findOne({ where: { id: destId, route: { id: routeId } } });
      if (!destination || destination.status !== "unlocked") {
        return res.status(400).json({ message: "Invalid destination or not unlocked" });
      }

      const distance = await calculateDistance(
        { lat: driver.lat, lng: driver.lng },
        { lat: destination.lat, lng: destination.lng }
      );
      if (distance > 100) {
        return res.status(400).json({ message: "Can only mark reached within 100 meters" });
      }

      destination.status = "reached";
      destination.reachedAt = now;
      await destRepo.save(destination);

      io.to(route.driverId).emit("notification", {
        message: "Driver has reached destination",
        destinationId: destId,
        reachedAt: now,
      });
    } else {
      return res.status(400).json({ message: "Must specify pickupId or destId" });
    }

    await redisClient.del(`route:${route.driverId}`);
    res.json(await routeRepo.findOne({ where: { id: routeId }, relations: ["pickupPoints", "destinations"] }));
  } catch (error) {
    logger.error("Mark reached error", { error });
    res.status(500).json({ message: "Server error" });
  }
};

export const markDelivered = async (req: Request, res: Response):Promise<any> => {
  const { routeId, destId } = req.params;
  const { remarks } = req.body;

  try {
    const routeRepo = AppDataSource.getRepository(Route);
    const destRepo = AppDataSource.getRepository(Destination);
    const driverRepo = AppDataSource.getRepository(Driver);
    const locationRepo = AppDataSource.getRepository(DriverLocation);
    const metadataRepo = AppDataSource.getRepository(RouteMetadata);

    const route = await routeRepo.findOne({
      where: { id: routeId },
      relations: ["pickupPoints", "destinations"],
    });
    if (!route) return res.status(404).json({ message: "Route not found" });

    const destination = await destRepo.findOne({ where: { id: destId, route: { id: routeId } } });
    if (!destination || destination.status !== "reached") {
      return res.status(400).json({ message: "Invalid destination or not reached" });
    }

    destination.status = "delivered";
    destination.deliveredAt = new Date();
    destination.remarks = remarks;
    await destRepo.save(destination);

    const currentIndex = route.destinations.findIndex((d) => d.id === destId);
    if (currentIndex < route.destinations.length - 1) {
      const nextDest = route.destinations[currentIndex + 1];
      const allPreviousDelivered = route.destinations
        .slice(0, currentIndex + 1)
        .every((d) => d.status === "delivered");
      if (allPreviousDelivered) {
        nextDest.status = "unlocked";
        await destRepo.save(nextDest);
        io.to(route.driverId).emit("notification", {
          message: "Proceed to your next destination",
        });
      }
    } else {
      const driver = await driverRepo.findOne({ where: { id: route.driverId } });
      const locations = await locationRepo.find({
        where: { driverId: route.driverId },
        order: { timestamp: "ASC" },
      });

      if (driver && locations.length > 0) {
        const imagePath = await generateRouteMapImage(routeId, locations, route.destinations);
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
        await metadataRepo.save(metadata);

        route.endTime = new Date();
        await routeRepo.save(route);

        logger.info("Delivery completed, metadata and image saved", { routeId, imagePath });
      }
    }

    await redisClient.del(`route:${route.driverId}`);
    res.json(await routeRepo.findOne({ where: { id: routeId }, relations: ["pickupPoints", "destinations", "metadata"] }));
  } catch (error) {
    logger.error("Mark delivered error", { error });
    res.status(500).json({ message: "Server error" });
  }
};