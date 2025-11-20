/**
 * Quiz Router
 *
 * Handles all quiz-related operations:
 * - Getting public demo questions
 * - Verifying answers
 * - Quiz session management (for authenticated users)
 */

import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import {
  triggerQuizMilestoneEmail,
  triggerPerfectScore,
} from '@/lib/emails/services/orchestrator';

// Validation schemas
const providerEnum = z.enum([
  'AWS',
  'Azure',
  'GCP',
  'Kubernetes',
  'Terraform',
  'Docker',
]);

const questionModeEnum = z.enum(['practice', 'timed', 'exam']);

export const quizRouter = router({
  /**
   * PUBLIC: Get demo/public questions
   * Used on /demo page for unauthenticated users
   *
   * Replaces: /app/api/demo/questions/route.ts
   */
  getPublicQuestions: publicProcedure
    .input(
      z.object({
        provider: providerEnum,
        limit: z.number().min(1).max(15).default(10),
      })
    )
    .query(async ({ input, ctx }) => {
      // Find public quizzes for the specified provider
      const quizzes = await ctx.prisma.quiz.findMany({
        where: {
          isPublic: true,
          free: true,
          providers: {
            has: input.provider,
          },
        },
        include: {
          questions: {
            include: {
              options: {
                select: {
                  id: true,
                  text: true,
                  // Don't expose isCorrect for public questions!
                },
              },
            },
            take: input.limit * 2, // Get more than needed for randomization
          },
        },
        take: 5, // Limit number of quizzes
      });

      // Flatten all questions from all quizzes
      const allQuestions = quizzes.flatMap((quiz) => quiz.questions);

      // Randomize and limit to requested amount
      const shuffled = allQuestions
        .sort(() => Math.random() - 0.5)
        .slice(0, input.limit);

      return shuffled.map((q) => ({
        id: q.id,
        text: q.text,
        difficulty: q.difficulty,
        service: q.service,
        topic: q.topic,
        options: q.options,
        // explanation is hidden until answer is verified
      }));
    }),

  /**
   * PUBLIC: Verify user's answer to a question
   * Returns whether answer is correct + explanation
   *
   * Replaces: /app/api/demo/verify/route.ts
   */
  verifyAnswer: publicProcedure
    .input(
      z.object({
        questionId: z.string(),
        selectedOptionIds: z.array(z.string()).min(1, 'Must select at least one option'),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Fetch the question with correct answers
      const question = await ctx.prisma.question.findUnique({
        where: { id: input.questionId },
        include: {
          options: true,
        },
      });

      if (!question) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Question not found',
        });
      }

      // Get IDs of correct options
      const correctOptionIds = question.options
        .filter((opt) => opt.isCorrect)
        .map((opt) => opt.id)
        .sort();

      // Sort user's selections for comparison
      const userOptionIds = [...input.selectedOptionIds].sort();

      // Check if answer is correct (must match exactly)
      const isCorrect =
        correctOptionIds.length === userOptionIds.length &&
        correctOptionIds.every((id, index) => id === userOptionIds[index]);

      return {
        isCorrect,
        correctOptionIds,
        explanation: question.explanation,
        questionText: question.text,
      };
    }),

  /**
   * PROTECTED: Get user's quiz attempt history
   * Requires authentication
   */
  getQuizHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      const attempts = await ctx.prisma.quizAttempt.findMany({
        where: {
          userId: ctx.userId,
        },
        include: {
          quiz: {
            select: {
              id: true,
              title: true,
              providers: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: input.limit,
        skip: input.offset,
      });

      // Also get total count for pagination
      const totalCount = await ctx.prisma.quizAttempt.count({
        where: {
          userId: ctx.userId,
        },
      });

      return {
        attempts,
        totalCount,
        hasMore: input.offset + input.limit < totalCount,
      };
    }),

  /**
   * PROTECTED: Start a new quiz session
   * Creates a quiz attempt record
   */
  startQuizSession: protectedProcedure
    .input(
      z.object({
        quizId: z.string(),
        mode: questionModeEnum.default('practice'),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Verify quiz exists
      const quiz = await ctx.prisma.quiz.findUnique({
        where: { id: input.quizId },
      });

      if (!quiz) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Quiz not found',
        });
      }

      // Create quiz attempt
      const attempt = await ctx.prisma.quizAttempt.create({
        data: {
          userId: ctx.userId,
          quizId: input.quizId,
          mode: input.mode,
          startedAt: new Date(),
        },
      });

      return attempt;
    }),

  /**
   * PROTECTED: Submit quiz session results
   * Calculates score and saves attempt
   */
  submitQuizSession: protectedProcedure
    .input(
      z.object({
        attemptId: z.string(),
        answers: z.array(
          z.object({
            questionId: z.string(),
            selectedOptionIds: z.array(z.string()),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Verify attempt belongs to user
      const attempt = await ctx.prisma.quizAttempt.findFirst({
        where: {
          id: input.attemptId,
          userId: ctx.userId,
        },
      });

      if (!attempt) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Quiz attempt not found',
        });
      }

      // Calculate score
      // PERFORMANCE FIX: Batch fetch all questions to avoid N+1 query
      const questionIds = input.answers.map((a) => a.questionId);
      const questions = await ctx.prisma.question.findMany({
        where: { id: { in: questionIds } },
        include: { options: true },
      });

      // Create a map for O(1) lookup
      const questionMap = new Map(questions.map((q) => [q.id, q]));

      let correctCount = 0;
      const totalQuestions = input.answers.length;

      for (const answer of input.answers) {
        const question = questionMap.get(answer.questionId);

        if (!question) continue;

        const correctIds = question.options
          .filter((opt) => opt.isCorrect)
          .map((opt) => opt.id)
          .sort();

        const userIds = [...answer.selectedOptionIds].sort();

        const isCorrect =
          correctIds.length === userIds.length &&
          correctIds.every((id, i) => id === userIds[i]);

        if (isCorrect) correctCount++;
      }

      const score = (correctCount / totalQuestions) * 100;

      // Update attempt with results
      const updatedAttempt = await ctx.prisma.quizAttempt.update({
        where: { id: input.attemptId },
        data: {
          score,
          completedAt: new Date(),
        },
        include: {
          quiz: true,
        },
      });

      // ============================================
      // PHASE 2: EMAIL TRIGGERS
      // ============================================

      // Get user info for emails
      const user = await ctx.prisma.user.findUnique({
        where: { userId: ctx.userId },
        select: {
          email: true,
          firstName: true,
        },
      });

      // Trigger perfect score email
      if (score === 100 && user) {
        await triggerPerfectScore(
          ctx.userId,
          updatedAttempt.quiz.title
        ).catch((error) => {
          console.error('Failed to trigger perfect score email:', error);
          // Don't throw - email failure shouldn't break quiz submission
        });
      }

      // Get quiz statistics for milestone detection
      const completedQuizzes = await ctx.prisma.quizAttempt.count({
        where: {
          userId: ctx.userId,
          completedAt: { not: null },
        },
      });

      // Calculate average score
      const allAttempts = await ctx.prisma.quizAttempt.findMany({
        where: {
          userId: ctx.userId,
          completedAt: { not: null },
          score: { not: null },
        },
        select: {
          score: true,
          quiz: {
            select: {
              providers: true,
            },
          },
        },
      });

      const totalScore = allAttempts.reduce((sum, a) => sum + (a.score || 0), 0);
      const averageScore = allAttempts.length > 0 ? Math.round(totalScore / allAttempts.length) : 0;

      // Find top category (most common provider)
      const providerCounts: Record<string, number> = {};
      allAttempts.forEach((a) => {
        a.quiz.providers.forEach((provider) => {
          providerCounts[provider] = (providerCounts[provider] || 0) + 1;
        });
      });
      const topCategory = Object.entries(providerCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

      // Determine next milestone
      const milestones = [10, 25, 50, 100];
      const nextMilestone = milestones.find((m) => m > completedQuizzes) || 100;

      // Trigger quiz milestone email if applicable
      if (user) {
        await triggerQuizMilestoneEmail(
          ctx.userId,
          completedQuizzes,
          Math.round(totalScore),
          averageScore,
          nextMilestone,
          topCategory
        ).catch((error) => {
          console.error('Failed to trigger quiz milestone email:', error);
          // Don't throw - email failure shouldn't break quiz submission
        });
      }

      return {
        attemptId: updatedAttempt.id,
        score,
        correctCount,
        totalQuestions,
        passed: score >= 70,
      };
    }),
});
