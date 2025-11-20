/**
 * Analysis Router
 *
 * Handles AI-powered analysis operations:
 * - Per-quiz AI analysis
 * - Per-certification readiness analysis
 * - Learning recommendations
 */

import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { triggerAIAnalysisReady } from '@/lib/emails/services/orchestrator';

export const analysisRouter = router({
  /**
   * Get quiz analysis for a specific quiz attempt
   */
  getQuizAnalysis: protectedProcedure
    .input(
      z.object({
        quizId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const analysis = await ctx.prisma.quizAnalysis.findFirst({
        where: {
          quizId: input.quizId,
          userId: ctx.userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (!analysis) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No analysis found for this quiz',
        });
      }

      return analysis;
    }),

  /**
   * Get certification readiness analysis
   */
  getCertificationAnalysis: protectedProcedure
    .input(
      z.object({
        certificationName: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const analysis = await ctx.prisma.certificationAnalysis.findFirst({
        where: {
          userId: ctx.userId,
          certificationName: input.certificationName,
        },
        orderBy: {
          analyzedAt: 'desc',
        },
      });

      if (!analysis) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No analysis found for this certification',
        });
      }

      return analysis;
    }),

  /**
   * Request AI analysis for a certification
   * Triggers analysis generation and sends email when ready
   */
  requestCertificationAnalysis: protectedProcedure
    .input(
      z.object({
        certificationName: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Check if analysis was recently generated (within 24 hours)
      const recentAnalysis = await ctx.prisma.certificationAnalysis.findFirst({
        where: {
          userId: ctx.userId,
          certificationName: input.certificationName,
          analyzedAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      });

      if (recentAnalysis) {
        return {
          success: false,
          message: 'Analysis was already generated within the last 24 hours',
          analysis: recentAnalysis,
        };
      }

      // Get user's quiz attempts for this certification
      const attempts = await ctx.prisma.quizAttempt.findMany({
        where: {
          userId: ctx.userId,
          quiz: {
            providers: {
              has: input.certificationName,
            },
          },
          completedAt: { not: null },
        },
        include: {
          quiz: true,
        },
      });

      if (attempts.length === 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'No completed quizzes found for this certification',
        });
      }

      // Calculate readiness score (simplified)
      const averageScore =
        attempts.reduce((sum, a) => sum + (a.score || 0), 0) / attempts.length;
      const readinessScore = Math.min(100, Math.round(averageScore * 1.2)); // Boost score slightly

      // Create analysis record
      const analysis = await ctx.prisma.certificationAnalysis.create({
        data: {
          userId: ctx.userId,
          certificationName: input.certificationName,
          readinessScore,
          strengths: ['Strong fundamentals'], // TODO: AI-generated
          weaknesses: ['Advanced topics need work'], // TODO: AI-generated
          recommendations: ['Focus on practice exams'], // TODO: AI-generated
          estimatedStudyHours: 40, // TODO: Calculate based on score
          analyzedAt: new Date(),
        },
      });

      // Trigger AI analysis ready email
      await triggerAIAnalysisReady(
        ctx.userId,
        input.certificationName,
        readinessScore
      ).catch((error) => {
        console.error('Failed to trigger AI analysis email:', error);
      });

      return {
        success: true,
        message: 'Analysis generated successfully',
        analysis,
      };
    }),

  /**
   * Get all analyses for current user
   */
  getAllAnalyses: protectedProcedure.query(async ({ ctx }) => {
    const [quizAnalyses, certAnalyses] = await Promise.all([
      ctx.prisma.quizAnalysis.findMany({
        where: { userId: ctx.userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          quiz: {
            select: {
              title: true,
              providers: true,
            },
          },
        },
      }),
      ctx.prisma.certificationAnalysis.findMany({
        where: { userId: ctx.userId },
        orderBy: { analyzedAt: 'desc' },
        take: 10,
      }),
    ]);

    return {
      quizAnalyses,
      certificationAnalyses: certAnalyses,
    };
  }),
});
