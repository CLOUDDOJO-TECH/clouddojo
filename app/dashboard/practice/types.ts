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

export interface AttemptQuestion {
  id: string;
  userAnswer: string;
  isCorrect: boolean;
  question: {
    content: string;
    explanation: string | null;
    isMultiSelect: boolean;
    options: QuestionOption[];
    correctAnswer: string[];
  };
}

export interface AttemptData {
  id: string;
  quizId: string;
  totalScore: number;
  percentageScore: number;
  timeSpentSecs: number;
  questions: AttemptQuestion[];
  quiz: Quiz & { title: string };
  category: Category | null;
}

export interface ResultsProps {
  attempt: AttemptData;
}