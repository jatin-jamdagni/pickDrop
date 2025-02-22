import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

redisClient.on("error", (err) => console.error("Redis error:", err));

export const connectRedis = async () => {
  await redisClient.connect();
  console.log("Redis connected");
};

export default redisClient;