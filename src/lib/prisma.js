import { PrismaClient } from "@prisma/client";

// Mencegah pembuatan multiple instances dari Prisma Client di mode development
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;