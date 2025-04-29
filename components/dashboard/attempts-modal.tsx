"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SquareArrowOutUpRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useGetQuizAttempts } from "@/app/dashboard/hooks/useQuizAttempt";
import AttemptResults from "@/app/dashboard/practice/components/AttemptResults";
import { QuizWithRelations } from "@/app/dashboard/practice/types";
import { useRouter } from "next/navigation";

interface QuizAttemptQuestion {
  id: string;
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  timeSpentSecs: number;
  categoryId: string | null;
  difficultyLevel: string;
  awsService: string | null;
  quizAttemptId: string;
  question: {
    content: string | null;
    explanation: string | null;
    isMultiSelect: boolean;
    options: {
      id: string;
      content: string;
      questionId: string;
      isCorrect: boolean;
    }[];
  };
}

export function AttemptsDialog({ attemptId }: { attemptId: string }) {
  const router = useRouter();
  const { quizAttemptsData, quizAttemptLoading, quizAttemptError } = useGetQuizAttempts({attemptId});
  
  // Transform the data for AttemptResults component
  const transformedQuiz = quizAttemptsData ? {
    ...quizAttemptsData.quiz,
    category: quizAttemptsData.category,
    questions: quizAttemptsData.questions.map((q: QuizAttemptQuestion) => {
      // Find correct options from options array
      const correctOptions = q.question?.options
        ?.filter(opt => opt.isCorrect)
        .map(opt => opt.id) || [];
        
      return {
        id: q.questionId,
        content: q.question?.content || "",
        explanation: q.question?.explanation || "",
        isMultiSelect: q.question?.isMultiSelect || false,
        options: q.question?.options || [],
        correctAnswer: correctOptions,
        categoryId: q.categoryId || null,
        difficultyLevel: q.difficultyLevel || "BEGINNER",
        awsService: q.awsService || null
      };
    })
  } : null;

  // Transform answers data
  const transformedAnswers = quizAttemptsData ? 
    quizAttemptsData.questions.reduce((acc: Record<string, string[]>, q: QuizAttemptQuestion) => {
      return {
        ...acc,
        [q.questionId]: q.userAnswer ? q.userAnswer.split(',') : []
      };
    }, {}) : {};

  // Empty array for markedQuestions since we don't track them in attempts
  const markedQuestions: string[] = [];

  // No-op handler functions since we're just viewing
  const handleRestart = () => {};
  const handleReview = () => {};

  if (quizAttemptLoading) {
    return <div>Loading...</div>;
  }

  if (quizAttemptError) {
    return <div>Error loading quiz attempt</div>;
  }

  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
                <SquareArrowOutUpRight className="h-6 w-6 text-gray-700 cursor-pointer" />
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>View Result</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <DialogContent className="md:max-w-7xl max-h-[90vh] w-[98vw] overflow-y-auto md:px-6 rounded-lg">
        {transformedQuiz && (
          <AttemptResults 
            quiz={transformedQuiz as QuizWithRelations}
            answers={transformedAnswers}
            markedQuestions={markedQuestions}
            timeTaken={quizAttemptsData?.timeSpentSecs || 0}
            onRestart={handleRestart}
            onReview={handleReview}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
