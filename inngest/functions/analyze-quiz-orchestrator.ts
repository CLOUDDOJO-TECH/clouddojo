/**
 * Quiz Analysis Orchestrator
 *
 * Main coordinator that triggers all analysis tasks when a quiz is completed.
 * Runs as a background job, coordinating both free and premium analyses.
 */

import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/prisma";
import { getUserSubscriptionTier } from "@/lib/subscription/get-user-tier";
import { getQuizAttemptData } from "@/inngest/helpers/quiz-data";

export const analyzeQuizOrchestrator = inngest.createFunction(
  {
    id: "analyze-quiz-orchestrator",
    name: "Analyze Quiz - Orchestrator",
    retries: 2,
  },
  { event: "quiz/completed" },
  async ({ event, step }) => {
    const { userId, quizAttemptId } = event.data;
    const startTime = Date.now();

    // Step 1: Create QuizAnalysis record
    const analysis = await step.run("create-analysis-record", async () => {
      console.log(`[Orchestrator] Creating analysis record for quiz ${quizAttemptId}`);

      return await prisma.quizAnalysis.create({
        data: {
          userId,
          quizAttemptId,
          status: "processing",
        },
      });
    });

    // Step 2: Fetch quiz data (cached in DB)
    const quizData = await step.run("fetch-quiz-data", async () => {
      console.log(`[Orchestrator] Fetching quiz data for ${quizAttemptId}`);
      return await getQuizAttemptData(quizAttemptId);
    });

    // Step 3: Check user subscription tier
    const userTier = await step.run("check-user-tier", async () => {
      console.log(`[Orchestrator] Checking subscription tier for user ${userId}`);
      return await getUserSubscriptionTier(userId);
    });

    console.log(`[Orchestrator] User tier: ${userTier}`);

    // Step 4: Trigger parallel analysis tasks (FREE tier)
    await step.run("trigger-free-analyses", async () => {
      console.log(`[Orchestrator] Triggering FREE tier analyses`);

      // These run in parallel via separate Inngest functions
      await Promise.all([
        inngest.send({
          name: "quiz/analyze-category-scores",
          data: { analysisId: analysis.id, quizData, tier: userTier },
        }),
        inngest.send({
          name: "quiz/analyze-time-efficiency",
          data: { analysisId: analysis.id, quizData, tier: userTier },
        }),
      ]);
    });

    // Step 5: Trigger PREMIUM analyses (only if premium)
    if (userTier !== "free") {
      await step.run("trigger-premium-analyses", async () => {
        console.log(`[Orchestrator] Triggering PREMIUM tier analyses`);

        await Promise.all([
          inngest.send({
            name: "quiz/analyze-strengths-weaknesses",
            data: { analysisId: analysis.id, quizData, tier: userTier },
          }),
          inngest.send({
            name: "quiz/analyze-recommendations",
            data: { analysisId: analysis.id, quizData, tier: userTier },
          }),
          inngest.send({
            name: "quiz/analyze-topic-mastery",
            data: { analysisId: analysis.id, quizData, tier: userTier },
          }),
        ]);
      });
    }

    // Step 6: Wait for all analyses to complete (with timeout)
    await step.sleep("wait-for-analyses", "30s");

    // Step 7: Check completion status and mark as completed
    const completionStatus = await step.run("check-completion", async () => {
      const updatedAnalysis = await prisma.quizAnalysis.findUnique({
        where: { id: analysis.id },
      });

      const processingTime = Date.now() - startTime;

      // Check if we have the minimum required data
      const hasBasicData = updatedAnalysis?.categoryScores && updatedAnalysis?.timeEfficiency;

      if (hasBasicData) {
        await prisma.quizAnalysis.update({
          where: { id: analysis.id },
          data: {
            status: "completed",
            processingTimeMs: processingTime,
          },
        });
        console.log(`[Orchestrator] Analysis completed in ${processingTime}ms`);
        return { success: true, processingTime };
      } else {
        await prisma.quizAnalysis.update({
          where: { id: analysis.id },
          data: {
            status: "failed",
            error: "Some analyses did not complete",
            processingTimeMs: processingTime,
          },
        });
        console.error(`[Orchestrator] Analysis failed - missing required data`);
        return { success: false, processingTime };
      }
    });

    // Step 8: Trigger dashboard update (debounced)
    if (completionStatus.success) {
      await step.run("trigger-dashboard-update", async () => {
        console.log(`[Orchestrator] Triggering dashboard update for user ${userId}`);

        await inngest.send({
          name: "dashboard/update-requested",
          data: { userId },
        });
      });
    }

    return {
      success: completionStatus.success,
      analysisId: analysis.id,
      processingTime: completionStatus.processingTime,
      tier: userTier,
    };
  }
);
