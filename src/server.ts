import "dotenv/config";
import type { Server } from "http";
import app from "./app";
import { prisma } from "./shared/prisma";

const port = process.env.PORT || 5001;

async function main() {
  const server: Server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  const gracefulShutdown = async (signal: string) => {
    console.log(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await prisma.$disconnect();
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
