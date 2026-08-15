import { createClient } from "redis";
import { env } from "./env.js";
import { logger } from "../utils/logger.js";

export const redis = createClient({
  url: env.REDIS_URL,
});

redis.on("error", (error) => {
  logger.error(
    {
      error,
    },
    "Redis client error",
  );
});

redis.on("connect", () => {
  logger.info("Redis client connecting");
});

redis.on("ready", () => {
  logger.info("Redis client ready");
});