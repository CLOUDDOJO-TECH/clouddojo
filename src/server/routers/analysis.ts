/**
 * Analysis Router
 *
 * Handles all AI analysis-related operations:
 * - Getting per-quiz analysis
 * - Getting dashboard analysis
 * - Checking analysis status
 * - Triggering manual analysis refresh
 */

import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { getUserSubscriptionTier } from "@/lib/subscription/get-user-tier";

export const analysisRouter = router({
  /**
   * Get analysis for a specific quiz attempt
   */
  getQuizAnalysis: protectedProcedure
    .input(
      z.object({
        quizAttemptId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { quizAttemptId } = input;
      const userId = ctx.user.userId;

      // Verify the quiz attempt belongs to the user
      const quizAttempt = await ctx.prisma.quizAttempt.findUnique({
        where: { id: quizAttemptId },
      });

      if (!quizAttempt || quizAttempt.userId !== userId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Quiz attempt not found",
        });
      }

      // Get the analysis
      const analysis = await ctx.prisma.quizAnalysis.findUnique({
        where: { quizAttemptId },
      });

      if (!analysis) {
        return {
          found: false,
          status: "not_started",
        };
      }

      // Check user tier to filter premium content
      const userTier = await getUserSubscriptionTier(userId);
      const isPremium = userTier !== "free";

      // Return appropriate data based on tier
      return {
        found: true,
        status: analysis.status,
        generatedAt: analysis.generatedAt,

        // FREE tier data
        categoryScores: analysis.categoryScores,
        timeEfficiency: analysis.timeEfficiency,
        quizScore: analysis.quizScore,

        // PREMIUM tier data (filtered for free users)
        strengths: isPremium ? analysis.strengths : null,
        weaknesses: isPremium ? analysis.weaknesses : null,
        recommendations: isPremium ? analysis.recommendations : null,
        topicMastery: isPremium ? analysis.topicMastery : null,
        insights: isPremium ? analysis.insights : null,

        // Metadata
        processingTimeMs: analysis.processingTimeMs,
        error: analysis.error,
        isPremium,
      };
    }),

  /**
   * Get dashboard analysis (aggregated metrics)
   */
  getDashboardAnalysis: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.userId;

    const dashboard = await ctx.prisma.dashboardAnalysis.findUnique({
      where: { userId },
    });

    if (!dashboard) {
      return {
        found: false,
        status: "not_generated",
      };
    }

    // Check user tier to filter premium content
    const userTier = await getUserSubscriptionTier(userId);
    const isPremium = userTier !== "free";

    return {
      found: true,
      status: dashboard.status,
      lastUpdatedAt: dashboard.lastUpdatedAt,

      // FREE tier metrics
      overallScore: dashboard.overallScore,
      totalQuizzesTaken: dashboard.totalQuizzesTaken,
      averageTimePerQuiz: dashboard.averageTimePerQuiz,
      categoryBreakdown: dashboard.categoryBreakdown,
      recentTrend: dashboard.recentTrend,
      consistencyScore: dashboard.consistencyScore,

      // PREMIUM tier metrics (filtered for free users)
      certificationReadiness: isPremium ? dashboard.certificationReadiness : null,
      topStrengths: isPremium ? dashboard.topStrengths : null,
      topWeaknesses: isPremium ? dashboard.topWeaknesses : null,
      trendingUp: isPremium ? dashboard.trendingUp : null,
      trendingDown: isPremium ? dashboard.trendingDown : null,
      studyPlan: isPremium ? dashboard.studyPlan : null,
      estimatedReadyDate: isPremium ? dashboard.estimatedReadyDate : null,
      percentileRank: isPremium ? dashboard.percentileRank : null,
      learningVelocity: isPremium ? dashboard.learningVelocity : null,

      isPremium,
    };
  }),

  /**
   * Get user's topic mastery (PREMIUM only)
   */
  getTopicMastery: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.userId;

    // Check user tier
    const userTier = await getUserSubscriptionTier(userId);
    if (userTier === "free") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Topic mastery is a premium feature",
      });
    }

    const topicMasteries = await ctx.prisma.topicMastery.findMany({
      where: { userId },
      orderBy: { masteryScore: "desc" },
    });

    return {
      topics: topicMasteries,
      weakSpots: topicMasteries.filter((t) => t.masteryScore < 60),
      strengths: topicMasteries.filter((t) => t.masteryScore >= 80),
    };
  }),

  /**
   * Get recent quiz analyses for a user
   */
  getRecentAnalyses: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).optional().default(10),
      })
    )
    .query(async ({ input, ctx }) => {
      const userId = ctx.user.userId;

      const analyses = await ctx.prisma.quizAnalysis.findMany({
        where: {
          userId,
          status: "completed",
        },
        orderBy: { generatedAt: "desc" },
        take: input.limit,
        include: {
          quizAttempt: {
            select: {
              id: true,
              percentageScore: true,
              completedAt: true,
              quiz: {
                select: {
                  title: true,
                },
              },
            },
          },
        },
      });

      // Check user tier
      const userTier = await getUserSubscriptionTier(userId);
      const isPremium = userTier !== "free";

      return {
        analyses: analyses.map((a) => ({
          id: a.id,
          quizAttemptId: a.quizAttemptId,
          generatedAt: a.generatedAt,
          quizTitle: a.quizAttempt.quiz.title,
          quizScore: a.quizScore,
          completedAt: a.quizAttempt.completedAt,

          // FREE data
          categoryScores: a.categoryScores,
          timeEfficiency: a.timeEfficiency,

          // PREMIUM data
          strengths: isPremium ? a.strengths : null,
          weaknesses: isPremium ? a.weaknesses : null,
          insights: isPremium ? a.insights : null,
        })),
        isPremium,
      };
    }),

  /**
   * Check analysis status for a quiz attempt
   */
  checkAnalysisStatus: protectedProcedure
    .input(
      z.object({
        quizAttemptId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { quizAttemptId } = input;
      const userId = ctx.user.userId;

      // Verify ownership
      const quizAttempt = await ctx.prisma.quizAttempt.findUnique({
        where: { id: quizAttemptId },
      });

      if (!quizAttempt || quizAttempt.userId !== userId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Quiz attempt not found",
        });
      }

      const analysis = await ctx.prisma.quizAnalysis.findUnique({
        where: { quizAttemptId },
        select: {
          status: true,
          generatedAt: true,
          processingTimeMs: true,
          error: true,
        },
      });

      if (!analysis) {
        return {
          status: "not_started",
          message: "Analysis has not started yet",
        };
      }

      return {
        status: analysis.status,
        generatedAt: analysis.generatedAt,
        processingTimeMs: analysis.processingTimeMs,
        error: analysis.error,
        message:
          analysis.status === "pending"
            ? "Analysis is queued"
            : analysis.status === "processing"
            ? "Analysis is in progress"
            : analysis.status === "completed"
            ? "Analysis completed"
            : "Analysis failed",
      };
    }),
});
