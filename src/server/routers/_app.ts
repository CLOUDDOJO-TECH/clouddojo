/**
 * Main tRPC Router
 *
 * This is the root router that combines all feature routers.
 * Add new routers here as you create them.
 */

import { router } from '../trpc';
import { quizRouter } from './quiz';
import { gamificationRouter } from './gamification';
import { analysisRouter } from './analysis';
import { emailRouter } from './email';
import { adminEmailRouter } from './admin/email';

export const appRouter = router({
  quiz: quizRouter,
  gamification: gamificationRouter,
  analysis: analysisRouter,
  email: emailRouter,
  adminEmail: adminEmailRouter,
  // Add more routers here as we migrate:
  // user: userRouter,
  // progress: progressRouter,
  // flashcard: flashcardRouter,
  // chat: chatRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;
