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
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const redis_1 = require("./config/redis");
const auth_1 = __importDefault(require("./routes/auth"));
const admin_1 = __importDefault(require("./routes/admin"));
const routes_1 = __importDefault(require("./routes/routes"));
const location_1 = __importDefault(require("./routes/location"));
const socket_1 = require("./services/socket");
const error_1 = require("./middleware/error");
const logger_1 = __importDefault(require("./services/logger"));
const fs_1 = __importDefault(require("fs"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use((0, cors_1.default)({ origin: "http://localhost:5173", credentials: true })); // Allow requests from your frontend
app.use(express_1.default.json());
// Ensure image directory exists
const imageDir = process.env.IMAGE_DIR;
if (!fs_1.default.existsSync(imageDir)) {
    fs_1.default.mkdirSync(imageDir, { recursive: true });
}
// Initialize services
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.connectDB)();
    yield (0, redis_1.connectRedis)();
    yield (0, socket_1.initSocket)(server);
}))();
app.use("/auth", auth_1.default);
app.use("/admin", admin_1.default);
app.use("/routes", routes_1.default);
app.use("/location", location_1.default);
app.use(error_1.errorHandler);
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    logger_1.default.info(`Server running on port ${PORT}`);
});
