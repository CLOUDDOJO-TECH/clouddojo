/**
 * Recommendations Generator (PREMIUM tier)
 *
 * Uses AI to generate personalized study recommendations based on quiz performance.
 * Provides actionable next steps with priorities and estimated time.
 */

import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/prisma";
import { callAIWithSchema, AISchemas } from "@/lib/ai/call-ai";
import { formatQuizDataForAI } from "@/inngest/helpers/quiz-data";
import * as Sentry from "@sentry/nextjs";

export const analyzeRecommendations = inngest.createFunction(
  {
    id: "analyze-recommendations",
    name: "Generate Recommendations",
    retries: 3,
    rateLimit: {
      limit: 10,
      period: "1m",
    },
  },
  { event: "quiz/analyze-recommendations" },
  async ({ event, step }) => {
    const { analysisId, quizData, tier } = event.data;

    if (tier === "free") {
      console.log(`[Recommendations] Skipping - user is on free tier`);
      return { skipped: true, reason: "premium-only" };
    }

    // Get current analysis (to include weaknesses if available)
    const currentAnalysis = await step.run("get-current-analysis", async () => {
      return await prisma.quizAnalysis.findUnique({
        where: { id: analysisId },
      });
    });

    const recommendations = await step.run("ai-generate-recommendations", async () => {
      console.log(`[Recommendations] Generating recommendations with AI`);

      const formattedData = formatQuizDataForAI(quizData);

      // Get missed questions for context
      const missedQuestions = formattedData.questions.filter((q: any) => !q.isCorrect);

      const prompt = `You are an AWS certification study advisor providing personalized recommendations.

Quiz Performance:
- Name: ${formattedData.quiz.name}
- Category: ${formattedData.quiz.category}
- Score: ${formattedData.attempt.percentageScore}%
- Identified Weaknesses: ${JSON.stringify(currentAnalysis?.weaknesses || [])}

Missed Questions (${missedQuestions.length}):
${missedQuestions
  .slice(0, 10) // Limit to 10 for token efficiency
  .map(
    (q: any, i: number) => `
${i + 1}. ${q.text}
   Category: ${q.category}
   AWS Service: ${q.awsService || "General"}
   Correct Answer: ${q.correctAnswer.join(", ")}
   Explanation: ${q.explanation || "N/A"}
`
  )
  .join("\n")}

Provide 3-5 specific, actionable study recommendations to improve.

Return VALID JSON:
{
  "recommendations": [
    {
      "title": "Short, specific recommendation title",
      "description": "Detailed explanation of what to study and why",
      "priority": "high|medium|low",
      "estimatedTime": "30 minutes|2 hours|1 week|etc",
      "resources": ["Specific resource 1", "Specific resource 2"]
    }
  ]
}

Guidelines:
- Be specific to AWS services and concepts they struggled with
- Prioritize based on frequency of mistakes and importance for certification
- Suggest concrete resources (AWS docs, whitepapers, hands-on labs)
- Keep descriptions actionable and motivating
- Focus on quick wins for high-priority items`;

      const result = await callGeminiAI(prompt, {}, { timeoutMs: 25000 });

      console.log(`[Recommendations] Generated ${result.recommendations?.length || 0} recommendations`);

      return result;
    });

    // Save to database
    await step.run("save-recommendations", async () => {
      await prisma.quizAnalysis.update({
        where: { id: analysisId },
        data: {
          recommendations: recommendations.recommendations,
        },
      });

      console.log(`[Recommendations] Saved to analysis ${analysisId}`);
    });

    return {
      success: true,
      analysisId,
      recommendationsCount: recommendations.recommendations?.length || 0,
    };
  }
);
