import type { Server } from "http";
import app from "./app";
<<<<<<< HEAD
import { prisma } from "./shared/prisma";
import { env } from "./config/env";
import { logger } from "./shared/logger";
import { redisClient } from "./shared/redis";
import { authService } from "./app/modules/auth/auth.service";

const port = env.PORT;
=======
import { env } from "./app/config";

const port = env.port;
>>>>>>> 6704ab0264a8d8785b62a17bfe08c2a529e07c6c

async function main() {
  const cleanupTimer = setInterval(() => {
    void authService.cleanupExpiredRefreshSessions().catch((error) => {
      logger.error({ err: error }, "Failed to cleanup refresh sessions");
    });
  }, env.REFRESH_SESSION_CLEANUP_INTERVAL_MS);
  cleanupTimer.unref();

  const server: Server = app.listen(port, () => {
    logger.info({ port }, "Server is running");
  });

  const gracefulShutdown = async (signal: string) => {
    logger.info({ signal }, "Shutdown signal received. Shutting down gracefully");
    clearInterval(cleanupTimer);
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
