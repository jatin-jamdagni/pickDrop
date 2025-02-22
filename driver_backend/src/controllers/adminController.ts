// import { Request, Response } from "express";
// import bcrypt from "bcrypt";
// import { AppDataSource } from "../config/db";
// import { Driver } from "../entities/Driver";
// import { Route } from "../entities/Route";
// import { PickupPoint } from "../entities/PickupPoint";
// import { Destination } from "../entities/Destination";
// import logger from "../services/logger";

// export const registerDriver = async (req: Request, res: Response): Promise<any> => {
//   const {
//     vehicleNumber,
//     password,
//     name,
//     licenseNumber,
//     panNumber,
//     aadharNumber,
//     vehicleColor,
//     vehicleSize,
//     vehicleType,
//   } = req.body;

//   try {
//     const driverRepo = AppDataSource.getRepository(Driver);
//     const existingDriver = await driverRepo.findOne({ where: { vehicleNumber } });
//     if (existingDriver) {
//       logger.warn("Driver already exists", { vehicleNumber });
//       return res.status(400).json({ message: "Driver already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const driver = driverRepo.create({
//       vehicleNumber,
//       password: hashedPassword,
//       name,
//       licenseNumber,
//       panNumber,
//       aadharNumber,
//       vehicleColor,
//       vehicleSize,
//       vehicleType,
//     });

//     await driverRepo.save(driver);
//     logger.info("Driver registered", { driverId: driver.id });
//     res.status(201).json({ message: "Driver registered", driverId: driver.id });
//   } catch (error) {
//     logger.error("Driver registration error", { error });
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const createRoute = async (req: Request, res: Response): Promise<any>  => {
//   const { driverId, pickupPoints, destinations, startTime } = req.body;

//   try {
//     const driverRepo = AppDataSource.getRepository(Driver);
//     const routeRepo = AppDataSource.getRepository(Route);
//     const pickupRepo = AppDataSource.getRepository(PickupPoint);
//     const destRepo = AppDataSource.getRepository(Destination);

//     const driver = await driverRepo.findOne({ where: { id: driverId } });
//     if (!driver) {
//       logger.warn("Driver not found", { driverId });
//       return res.status(404).json({ message: "Driver not found" });
//     }

//     const route = routeRepo.create({
//       driverId,
//       startTime: new Date(startTime),
//     });

//     const savedRoute = await routeRepo.save(route);

//     const pickups = pickupPoints.map((p: any) =>
//       pickupRepo.create({
//         route: savedRoute,
//         lat: p.lat,
//         lng: p.lng,
//         address: p.address,
//       })
//     );
//     await pickupRepo.save(pickups);

//     const dests = destinations.map((d: any) =>
//       destRepo.create({
//         route: savedRoute,
//         lat: d.lat,
//         lng: d.lng,
//         address: d.address,
//         maxTimeToReach: d.maxTimeToReach,
//       })
//     );
//     await destRepo.save(dests);

//     logger.info("Route created", { routeId: savedRoute.id });
//     res.status(201).json({ message: "Route created", routeId: savedRoute.id });
//   } catch (error) {
//     logger.error("Route creation error", { error });
//     res.status(500).json({ message: "Server error" });
//   }
// };

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/db";
import { Driver } from "../entities/Driver";
import { Admin } from "../entities/Admin";
import { Route } from "../entities/Route";
import { PickupPoint } from "../entities/PickupPoint";
import { Destination } from "../entities/Destination";
import logger from "../services/logger";
import { getCoordinates } from "../services/googleMaps";

export const registerAdmin = async (req: Request, res: Response):Promise<any> => {
  const { username, password } = req.body;

  try {
    const adminRepo = AppDataSource.getRepository(Admin);
    const existingAdmin = await adminRepo.findOne({ where: { username } });
    if (existingAdmin) {
      logger.warn("Admin already exists", { username });
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = adminRepo.create({
      username,
      password: hashedPassword,
    });

    await adminRepo.save(admin);
    logger.info("Admin registered", { adminId: admin.id });
    res.status(201).json({ message: "Admin registered", adminId: admin.id });
  } catch (error) {
    logger.error("Admin registration error", { error });
    res.status(500).json({ message: "Server error" });
  }
};

export const loginAdmin = async (req: Request, res: Response):Promise<any> => {
  const { username, password } = req.body;

  try {
    const adminRepo = AppDataSource.getRepository(Admin);
    const admin = await adminRepo.findOne({ where: { username } });
    if (!admin) {
      logger.warn("Admin not found", { username });
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      logger.warn("Invalid password", { username });
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin.id, role: "admin" }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    logger.info("Admin logged in", { adminId: admin.id });
    res.json({ token, adminId: admin.id });
  } catch (error) {
    logger.error("Admin login error", { error });
    res.status(500).json({ message: "Server error" });
  }
};

export const registerDriver = async (req: Request, res: Response):Promise<any> => {
  const {
    vehicleNumber,
    password,
    name,
    licenseNumber,
    panNumber,
    aadharNumber,
    vehicleColor,
    vehicleSize,
    vehicleType,
  } = req.body;

  try {
    const driverRepo = AppDataSource.getRepository(Driver);
    const existingDriver = await driverRepo.findOne({ where: { vehicleNumber } });
    if (existingDriver) {
      logger.warn("Driver already exists", { vehicleNumber });
      return res.status(400).json({ message: "Driver already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
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

    await driverRepo.save(driver);
    logger.info("Driver registered", { driverId: driver.id });
    res.status(201).json({ message: "Driver registered", driverId: driver.id });
  } catch (error) {
    logger.error("Driver registration error", { error });
    res.status(500).json({ message: "Server error" });
  }
};

export const createRoute = async (req: Request, res: Response):Promise<any> => {
  const { driverId, pickupPoints, destinations, startTime } = req.body;

  try {
    const driverRepo = AppDataSource.getRepository(Driver);
    const routeRepo = AppDataSource.getRepository(Route);
    const pickupRepo = AppDataSource.getRepository(PickupPoint);
    const destRepo = AppDataSource.getRepository(Destination);

    const driver = await driverRepo.findOne({ where: { id: driverId } });
    if (!driver) {
      logger.warn("Driver not found", { driverId });
      return res.status(404).json({ message: "Driver not found" });
    }

    const route = routeRepo.create({
      driverId,
      startTime: new Date(startTime),
    });

    const savedRoute = await routeRepo.save(route);

    // Validate and set coordinates using Google Maps API
    const pickups = await Promise.all(
      pickupPoints.map(async (p: any) => {
        const coords = await getCoordinates(p.address);
        return pickupRepo.create({
          route: savedRoute,
          lat: coords.lat,
          lng: coords.lng,
          address: p.address,
          scheduledPickupTime: new Date(p.scheduledPickupTime),
        });
      })
    );
    await pickupRepo.save(pickups);

    const dests = await Promise.all(
      destinations.map(async (d: any) => {
        const coords = await getCoordinates(d.address);
        return destRepo.create({
          route: savedRoute,
          lat: coords.lat,
          lng: coords.lng,
          address: d.address,
          maxTimeToReach: d.maxTimeToReach,
        });
      })
    );
    await destRepo.save(dests);

    logger.info("Route created", { routeId: savedRoute.id });
    res.status(201).json({ message: "Route created", routeId: savedRoute.id });
  } catch (error) {
    logger.error("Route creation error", { error });
    res.status(500).json({ message: "Server error" });
  }
};

export const getDriver = async(req:Request, res:Response):Promise<any> =>{

  try {
    const driverRepo = AppDataSource.getRepository(Driver);
    const existingDriver = await driverRepo.findAndCount();
    if (existingDriver) {
      logger.warn("Driver already exists", { vehicleNumber });
      return res.status(400).json({ message: "Driver already exists" });
    }
    
  } catch (error) {
    console.log(error)
  }
}