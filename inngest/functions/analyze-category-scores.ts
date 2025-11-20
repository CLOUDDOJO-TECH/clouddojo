/**
 * Category Scores Analyzer (FREE tier)
 *
 * Calculates category-level performance metrics without AI.
 * Code-based calculation = fast & free!
 */

import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/prisma";

export const analyzeCategoryScores = inngest.createFunction(
  {
    id: "analyze-category-scores",
    name: "Analyze Category Scores",
    retries: 1,
  },
  { event: "quiz/analyze-category-scores" },
  async ({ event, step }) => {
    const { analysisId, quizData } = event.data;

    // Calculate category scores (no AI needed!)
    const categoryScores = await step.run("calculate-category-scores", async () => {
      console.log(`[Category Scores] Analyzing quiz ${quizData.attempt.id}`);

      const scores: Record<
        string,
        { correct: number; total: number; percentage: number }
      > = {};

      // Group questions by category
      quizData.questions.forEach((q: any) => {
        const category = q.category || "General";

        if (!scores[category]) {
          scores[category] = { correct: 0, total: 0, percentage: 0 };
        }

        scores[category].total++;
        if (q.isCorrect) {
          scores[category].correct++;
        }
      });

      // Calculate percentages
      Object.keys(scores).forEach((category) => {
        scores[category].percentage = Math.round(
          (scores[category].correct / scores[category].total) * 100
        );
      });

      console.log(`[Category Scores] Calculated scores for ${Object.keys(scores).length} categories`);

      return scores;
    });

    // Save to database
    await step.run("save-category-scores", async () => {
      await prisma.quizAnalysis.update({
        where: { id: analysisId },
        data: { categoryScores },
      });

      console.log(`[Category Scores] Saved to analysis ${analysisId}`);
    });

    return {
      success: true,
      analysisId,
      categoriesAnalyzed: Object.keys(categoryScores).length,
    };
  }
);
