"use strict";
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
exports.generateRouteMapImage = void 0;
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logger_1 = __importDefault(require("./logger"));
const generateRouteMapImage = (routeId, locations, destinations) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const osmUrl = process.env.OSM_STATIC_API_URL; // Assert non-undefined
        const width = 800;
        const height = 600;
        // Build polyline from locations
        const pathString = locations.map((loc) => `${loc.lat},${loc.lng}`).join("|");
        const markers = destinations.map((dest) => `marker=${dest.lat},${dest.lng},red`).join("&");
        const url = `${osmUrl}?w=${width}&h=${height}&path=${encodeURIComponent(pathString)}&${markers}&zoom=auto`;
        // Fetch image as ArrayBuffer
        const response = yield axios_1.default.get(url, {
            responseType: "arraybuffer",
        });
        // Convert ArrayBuffer to Buffer for fs
        const imageBuffer = Buffer.from(response.data);
        // Ensure IMAGE_DIR is defined and valid
        const imageDir = process.env.IMAGE_DIR;
        if (!imageDir) {
            throw new Error("IMAGE_DIR environment variable is not set");
        }
        const imagePath = path_1.default.join(imageDir, `${routeId}.png`);
        fs_1.default.writeFileSync(imagePath, imageBuffer);
        logger_1.default.info("Route map image generated", { routeId, imagePath });
        return imagePath;
    }
    catch (error) {
        logger_1.default.error("Route map generation error", { error: error instanceof Error ? error.message : error });
        throw error;
    }
});
exports.generateRouteMapImage = generateRouteMapImage;
