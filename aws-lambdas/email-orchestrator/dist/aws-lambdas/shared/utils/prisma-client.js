"use strict";
/**
 * Prisma Client for Lambda Functions
 *
 * Uses connection pooling optimized for serverless
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.getPrismaClient = getPrismaClient;
const client_1 = require("@prisma/client");
const extension_accelerate_1 = require("@prisma/extension-accelerate");
const adapter_pg_1 = require("@prisma/adapter-pg");
function createPrismaClient() {
    const adapter = new adapter_pg_1.PrismaPg({
        connectionString: process.env.DATABASE_URL,
    });
    return new client_1.PrismaClient({ adapter }).$extends((0, extension_accelerate_1.withAccelerate)());
}
exports.prisma = global.prisma || createPrismaClient();
if (process.env.NODE_ENV !== "production") {
    global.prisma = exports.prisma;
}
// Lambda optimization: Reuse connections
async function getPrismaClient() {
    if (!global.prisma) {
        global.prisma = createPrismaClient();
    }
    return global.prisma;
}
