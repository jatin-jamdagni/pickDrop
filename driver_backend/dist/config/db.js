"use strict";
// import { DataSource } from "typeorm";
// import dotenv from "dotenv";
// import { Driver } from "../entities/Driver";
// import { Route } from "../entities/Route";
// import { PickupPoint } from "../entities/PickupPoint";
// import { Destination } from "../entities/Destination";
//  import { RouteMetadata } from "../entities/RouteMetadata";
// import { DriverLocation } from "../entities/DriverLocation";
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
exports.connectDB = exports.AppDataSource = void 0;
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
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
const Driver_1 = require("../entities/Driver");
const Route_1 = require("../entities/Route");
const PickupPoint_1 = require("../entities/PickupPoint");
const Destination_1 = require("../entities/Destination");
const DriverLocation_1 = require("../entities/DriverLocation");
const RouteMetadata_1 = require("../entities/RouteMetadata");
const Admin_1 = require("../entities/Admin");
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true, // Disable in production
    logging: false,
    ssl: true,
    entities: [Driver_1.Driver, Route_1.Route, PickupPoint_1.PickupPoint, Destination_1.Destination, DriverLocation_1.DriverLocation, RouteMetadata_1.RouteMetadata, Admin_1.Admin],
    poolSize: 10,
});
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.AppDataSource.initialize();
        console.log("PostgreSQL connected");
    }
    catch (error) {
        console.error("PostgreSQL connection error:", error);
        process.exit(1);
    }
});
exports.connectDB = connectDB;
