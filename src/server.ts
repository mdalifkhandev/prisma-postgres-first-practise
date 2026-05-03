import type { Server } from "http";
import app from "./app";
import { prisma } from "./shared/prisma";
import { env } from "./config/env";
import { logger } from "./shared/logger";
import { redisClient } from "./shared/redis";

const port = env.PORT;

async function main() {
  const server: Server = app.listen(port, () => {
    logger.info({ port }, "Server is running");
  });

  const gracefulShutdown = async (signal: string) => {
    logger.info({ signal }, "Shutdown signal received. Shutting down gracefully");
    server.close(async () => {
      await prisma.$disconnect();
      if (redisClient) {
        await redisClient.quit();
      }
      logger.info("Prisma disconnected. Server stopped");
      process.exit(0);
    });
  };

  process.on("SIGINT", () => {
    void gracefulShutdown("SIGINT");
  });

  process.on("SIGTERM", () => {
    void gracefulShutdown("SIGTERM");
  });
}

void main();
