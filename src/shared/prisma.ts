import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
<<<<<<< HEAD
import { env } from "../config/env";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
=======
import { env } from "../app/config";

const pool = new Pool({
  connectionString: env.databaseUrl,
>>>>>>> 6704ab0264a8d8785b62a17bfe08c2a529e07c6c
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
  adapter,
});
