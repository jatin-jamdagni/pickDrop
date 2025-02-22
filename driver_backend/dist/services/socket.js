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
exports.io = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const redis_1 = __importDefault(require("../config/redis"));
let io;
const initSocket = (server) => __awaiter(void 0, void 0, void 0, function* () {
    exports.io = io = new socket_io_1.Server(server);
    const pubClient = redis_1.default;
    const subClient = pubClient.duplicate();
    io.adapter((0, redis_adapter_1.createAdapter)(pubClient, subClient));
    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);
        socket.on("join", (driverId) => {
            socket.join(driverId);
        });
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
});
exports.initSocket = initSocket;
