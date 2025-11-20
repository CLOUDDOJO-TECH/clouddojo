/**
 * Time Efficiency Analyzer (FREE tier)
 *
 * Analyzes how efficiently the user completed the quiz.
 * Compares against benchmarks to rate as fast/average/slow.
 */

import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/prisma";
import { calculateTimeEfficiency } from "@/inngest/helpers/calculations";

export const analyzeTimeEfficiency = inngest.createFunction(
  {
    id: "analyze-time-efficiency",
    name: "Analyze Time Efficiency",
    retries: 1,
  },
  { event: "quiz/analyze-time-efficiency" },
  async ({ event, step }) => {
    const { analysisId, quizData } = event.data;

    const efficiency = await step.run("calculate-time-efficiency", async () => {
      console.log(`[Time Efficiency] Analyzing quiz ${quizData.attempt.id}`);

      const totalQuestions = quizData.questions.length;
      const totalTime = quizData.attempt.timeSpentSecs;
      const avgTimePerQuestion = totalTime / totalQuestions;

      // Benchmark: 60-90 seconds per question is average for AWS certs
      const rating = calculateTimeEfficiency(avgTimePerQuestion);

      console.log(
        `[Time Efficiency] ${avgTimePerQuestion.toFixed(1)}s/question = ${rating}`
      );

      return {
        rating,
        avgTimePerQuestion: Math.round(avgTimePerQuestion),
        totalTime,
        totalQuestions,
      };
    });

    // Save to database
    await step.run("save-time-efficiency", async () => {
      await prisma.quizAnalysis.update({
        where: { id: analysisId },
        data: {
          timeEfficiency: efficiency.rating,
          quizScore: quizData.attempt.percentageScore,
        },
      });

      console.log(`[Time Efficiency] Saved to analysis ${analysisId}`);
    });

    return {
      success: true,
      analysisId,
      efficiency,
    };
  }
);
