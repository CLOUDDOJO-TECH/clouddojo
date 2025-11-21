/**
 * Prisma Client for Lambda Functions
 *
 * Uses connection pooling optimized for serverless
 */

import { PrismaClient } from "../../../src/generated/prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  var prisma: ReturnType<typeof createPrismaClient> | undefined;
}

function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });

  return new PrismaClient({ adapter }).$extends(withAccelerate());
}

export const prisma = global.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

// Lambda optimization: Reuse connections
export async function getPrismaClient() {
  if (!global.prisma) {
    global.prisma = createPrismaClient();
  }
  return global.prisma;
}
