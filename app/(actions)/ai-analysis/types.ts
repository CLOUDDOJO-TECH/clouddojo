export interface FormattedTestData {
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

export interface QuizQuestion {
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

export interface QuizAttempt {
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

export interface CategoryPerformance {
  categoryId: string
  _count: {
    _all: number
    isCorrect: number
  }
}

export interface ServicePerformance {
  awsService: string
  _count: {
    _all: number
    isCorrect: number
  }
}

export interface DifficultyPerformance {
  difficultyLevel: string
  _count: {
    _all: number
    isCorrect: number
  }
}

export interface TimeMetric {
  level: string
  averageTime: number
}

export interface TimeMetrics {
  totalTime: number
  averageTimePerQuestion: number
  timeByDifficulty: TimeMetric[]
}

export interface AttemptHistory {
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