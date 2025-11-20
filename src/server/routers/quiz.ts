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

const difficultyEnum = z.enum(['BEGINER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']);

export const quizRouter = router({
  /**
   * PUBLIC: Get available topics/categories for a provider
   * Used in quiz builder filter dropdown
   */
  getTopics: publicProcedure
    .input(
      z.object({
        provider: providerEnum,
      })
    )
    .query(async ({ input, ctx }) => {
      // Get unique categories from quizzes for this provider
      const categories = await ctx.prisma.category.findMany({
        where: {
          quizzes: {
            some: {
              providers: {
                has: input.provider,
              },
              isPublic: true,
            },
          },
        },
        select: {
          id: true,
          name: true,
          description: true,
        },
        orderBy: {
          name: 'asc',
        },
      });

      return categories;
    }),

  /**
   * PUBLIC: Get available AWS services for filtering
   * Returns unique service names from questions
   */
  getServices: publicProcedure
    .input(
      z.object({
        provider: providerEnum,
      })
    )
    .query(async ({ input, ctx }) => {
      // Get unique services from questions
      const services = await ctx.prisma.question.findMany({
        where: {
          quiz: {
            providers: {
              has: input.provider,
            },
            isPublic: true,
          },
          awsService: {
            not: null,
          },
        },
        select: {
          awsService: true,
        },
        distinct: ['awsService'],
        orderBy: {
          awsService: 'asc',
        },
      });

      return services
        .filter((s: { awsService: string | null }) => s.awsService !== null)
        .map((s: { awsService: string | null }) => s.awsService as string);
    }),

  /**
   * PUBLIC: Get filtered questions with advanced filtering
   * Used for custom quiz builder
   */
  getFilteredQuestions: publicProcedure
    .input(
      z.object({
        provider: providerEnum,
        limit: z.number().min(5).max(50).default(10),
        categoryId: z.string().optional(),
        difficulty: difficultyEnum.optional(),
        service: z.string().optional(),
        isMultiSelect: z.boolean().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      // Build where clause dynamically
      const whereClause: any = {
        quiz: {
          providers: {
            has: input.provider,
          },
          isPublic: true,
          free: true,
        },
      };

      // Add optional filters
      if (input.categoryId) {
        whereClause.categoryId = input.categoryId;
      }

      if (input.difficulty) {
        whereClause.difficultyLevel = input.difficulty;
      }

      if (input.service) {
        whereClause.awsService = input.service;
      }

      if (input.isMultiSelect !== undefined) {
        whereClause.isMultiSelect = input.isMultiSelect;
      }

      // Fetch filtered questions
      const questions = await ctx.prisma.question.findMany({
        where: whereClause,
        include: {
          options: {
            select: {
              id: true,
              content: true,
              // Don't expose isCorrect for unauthenticated users
            },
          },
          quiz: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        take: input.limit * 2, // Get more for randomization
      });

      // Randomize and limit
      const shuffled = questions
        .sort(() => Math.random() - 0.5)
        .slice(0, input.limit);

      return shuffled.map((q: any) => ({
        id: q.id,
        text: q.content,
        difficulty: q.difficultyLevel,
        service: q.awsService,
        isMultiSelect: q.isMultiSelect,
        options: q.options.map((opt: any) => ({
          id: opt.id,
          text: opt.content,
        })),
        quizTitle: q.quiz.title,
      }));
    }),

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
      const allQuestions = quizzes.flatMap((quiz: any) => quiz.questions);

      // Randomize and limit to requested amount
      const shuffled = allQuestions
        .sort(() => Math.random() - 0.5)
        .slice(0, input.limit);

      return shuffled.map((q: any) => ({
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
        .filter((opt: any) => opt.isCorrect)
        .map((opt: any) => opt.id)
        .sort();

      // Sort user's selections for comparison
      const userOptionIds = [...input.selectedOptionIds].sort();

      // Check if answer is correct (must match exactly)
      const isCorrect =
        correctOptionIds.length === userOptionIds.length &&
        correctOptionIds.every((id: string, index: number) => id === userOptionIds[index]);

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
      let correctCount = 0;
      const totalQuestions = input.answers.length;

      for (const answer of input.answers) {
        const question = await ctx.prisma.question.findUnique({
          where: { id: answer.questionId },
          include: { options: true },
        });

        if (!question) continue;

        const correctIds = question.options
          .filter((opt: any) => opt.isCorrect)
          .map((opt: any) => opt.id)
          .sort();

        const userIds = [...answer.selectedOptionIds].sort();

        const isCorrect =
          correctIds.length === userIds.length &&
          correctIds.every((id: any, i: number) => id === userIds[i]);

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
      });

      return {
        attemptId: updatedAttempt.id,
        score,
        correctCount,
        totalQuestions,
        passed: score >= 70,
      };
    }),
});
