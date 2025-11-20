/**
 * Aggregation Helpers
 *
 * Functions to aggregate per-quiz analyses into dashboard metrics
 */

import {
  mean,
  calculateTrend,
  calculateConsistencyScore,
  countOccurrences,
  getTopN,
  isImproving,
  isDeclining,
  calculateLearningVelocity,
  predictCertificationReadiness,
} from "./calculations";
import { addWeeks } from "date-fns";

interface QuizAnalysis {
  id: string;
  quizAttemptId: string;
  userId: string;
  status: string;
  generatedAt: Date;
  categoryScores: any;
  timeEfficiency: string | null;
  strengths: any;
  weaknesses: any;
  recommendations: any;
  topicMastery: any;
  insights: string | null;
  quizScore: number | null;
  quizAttempt: {
    percentageScore: number;
    timeSpentSecs: number;
    totalScore: number;
  };
}

/**
 * Aggregate free tier metrics
 */
export function aggregateFreeMetrics(analyses: QuizAnalysis[]) {
  if (analyses.length === 0) {
    return {
      overallScore: 0,
      totalQuizzesTaken: 0,
      averageTimePerQuiz: 0,
      categoryBreakdown: {},
      recentTrend: "insufficient-data",
      consistencyScore: 0,
    };
  }

  // Overall score
  const scores = analyses.map((a) => a.quizAttempt.percentageScore);
  const overallScore = mean(scores);

  // Total quizzes
  const totalQuizzesTaken = analyses.length;

  // Average time per quiz
  const times = analyses.map((a) => a.quizAttempt.timeSpentSecs);
  const averageTimePerQuiz = Math.round(mean(times));

  // Category breakdown - average scores per category
  const categoryScores: Record<string, number[]> = {};

  analyses.forEach((analysis) => {
    if (analysis.categoryScores) {
      Object.entries(analysis.categoryScores).forEach(([category, data]: [string, any]) => {
        if (!categoryScores[category]) {
          categoryScores[category] = [];
        }
        // Extract percentage from category score data
        const percentage =
          typeof data === "object" ? data.percentage || data.score || 0 : data;
        categoryScores[category].push(percentage);
      });
    }
  });

  const categoryBreakdown: Record<string, { avgScore: number; quizCount: number }> = {};
  Object.entries(categoryScores).forEach(([category, scores]) => {
    categoryBreakdown[category] = {
      avgScore: Math.round(mean(scores)),
      quizCount: scores.length,
    };
  });

  // Recent trend
  const recentScores = scores.slice(0, Math.min(10, scores.length));
  const recentTrend = calculateTrend(recentScores);

  // Consistency score
  const consistencyScore = calculateConsistencyScore(scores);

  return {
    overallScore: Math.round(overallScore),
    totalQuizzesTaken,
    averageTimePerQuiz,
    categoryBreakdown,
    recentTrend,
    consistencyScore,
  };
}

/**
 * Aggregate premium tier metrics
 */
export function aggregatePremiumMetrics(analyses: QuizAnalysis[], userTier: string) {
  if (analyses.length === 0 || userTier === "free") {
    return {};
  }

  const scores = analyses.map((a) => a.quizAttempt.percentageScore);

  // Certification readiness
  const prediction = predictCertificationReadiness(scores);
  const certificationReadiness = prediction.readinessScore;

  // Estimated ready date
  const quizzesPerWeek = 3; // Assumption
  const weeksNeeded = Math.ceil(prediction.estimatedQuizzesNeeded / quizzesPerWeek);
  const estimatedReadyDate = prediction.ready ? new Date() : addWeeks(new Date(), weeksNeeded);

  // Top strengths (aggregate from all analyses)
  const allStrengths: string[] = [];
  analyses.forEach((analysis) => {
    if (analysis.strengths && Array.isArray(analysis.strengths)) {
      allStrengths.push(...analysis.strengths);
    }
  });
  const strengthCounts = countOccurrences(allStrengths);
  const topStrengths = getTopN(strengthCounts, 5).map((s) => ({
    strength: s.item,
    frequency: s.count,
  }));

  // Top weaknesses
  const allWeaknesses: string[] = [];
  analyses.forEach((analysis) => {
    if (analysis.weaknesses && Array.isArray(analysis.weaknesses)) {
      allWeaknesses.push(...analysis.weaknesses);
    }
  });
  const weaknessCounts = countOccurrences(allWeaknesses);
  const topWeaknesses = getTopN(weaknessCounts, 5).map((w) => ({
    weakness: w.item,
    frequency: w.count,
  }));

  // Trending categories (improving/declining)
  const categoryTrends = analyzeCategoryTrends(analyses);
  const trendingUp = categoryTrends.improving;
  const trendingDown = categoryTrends.declining;

  // Learning velocity
  const learningVelocity = calculateLearningVelocity(scores);

  // Percentile rank (will be calculated by comparing to all users)
  const percentileRank = null; // Calculated separately with all users' data

  return {
    certificationReadiness,
    topStrengths,
    topWeaknesses,
    trendingUp,
    trendingDown,
    estimatedReadyDate,
    percentileRank,
    learningVelocity,
  };
}

/**
 * Analyze category trends (which categories are improving or declining)
 */
function analyzeCategoryTrends(analyses: QuizAnalysis[]): {
  improving: Array<{ category: string; improvement: number }>;
  declining: Array<{ category: string; decline: number }>;
} {
  const categoryScores: Record<string, number[]> = {};

  // Collect scores chronologically (oldest first)
  const reversedAnalyses = [...analyses].reverse();

  reversedAnalyses.forEach((analysis) => {
    if (analysis.categoryScores) {
      Object.entries(analysis.categoryScores).forEach(([category, data]: [string, any]) => {
        if (!categoryScores[category]) {
          categoryScores[category] = [];
        }
        const percentage =
          typeof data === "object" ? data.percentage || data.score || 0 : data;
        categoryScores[category].push(percentage);
      });
    }
  });

  const improving: Array<{ category: string; improvement: number }> = [];
  const declining: Array<{ category: string; decline: number }> = [];

  Object.entries(categoryScores).forEach(([category, scores]) => {
    if (scores.length < 2) return;

    if (isImproving(scores)) {
      const improvement = scores[scores.length - 1] - scores[0];
      improving.push({ category, improvement: Math.round(improvement) });
    } else if (isDeclining(scores)) {
      const decline = scores[0] - scores[scores.length - 1];
      declining.push({ category, decline: Math.round(decline) });
    }
  });

  // Sort by improvement/decline magnitude
  improving.sort((a, b) => b.improvement - a.improvement);
  declining.sort((a, b) => b.decline - a.decline);

  return {
    improving: improving.slice(0, 5), // Top 5
    declining: declining.slice(0, 5), // Top 5
  };
}

/**
 * Calculate overall percentile rank (compared to all users)
 */
export async function calculatePercentileRank(
  userId: string,
  userScore: number,
  prisma: any
): Promise<number> {
  // Get all users' overall scores
  const allScores = await prisma.dashboardAnalysis.findMany({
    where: {
      overallScore: { not: null },
    },
    select: { overallScore: true },
  });

  if (allScores.length === 0) return 50; // Default to 50th percentile

  const sortedScores = allScores
    .map((a: any) => a.overallScore!)
    .sort((a: number, b: number) => a - b);

  const rank = sortedScores.filter((score: number) => score <= userScore).length;
  const percentile = (rank / sortedScores.length) * 100;

  return Math.round(percentile);
}
