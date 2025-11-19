/**
 * Strengths & Weaknesses Analyzer (PREMIUM tier)
 *
 * Uses AI to identify specific strengths and weaknesses from this quiz.
 * Provides actionable insights about what the user did well and what needs work.
 */

import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/prisma";
import { callGeminiAI } from "@/app/(actions)/ai-analysis/call-gemini";
import { formatQuizDataForAI } from "@/inngest/helpers/quiz-data";

export const analyzeStrengthsWeaknesses = inngest.createFunction(
  {
    id: "analyze-strengths-weaknesses",
    name: "Analyze Strengths & Weaknesses",
    retries: 3, // Retry on AI failures
    rateLimit: {
      limit: 10,
      period: "1m", // Respect Gemini rate limits
    },
  },
  { event: "quiz/analyze-strengths-weaknesses" },
  async ({ event, step }) => {
    const { analysisId, quizData, tier } = event.data;

    // Premium only
    if (tier === "free") {
      console.log(`[Strengths/Weaknesses] Skipping - user is on free tier`);
      return { skipped: true, reason: "premium-only" };
    }

    const analysis = await step.run("ai-analyze-strengths-weaknesses", async () => {
      console.log(`[Strengths/Weaknesses] Analyzing quiz ${quizData.attempt.id} with AI`);

      const formattedData = formatQuizDataForAI(quizData);

      // Build the AI prompt
      const prompt = `You are an expert AWS certification coach analyzing a quiz performance.

Quiz: ${formattedData.quiz.name}
Category: ${formattedData.quiz.category}
Score: ${formattedData.attempt.percentageScore}%
Questions Attempted: ${formattedData.questions.length}

Question Details:
${formattedData.questions
  .map(
    (q: any, i: number) => `
${i + 1}. ${q.text}
   Category: ${q.category}
   Difficulty: ${q.difficulty}
   AWS Service: ${q.awsService || "General"}
   User Answer: ${q.userAnswer} ${q.isCorrect ? "✓ CORRECT" : "✗ INCORRECT"}
   ${!q.isCorrect ? `Correct Answer: ${q.correctAnswer.join(", ")}` : ""}
   ${q.explanation ? `Explanation: ${q.explanation}` : ""}
`
  )
  .join("\n")}

Analyze THIS quiz only and identify:
1. Top 3 specific strengths (what they did well - be specific to AWS concepts)
2. Top 3 specific weaknesses (what needs improvement - be specific)
3. One key insight (1-2 sentences about their overall performance)

Return VALID JSON:
{
  "strengths": ["Specific strength 1", "Specific strength 2", "Specific strength 3"],
  "weaknesses": ["Specific weakness 1", "Specific weakness 2", "Specific weakness 3"],
  "insight": "One key takeaway about their performance on this quiz"
}

Be specific and actionable. Focus on AWS concepts, services, and best practices - not generic test-taking advice.
If they got everything right, still find nuanced strengths. If they struggled, be constructive.`;

      const result = await callGeminiAI(prompt, {}, { timeoutMs: 25000 });

      console.log(`[Strengths/Weaknesses] AI analysis completed`);

      return result;
    });

    // Save to database
    await step.run("save-strengths-weaknesses", async () => {
      await prisma.quizAnalysis.update({
        where: { id: analysisId },
        data: {
          strengths: analysis.strengths,
          weaknesses: analysis.weaknesses,
          insights: analysis.insight,
        },
      });

      console.log(`[Strengths/Weaknesses] Saved to analysis ${analysisId}`);
    });

    return {
      success: true,
      analysisId,
      strengthsCount: analysis.strengths?.length || 0,
      weaknessesCount: analysis.weaknesses?.length || 0,
    };
  }
);
