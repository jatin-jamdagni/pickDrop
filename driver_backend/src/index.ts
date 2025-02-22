import "reflect-metadata";
import express from "express";
import http from "http";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import { connectRedis } from "./config/redis";
import authRoutes from "./routes/auth";
import adminRoutes from "./routes/admin";
import routeRoutes from "./routes/routes";
import locationRoutes from "./routes/location";
import { initSocket } from "./services/socket";
import { errorHandler } from "./middleware/error";
import logger from "./services/logger";
import fs from "fs";
import cors from "cors";

dotenv.config();
const app = express();
const server = http.createServer(app);
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Allow requests from your frontend

app.use(express.json());

// Ensure image directory exists
const imageDir = process.env.IMAGE_DIR!;
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

// Initialize services
(async () => {
  await connectDB();
  await connectRedis();
  await initSocket(server);
})();

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/routes", routeRoutes);
app.use("/location", locationRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});