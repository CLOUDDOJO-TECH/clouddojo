/**
 * Topic Mastery Tracker (PREMIUM tier)
 *
 * Tracks mastery score for individual AWS services/topics over time.
 * Updates the TopicMastery table to show trends and identify weak spots.
 */

import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/prisma";

export const analyzeTopicMastery = inngest.createFunction(
  {
    id: "analyze-topic-mastery",
    name: "Analyze Topic Mastery",
    retries: 1,
  },
  { event: "quiz/analyze-topic-mastery" },
  async ({ event, step }) => {
    const { analysisId, quizData, tier } = event.data;

    if (tier === "free") {
      console.log(`[Topic Mastery] Skipping - user is on free tier`);
      return { skipped: true, reason: "premium-only" };
    }

    const topicScores = await step.run("calculate-topic-mastery", async () => {
      console.log(`[Topic Mastery] Calculating mastery for quiz ${quizData.attempt.id}`);

      // Group questions by AWS service/topic
      const topics: Record<string, { correct: number; total: number }> = {};

      quizData.questions.forEach((q: any) => {
        // Use AWS service if available, otherwise category
        const topic = q.awsService || q.category;

        if (!topics[topic]) {
          topics[topic] = { correct: 0, total: 0 };
        }

        topics[topic].total++;
        if (q.isCorrect) {
          topics[topic].correct++;
        }
      });

      const scores = Object.entries(topics).map(([topic, stats]) => ({
        topic,
        score: Math.round((stats.correct / stats.total) * 100),
        questionsAnswered: stats.total,
      }));

      console.log(`[Topic Mastery] Calculated mastery for ${scores.length} topics`);

      return scores;
    });

    // Update TopicMastery table
    await step.run("update-topic-mastery-table", async () => {
      await Promise.all(
        topicScores.map(async ({ topic, score, questionsAnswered }) => {
          // Get previous mastery to calculate trend
          const existing = await prisma.topicMastery.findUnique({
            where: {
              userId_topic: {
                userId: quizData.user.id,
                topic,
              },
            },
          });

          let trend: string;
          if (!existing) {
            trend = "new";
          } else if (score > existing.masteryScore) {
            trend = "improving";
          } else if (score < existing.masteryScore) {
            trend = "declining";
          } else {
            trend = "stable";
          }

          await prisma.topicMastery.upsert({
            where: {
              userId_topic: {
                userId: quizData.user.id,
                topic,
              },
            },
            update: {
              masteryScore: score,
              questionsAnswered: {
                increment: questionsAnswered,
              },
              lastPracticed: new Date(),
              trend,
            },
            create: {
              userId: quizData.user.id,
              topic,
              masteryScore: score,
              questionsAnswered,
              trend: "new",
            },
          });
        })
      );

      console.log(`[Topic Mastery] Updated ${topicScores.length} topic records`);
    });

    // Save topic mastery summary to QuizAnalysis
    await step.run("save-topic-mastery-to-analysis", async () => {
      const masteryData = topicScores.reduce((acc, { topic, score }) => {
        acc[topic] = score;
        return acc;
      }, {} as Record<string, number>);

      await prisma.quizAnalysis.update({
        where: { id: analysisId },
        data: { topicMastery: masteryData },
      });

      console.log(`[Topic Mastery] Saved to analysis ${analysisId}`);
    });

    return {
      success: true,
      analysisId,
      topicsTracked: topicScores.length,
    };
  }
);
