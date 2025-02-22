import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/db";
import { Driver } from "../entities/Driver";
import logger from "../services/logger";

export const login = async (req: Request, res: Response): Promise<any>  => {
  const { vehicleNumber, password } = req.body;

  try {
    const driverRepo = AppDataSource.getRepository(Driver);
    const driver = await driverRepo.findOne({ where: { vehicleNumber } });
    if (!driver) {
      logger.warn("Driver not found", { vehicleNumber });
      return res.status(400).json({ message: "Driver not found" });
    }

    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) {
      logger.warn("Invalid credentials", { vehicleNumber });
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: driver.id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    logger.info("Driver logged in", { driverId: driver.id });
    res.json({ token, driverId: driver.id });
  } catch (error) {
    logger.error("Login error", { error });
    res.status(500).json({ message: "Server error" });
  }
};