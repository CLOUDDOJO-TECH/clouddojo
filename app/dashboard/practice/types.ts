import { QuestionOption, Question as PrismaQuestion, Quiz, Category } from "@prisma/client";

// Extend the Prisma Question type to include correctAnswer
interface ExtendedQuestion extends PrismaQuestion {
  correctAnswer: string[];
  options: QuestionOption[];
}

export interface QuizWithRelations extends Quiz {
  questions: ExtendedQuestion[];
  category: Category | null;
}

export interface TestCardProps {
  quiz: QuizWithRelations;
  view: "grid" | "list";
}

export interface ActivityItem {
  id: string;
  quizId: string;
  quizTitle: string;
  category: {
    name: string;
    id: string;
  };
  score: number;
  duration: number;
  completedAt: Date | string;
  formattedDate: string;
};

export interface QuizComponentProps {
  quiz: QuizWithRelations;
  quizId: string;
}

export interface QuestionProps {
  question: ExtendedQuestion;
  questionIndex: number;
  totalQuestions: number;
  userAnswer: string[];
  onAnswerSelect: (questionId: string, optionId: string) => void;
  isMarked: boolean;
  onToggleMark: () => void;
  type: "single" | "multiple";
}

export interface ResultsProps {
  quiz: QuizWithRelations;
  answers: Record<string, string[]>;
  markedQuestions: string[];
  timeTaken: number;
  onRestart: () => void;
  onReview: () => void;
} 