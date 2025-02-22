// import { DataSource } from "typeorm";
// import dotenv from "dotenv";
// import { Driver } from "../entities/Driver";
// import { Route } from "../entities/Route";
// import { PickupPoint } from "../entities/PickupPoint";
// import { Destination } from "../entities/Destination";
//  import { RouteMetadata } from "../entities/RouteMetadata";
// import { DriverLocation } from "../entities/DriverLocation";

// dotenv.config();

// export const AppDataSource = new DataSource({
//   type: "postgres",
//   host: process.env.DB_HOST,
//   port: parseInt(process.env.DB_PORT || "5432"),
//   username: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   synchronize: true, // Disable in production
//   logging: false,
//   ssl: true,
//   entities: [Driver, Route, PickupPoint, Destination, DriverLocation, RouteMetadata],
//   poolSize: 10,
// });

// export const connectDB = async () => {
//   try {
//     await AppDataSource.initialize();
//     console.log("PostgreSQL connected");
//   } catch (error) {
//     console.error("PostgreSQL connection error:", error);
//     process.exit(1);
//   }
// };


import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Driver } from "../entities/Driver";
import { Route } from "../entities/Route";
import { PickupPoint } from "../entities/PickupPoint";
import { Destination } from "../entities/Destination";
import { DriverLocation } from "../entities/DriverLocation";
import { RouteMetadata } from "../entities/RouteMetadata";
import { Admin } from "../entities/Admin";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // Disable in production
  logging: false,
  ssl: true,
  entities: [Driver, Route, PickupPoint, Destination, DriverLocation, RouteMetadata, Admin],
  poolSize: 10,
});

export const connectDB = async () => {
  try {
    await AppDataSource.initialize();
    console.log("PostgreSQL connected");
  } catch (error) {
    console.error("PostgreSQL connection error:", error);
    process.exit(1);
  }
};