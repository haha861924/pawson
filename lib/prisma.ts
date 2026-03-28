import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  // Parse DATABASE_URL with Node's URL class to correctly handle percent-encoded passwords.
  // Then pass individual params to pg.Pool to avoid pg's own URL parsing bugs.
  const url = new URL(process.env.DATABASE_URL!);
  const adapter = new PrismaPg({
    host: url.hostname,
    port: Number(url.port) || 5432,
    user: url.username,
    password: url.password, // URL class decodes percent-encoding automatically
    database: url.pathname.replace(/^\//, ""),
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
