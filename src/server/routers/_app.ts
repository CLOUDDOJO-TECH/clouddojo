/**
 * Main tRPC Router
 *
 * This is the root router that combines all feature routers.
 * Add new routers here as you create them.
 */

import { router } from '../trpc';
import { quizRouter } from './quiz';

export const appRouter = router({
  quiz: quizRouter,
  // Add more routers here as we migrate:
  // user: userRouter,
  // progress: progressRouter,
  // flashcard: flashcardRouter,
  // chat: chatRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;
