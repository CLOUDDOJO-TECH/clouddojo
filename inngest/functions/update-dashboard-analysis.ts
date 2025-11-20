/**
 * Dashboard Analysis Updater
 *
 * Aggregates all quiz analyses into a comprehensive dashboard view.
 * Runs after each quiz completion (debounced to avoid excessive updates).
 */

import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/prisma";
import { getUserSubscriptionTier } from "@/lib/subscription/get-user-tier";
import {
  aggregateFreeMetrics,
  aggregatePremiumMetrics,
  calculatePercentileRank,
} from "@/inngest/helpers/aggregation";
import { callGeminiAI } from "@/app/(actions)/ai-analysis/call-gemini";
import { subDays, addWeeks } from "date-fns";

export const updateDashboardAnalysis = inngest.createFunction(
  {
    id: "update-dashboard-analysis",
    name: "Update Dashboard Analysis",
    debounce: {
      key: "event.data.userId",
      period: "5m", // Don't update more than once per 5 minutes
    },
    retries: 2,
  },
  { event: "dashboard/update-requested" },
  async ({ event, step }) => {
    const { userId } = event.data;

    // Get user tier
    const userTier = await step.run("check-user-tier", async () => {
      console.log(`[Dashboard] Checking tier for user ${userId}`);
      return await getUserSubscriptionTier(userId);
    });

    // Fetch all completed quiz analyses (last 30 days)
    const quizAnalyses = await step.run("fetch-quiz-analyses", async () => {
      console.log(`[Dashboard] Fetching quiz analyses for user ${userId}`);

      return await prisma.quizAnalysis.findMany({
        where: {
          userId,
          status: "completed",
          generatedAt: { gte: subDays(new Date(), 30) },
        },
        orderBy: { generatedAt: "desc" },
        include: {
          quizAttempt: {
            select: {
              percentageScore: true,
              timeSpentSecs: true,
              totalScore: true,
            },
          },
        },
      });
    });

    if (quizAnalyses.length === 0) {
      console.log(`[Dashboard] No quiz data for user ${userId}, skipping`);
      return { skipped: true, reason: "no-quiz-data" };
    }

    console.log(`[Dashboard] Found ${quizAnalyses.length} completed analyses`);

    // FREE tier aggregation (code-based, no AI)
    const freeMetrics = await step.run("aggregate-free-metrics", async () => {
      console.log(`[Dashboard] Aggregating FREE metrics`);
      return aggregateFreeMetrics(quizAnalyses as any);
    });

    // PREMIUM tier aggregation
    let premiumMetrics: any = {};
    if (userTier !== "free") {
      premiumMetrics = await step.run("aggregate-premium-metrics", async () => {
        console.log(`[Dashboard] Aggregating PREMIUM metrics`);
        return aggregatePremiumMetrics(quizAnalyses as any, userTier);
      });

      // Generate AI study plan (only 1 AI call for entire dashboard!)
      const studyPlan = await step.run("generate-study-plan", async () => {
        console.log(`[Dashboard] Generating AI study plan`);
        return await generateStudyPlan(userId, quizAnalyses, premiumMetrics);
      });

      premiumMetrics.studyPlan = studyPlan;

      // Calculate percentile rank
      const percentileRank = await step.run("calculate-percentile", async () => {
        return await calculatePercentileRank(
          userId,
          freeMetrics.overallScore,
          prisma
        );
      });

      premiumMetrics.percentileRank = percentileRank;
    }

    // Save to dashboard
    await step.run("save-dashboard-analysis", async () => {
      console.log(`[Dashboard] Saving dashboard analysis for user ${userId}`);

      await prisma.dashboardAnalysis.upsert({
        where: { userId },
        update: {
          lastUpdatedAt: new Date(),
          status: "completed",
          ...freeMetrics,
          ...premiumMetrics,
          lastQuizAnalyzed: quizAnalyses[0].quizAttemptId,
          nextUpdateAt: addWeeks(new Date(), 1),
        },
        create: {
          userId,
          status: "completed",
          ...freeMetrics,
          ...premiumMetrics,
          lastQuizAnalyzed: quizAnalyses[0].quizAttemptId,
          nextUpdateAt: addWeeks(new Date(), 1),
        },
      });

      console.log(`[Dashboard] Dashboard analysis saved`);
    });

    return {
      success: true,
      userId,
      quizzesAnalyzed: quizAnalyses.length,
      tier: userTier,
      metricsIncluded: {
        free: Object.keys(freeMetrics),
        premium: Object.keys(premiumMetrics),
      },
    };
  }
);

/**
 * Generate personalized study plan using AI
 */
async function generateStudyPlan(
  userId: string,
  analyses: any[],
  aggregatedMetrics: any
): Promise<any> {
  // Get user's weak spots
  const weakSpots = await prisma.topicMastery.findMany({
    where: {
      userId,
      masteryScore: { lt: 60 },
    },
    orderBy: { masteryScore: "asc" },
    take: 5,
  });

  const prompt = `You are a personalized AWS certification study planner.

User Performance Summary:
- Overall Score: ${aggregatedMetrics.certificationReadiness}%
- Quizzes Taken: ${analyses.length}
- Learning Velocity: ${aggregatedMetrics.learningVelocity}
- Estimated Ready Date: ${aggregatedMetrics.estimatedReadyDate}

Top Strengths:
${aggregatedMetrics.topStrengths?.map((s: any) => `- ${s.strength}`).join("\n") || "N/A"}

Top Weaknesses:
${aggregatedMetrics.topWeaknesses?.map((w: any) => `- ${w.weakness}`).join("\n") || "N/A"}

Topics Needing Improvement:
${weakSpots.map((t) => `- ${t.topic}: ${t.masteryScore}% mastery`).join("\n") || "N/A"}

Categories Trending Up:
${aggregatedMetrics.trendingUp?.map((c: any) => `- ${c.category} (+${c.improvement}%)`).join("\n") || "N/A"}

Categories Trending Down:
${aggregatedMetrics.trendingDown?.map((c: any) => `- ${c.category} (-${c.decline}%)`).join("\n") || "N/A"}

Create a personalized 2-week study plan to maximize certification readiness.

Return VALID JSON:
{
  "summary": "Brief summary of the study plan strategy",
  "weeklyGoals": [
    {
      "week": 1,
      "focus": "Primary focus area for this week",
      "tasks": [
        {
          "day": "Monday",
          "topic": "Topic to study",
          "activities": ["Activity 1", "Activity 2"],
          "estimatedTime": "2 hours"
        }
      ]
    }
  ],
  "priorityActions": [
    "Most important action 1",
    "Most important action 2",
    "Most important action 3"
  ],
  "milestones": [
    {
      "goal": "Milestone description",
      "deadline": "In 1 week|In 2 weeks|etc",
      "successCriteria": "How to measure success"
    }
  ]
}

Make the plan:
- Specific to their weak topics
- Balanced between learning new content and practicing
- Realistic and achievable
- Focused on high-impact improvements`;

  try {
    const result = await callGeminiAI(prompt, {}, { timeoutMs: 30000 });
    return result;
  } catch (error) {
    console.error("[Study Plan] AI generation failed:", error);
    // Return fallback plan
    return {
      summary: "Focus on your weak topics and practice regularly",
      priorityActions: [
        "Practice quizzes in your weakest categories",
        "Review AWS documentation for topics < 60% mastery",
        "Take at least 3 practice quizzes per week",
      ],
    };
  }
}
