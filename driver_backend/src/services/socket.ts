import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import redisClient from "../config/redis";

let io: Server;

export const initSocket = async (server: any) => {
  io = new Server(server);
  const pubClient = redisClient;
  const subClient = pubClient.duplicate();
  io.adapter(createAdapter(pubClient, subClient));

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join", (driverId: string) => {
      socket.join(driverId);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export { io };