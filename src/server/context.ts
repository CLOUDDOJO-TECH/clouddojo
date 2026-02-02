/**
 * tRPC Context
 *
 * This file creates the context object that's available to all tRPC procedures.
 * Context typically includes:
 * - Database client (Prisma)
 * - Current user info (from Clerk)
 * - Request metadata
 */

import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

/**
 * Creates context for an incoming request
 * This runs for every tRPC request
 */
export async function createContext() {
  // Get current user from Clerk
  const { userId } = await auth();

  return {
    prisma, // Database client
    userId, // Current user ID (null if not authenticated)
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
