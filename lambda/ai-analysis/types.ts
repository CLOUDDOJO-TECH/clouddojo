export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  startedAt: Date;
  completedAt: Date | null;
  timeSpentSecs: number;
  percentageScore: number;
  questions: QuestionAttempt[];
  quiz: {
    title: string;
    category: {
      name: string;
    } | null;
  };
}

export interface QuestionAttempt {
  id: string;
  questionId: string;
  quizAttemptId: string;
  isCorrect: boolean;
  timeSpentSecs: number;
  userAnswer: string;
  question: {
    id: string;
    content: string;
    category: {
      name: string;
    } | null;
    awsService: string | null;
    difficultyLevel: string;
    correctAnswer: string[];
  };
}

export interface TestData {
  quizAttempts: QuizAttempt[];
  categoryPerformance: CategoryPerformance[];
  servicePerformance: ServicePerformance[];
  difficultyPerformance: DifficultyPerformance[];
  timeMetrics: TimeMetrics;
  performanceTrend: PerformanceTrend[];
}

export interface CategoryPerformance {
  categoryId: string;
  categoryName: string;
  _count__all: number;
  _count_isCorrect: number;
  accuracyPercentage: number;
}

export interface ServicePerformance {
  awsService: string;
  _count__all: number;
  _count_isCorrect: number;
  accuracyPercentage: number;
}

export interface DifficultyPerformance {
  difficultyLevel: string;
  _count__all: number;
  _count_isCorrect: number;
  accuracyPercentage: number;
}

export interface TimeMetrics {
  totalTime: number;
  averageTimePerQuestion: number;
  timeByDifficulty: TimeByDifficulty[];
}

export interface TimeByDifficulty {
  level: string;
  averageTime: number;
}

export interface PerformanceTrend {
  testId: string;
  testName: string;
  score: number;
  date: Date | string;
} 