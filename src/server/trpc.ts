/**
 * tRPC Server Configuration
 *
 * This file sets up the tRPC instance with middleware and procedure helpers.
 */

import { initTRPC, TRPCError } from '@trpc/server';
import { Context } from './context';
import superjson from 'superjson';

// Initialize tRPC with context
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof Error && error.cause.name === 'ZodError'
            ? error.cause
            : null,
      },
    };
  },
});

/**
 * Export reusable router and procedure helpers
 */
export const router = t.router;
export const middleware = t.middleware;

/**
 * Public (unauthenticated) procedure
 * Anyone can call this
 */
export const publicProcedure = t.procedure;

/**
 * Protected (authenticated) procedure
 * Requires user to be logged in via Clerk
 */
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    });
  }

  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId, // Now guaranteed to be defined
    },
  });
});

/**
 * Example: Rate limiting middleware (optional)
 * Uncomment and customize as needed
 */
// export const rateLimitedProcedure = publicProcedure.use(async ({ ctx, next }) => {
//   // Implement rate limiting logic here
//   return next();
// });
