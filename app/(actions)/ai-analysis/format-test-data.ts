import { formatDistanceToNow, formatDuration, intervalToDuration } from "date-fns"

interface FormattedTestData {
  user: {
    id: string
    name: string
    experience: string | null
    preferredCertifications: string[]
    goals: string[]
  }
  currentTest: {
    id: string
    name: string
    category: string | null
    score: number
    timeSpent: {
      seconds: number
      formatted: string
    }
    questionsTotal: number
    questionsCorrect: number
    questionsIncorrect: number
    startedAt: string
    completedAt: string | null
  }
  categoryPerformance: Array<{
    category: string | null
    totalQuestions: number
    correctQuestions: number
    accuracy: number
  }>
  servicePerformance: Array<{
    service: string | null
    totalQuestions: number
    correctQuestions: number
    accuracy: number
  }>
  difficultyBreakdown: Array<{
    level: string | null
    totalQuestions: number
    correctQuestions: number
    accuracy: number
    averageTime: number
  }>
  timeAnalysis: {
    total: {
      seconds: number
      formatted: string
    }
    averagePerQuestion: {
      seconds: number
      formatted: string
    }
    byDifficulty: Array<{
      level: string
      averageSeconds: number
      formatted: string
    }>
  }
  progressHistory: Array<{
    testId: string
    score: number
    date: string
    improvement: number
  }>
  questionDetails: Array<{
    id: string
    content: string
    category: string | null
    service: string | null
    difficulty: string
    isCorrect: boolean
    timeSpent: {
      seconds: number
      formatted: string
    }
    userAnswer: string[]
    correctAnswer: string[]
  }>
}

// Add interfaces for the data parameters
interface QuizQuestion {
  isCorrect: boolean
  questionId: string
  question: {
    content: string
    category?: {
      name: string
    }
    categoryId?: string
    awsService: string
    difficultyLevel?: string
    correctAnswer: string[]
  }
  timeSpentSecs: number
  userAnswer: string
}

interface QuizAttempt {
  id: string
  quiz: {
    title: string
    category?: {
      name: string
      id?: string
      description?: string | null
    } | null
  }
  percentageScore: number
  timeSpentSecs: number
  questions: QuizQuestion[]
  startedAt: Date
  completedAt?: Date
  user?: {
    userId: string
    firstName?: string
    lastName?: string
    onboarding?: {
      experience?: string
      preferredCertifications?: string[]
      goals?: string[]
    }
  }
}

interface CategoryPerformance {
  categoryId: string
  _count: {
    _all: number
    isCorrect: number
  }
}

interface ServicePerformance {
  awsService: string
  _count: {
    _all: number
    isCorrect: number
  }
}

interface DifficultyPerformance {
  difficultyLevel: string
  _count: {
    _all: number
    isCorrect: number
  }
}

interface TimeMetric {
  level: string
  averageTime: number
}

interface TimeMetrics {
  totalTime: number
  averageTimePerQuestion: number
  timeByDifficulty: TimeMetric[]
}

interface AttemptHistory {
  id: string
  percentageScore: number
  completedAt?: Date
  startedAt: Date
}

export interface TestData {
  quizAttempts: QuizAttempt[]
  categoryPerformance: CategoryPerformance[]
  servicePerformance: ServicePerformance[]
  difficultyPerformance: DifficultyPerformance[]
  timeMetrics: TimeMetrics
  performanceTrend: Array<{
    testId: string
    testName: string
    score: number
    date: string | Date
  }>
}

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
  } = data

  // Ensure we have at least one attempt
  if (quizAttempts.length === 0) {
    throw new Error("No quiz attempts available for analysis")
  }

  // Most recent attempt for primary metrics
  const primaryAttempt = quizAttempts[0]
  const user = primaryAttempt.user

  // User details
  const userData = {
    id: user?.userId || 'unknown',
    name: user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'User',
    experience: user?.onboarding?.experience || null,
    preferredCertifications: user?.onboarding?.preferredCertifications || [],
    goals: user?.onboarding?.goals || []
  }

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
  }

  // Category Performance
  const categoryPerformanceData = (categoryPerformance || []).map((cat: any) => ({
    category: cat.categoryName || "Unknown Category",
    totalQuestions: toNumber(cat._count__all),
    correctQuestions: toNumber(cat._count_isCorrect),
    accuracy: toNumber(cat.accuracyPercentage)
  })).filter(cat => cat.totalQuestions > 0)

  // Service Performance
  const servicePerformanceData = (servicePerformance || []).map((service: any) => ({
    service: service.awsService || "Unknown Service",
    totalQuestions: toNumber(service._count__all),
    correctQuestions: toNumber(service._count_isCorrect),
    accuracy: toNumber(service.accuracyPercentage)
  })).filter(service => service.totalQuestions > 0)

  // Difficulty Breakdown
  const difficultyBreakdown = (difficultyPerformance || []).map((diff: any) => ({
    level: diff.difficultyLevel || "Unknown",
    totalQuestions: toNumber(diff._count__all),
    correctQuestions: toNumber(diff._count_isCorrect),
    accuracy: toNumber(diff.accuracyPercentage),
    averageTime: timeMetrics.timeByDifficulty.find(
      (t: any) => t.level === diff.difficultyLevel
    )?.averageTime || 0
  })).filter(diff => diff.totalQuestions > 0)

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
  }

  // Progress History
  const progressHistory = performanceTrend.map((trend, index) => ({
    testId: trend.testId,
    score: trend.score,
    date: trend.date instanceof Date 
      ? trend.date.toISOString() 
      : trend.date,
    improvement: index > 0 
      ? trend.score - performanceTrend[index - 1].score 
      : 0
  }))

  // Question Details
  const questionDetails = quizAttempts.flatMap(attempt => 
    attempt.questions.map((q: QuizQuestion) => ({
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
    }))
  )

  return {
    user: userData,
    currentTest,
    categoryPerformance: categoryPerformanceData,
    servicePerformance: servicePerformanceData,
    difficultyBreakdown,
    timeAnalysis,
    progressHistory,
    questionDetails
  }
} 