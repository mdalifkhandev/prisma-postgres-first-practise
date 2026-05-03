import Redis from "ioredis";
import { env } from "../config/env";
import { logger } from "./logger";

export const redisClient = env.REDIS_URL
  ? new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: true,
    })
  : null;

if (redisClient) {
  redisClient.on("error", (error) => {
    logger.error({ err: error }, "Redis client error");
  });
}

