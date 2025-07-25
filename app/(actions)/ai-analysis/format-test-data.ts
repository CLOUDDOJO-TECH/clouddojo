import { formatDuration, intervalToDuration } from "date-fns";
import type { TestData, FormattedTestData } from "./types";

// Helper function to safely convert potential BigInt values to numbers
const toNumber = (value: any): number => {
  if (typeof value === 'bigint') {
    return Number(value);
  }
  if (typeof value === 'number') {
    return value;
  }
  return 0;
};

export function formatTestDataForAI(data: TestData): FormattedTestData {
  const {
    quizAttempts,
    categoryPerformance,
    servicePerformance,
    difficultyPerformance,
    timeMetrics,
    performanceTrend
  } = data;

  // Ensure we have at least one attempt
  if (!quizAttempts?.length) {
    throw new Error("No quiz attempts available for analysis");
  }

  // Most recent attempt for primary metrics
  const primaryAttempt = quizAttempts[0];
  const user = primaryAttempt.user;

  // User details
  const userData = {
    id: user?.userId || 'unknown',
    name: user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'User',
    experience: user?.onboarding?.experience || null,
    preferredCertifications: user?.onboarding?.preferredCertifications || [],
    goals: user?.onboarding?.goals || []
  };

  // Current test details
  const currentTest = {
    id: primaryAttempt.id,
    name: primaryAttempt.quiz.title,
    category: primaryAttempt.quiz.category?.name || null,
    score: primaryAttempt.percentageScore,
    timeSpent: {
      seconds: primaryAttempt.timeSpentSecs,
      formatted: formatDuration(
        intervalToDuration({ start: 0, end: primaryAttempt.timeSpentSecs * 1000 })
      )
    },
    questionsTotal: primaryAttempt.questions.length,
    questionsCorrect: primaryAttempt.questions.filter(q => q.isCorrect).length,
    questionsIncorrect: primaryAttempt.questions.filter(q => !q.isCorrect).length,
    startedAt: primaryAttempt.startedAt.toISOString(),
    completedAt: primaryAttempt.completedAt?.toISOString() || null
  };

  // Category Performance
  const categoryPerformanceData = (categoryPerformance || []).map((cat: any) => ({
    category: cat.categoryName || "Unknown Category",
    totalQuestions: toNumber(cat._count__all),
    correctQuestions: toNumber(cat._count_isCorrect),
    accuracy: toNumber(cat.accuracyPercentage)
  })).filter(cat => cat.totalQuestions > 0);

  // Service Performance
  const servicePerformanceData = (servicePerformance || []).map((service: any) => ({
    service: service.awsService || "Unknown Service",
    totalQuestions: toNumber(service._count__all),
    correctQuestions: toNumber(service._count_isCorrect),
    accuracy: toNumber(service.accuracyPercentage)
  })).filter(service => service.totalQuestions > 0);

  // Difficulty Breakdown
  const difficultyBreakdown = (difficultyPerformance || []).map((diff: any) => ({
    level: diff.difficultyLevel || "Unknown",
    totalQuestions: toNumber(diff._count__all),
    correctQuestions: toNumber(diff._count_isCorrect),
    accuracy: toNumber(diff.accuracyPercentage),
    averageTime: timeMetrics.timeByDifficulty.find(
      (t: any) => t.level === diff.difficultyLevel
    )?.averageTime || 0
  })).filter(diff => diff.totalQuestions > 0);

  // Time Analysis
  const timeAnalysis = {
    total: {
      seconds: timeMetrics.totalTime,
      formatted: formatDuration(
        intervalToDuration({ start: 0, end: timeMetrics.totalTime * 1000 })
      )
    },
    averagePerQuestion: {
      seconds: timeMetrics.averageTimePerQuestion,
      formatted: formatDuration(
        intervalToDuration({ start: 0, end: timeMetrics.averageTimePerQuestion * 1000 })
      )
    },
    byDifficulty: (timeMetrics.timeByDifficulty || []).map((metric: any) => ({
      level: metric.level,
      averageSeconds: toNumber(metric.averageTime),
      formatted: formatDuration(
        intervalToDuration({ start: 0, end: toNumber(metric.averageTime) * 1000 })
      )
    }))
  };

  // Progress History
  const progressHistory = performanceTrend.map((trend, index) => ({
    testId: trend.testId,
    score: trend.score,
    date: typeof trend.date === 'string' ? trend.date : trend.date.toISOString(),
    improvement: index > 0 
      ? trend.score - performanceTrend[index - 1].score 
      : 0
  }));

  // Question Details - Limit to most recent test only for performance
  const questionDetails = primaryAttempt.questions.map((q) => ({
    id: q.questionId,
    content: q.question.content,
    category: q.question.category?.name || null,
    service: q.question.awsService || null,
    difficulty: q.question.difficultyLevel || "Unknown",
    isCorrect: q.isCorrect,
    timeSpent: {
      seconds: q.timeSpentSecs,
      formatted: formatDuration(
        intervalToDuration({ start: 0, end: q.timeSpentSecs * 1000 })
      )
    },
    userAnswer: q.userAnswer ? q.userAnswer.split(',') : [],
    correctAnswer: q.question.correctAnswer || []
  }));

  return {
    user: userData,
    currentTest,
    categoryPerformance: categoryPerformanceData,
    servicePerformance: servicePerformanceData,
    difficultyBreakdown,
    timeAnalysis,
    progressHistory,
    questionDetails
  };
} 