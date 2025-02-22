import axios from "axios";
import fs from "fs";
import path from "path";
import logger from "./logger";
import { DriverLocation } from "../entities/DriverLocation";
import { Destination } from "../entities/Destination";

export const generateRouteMapImage = async (
  routeId: string,
  locations: DriverLocation[],
  destinations: Destination[]
): Promise<string> => {
  try {
    const osmUrl = process.env.OSM_STATIC_API_URL as string; // Assert non-undefined
    const width = 800;
    const height = 600;

    // Build polyline from locations
    const pathString = locations.map((loc) => `${loc.lat},${loc.lng}`).join("|");
    const markers = destinations.map((dest) => `marker=${dest.lat},${dest.lng},red`).join("&");

    const url = `${osmUrl}?w=${width}&h=${height}&path=${encodeURIComponent(
      pathString
    )}&${markers}&zoom=auto`;

    // Fetch image as ArrayBuffer
    const response: any = await axios.get(url, {
      responseType: "arraybuffer",
    });

    // Convert ArrayBuffer to Buffer for fs
    const imageBuffer = Buffer.from(response.data);

    // Ensure IMAGE_DIR is defined and valid
    const imageDir = process.env.IMAGE_DIR as string;
    if (!imageDir) {
      throw new Error("IMAGE_DIR environment variable is not set");
    }

    const imagePath = path.join(imageDir, `${routeId}.png`);
    fs.writeFileSync(imagePath, imageBuffer);

    logger.info("Route map image generated", { routeId, imagePath });
    return imagePath;
  } catch (error) {
    logger.error("Route map generation error", { error: error instanceof Error ? error.message : error });
    throw error;
  }
};