"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  SendHorizontal,
  SendIcon,
  Layers2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

import { QuizComponentProps, QuizWithRelations } from "../types";
import Question from "./Question";
import Results from "./Results";
import { useQuery } from "@tanstack/react-query";
import { CheckUser } from "@/app/(actions)/user/check-user";
import { useSaveQuizAttempt } from "../../hooks/useSaveQuizAttempts";

export default function QuizComponent({ quiz, quizId }: QuizComponentProps) {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [markedQuestions, setMarkedQuestions] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState((quiz.duration || 30) * 60);
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [userProfileExists, setUserProfileExists] = useState(false);
  const [toggleQuestionTraverser, setToggleQuestionTraverser] = useState(false);

  // Query to check user profile
  const { data: checkUserProfile, isLoading: isCheckingProfile } = useQuery({
    queryKey: ["checkUserProfile"],
    queryFn: () => CheckUser(),
    enabled: isLoaded && !!user,
  });

  const { mutateAsync: saveQuizAttempt, isPending: isSaving } =
    useSaveQuizAttempt();

  // Timer effect
  useEffect(() => {
    if (isTestSubmitted || showResults) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }

        if (prev === 60) {
          setShowTimeWarning(true);
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTestSubmitted, showResults]);

  // Profile check effect
  useEffect(() => {
    if (!isLoaded || isCheckingProfile) return;

    if (checkUserProfile?.exists) {
      setUserProfileExists(true);
    } else if (checkUserProfile?.exists === false) {
      router.push("/dashboard/profile");
    }
  }, [checkUserProfile, isLoaded, isCheckingProfile, router]);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle answer selection
  const handleAnswerSelect = (questionId: string, optionId: string) => {
    const question = quiz.questions.find((q) => q.id === questionId);

    if (!question?.isMultiSelect) {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: [optionId],
      }));
    } else {
      const currentAnswers = answers[questionId] || [];
      const updatedAnswers = currentAnswers.includes(optionId)
        ? currentAnswers.filter((id) => id !== optionId)
        : [...currentAnswers, optionId];

      setAnswers((prev) => ({
        ...prev,
        [questionId]: updatedAnswers,
      }));
    }
  };

  // Handle marking a question for review
  const toggleMarkQuestion = (questionId: string) => {
    setMarkedQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId],
    );
  };

  // Navigation
  const goToNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  // Calculate results
  const calculateResults = () => {
    let correct = 0;
    quiz.questions.forEach((question) => {
      const userAnswer = answers[question.id] || [];
      if (
        userAnswer.length === question.correctAnswer.length &&
        userAnswer.every((ans) => question.correctAnswer.includes(ans))
      ) {
        correct++;
      }
    });
    return correct;
  };

  // Submit test
  const handleSubmitTest = async () => {
    try {
      const response = await saveQuizAttempt({
        quiz,
        answers,
        timeTaken: (quiz.duration || 30) * 60 - timeLeft,
        score: calculateResults(),
      });

      if (response.success) {
        setIsTestSubmitted(true);
        setShowResults(true);
        setShowSubmitDialog(false);
      }
    } catch (error) {
      // Error is handled by the mutation's onError
      console.error("Error submitting test:", error);
    }
  };

  // Check if a question is answered
  const isQuestionAnswered = (questionId: string) => {
    return !!answers[questionId] && answers[questionId].length > 0;
  };

  // Get current question
  const currentQuestion = quiz.questions[currentQuestionIndex];

  // Calculate progress
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / quiz.questions.length) * 100);

  // Handle restart
  const handleRestart = () => {
    setAnswers({});
    setMarkedQuestions([]);
    setTimeLeft((quiz.duration || 30) * 60);
    setIsTestSubmitted(false);
    setShowResults(false);
    setCurrentQuestionIndex(0);
  };

  // Handle review
  const handleReview = () => {
    setShowResults(false);
    setCurrentQuestionIndex(0);
  };

  // Show loading state while checking profile
  if (!isLoaded || isCheckingProfile) {
    return (
      <div className="container max-h-[50%] flex items-center justify-center lg:max-w-7xl max-w-6xl mx-auto p-4 md:p-6 pt-16 md:pt-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResults) {
    return (
      <Results
        quiz={quiz}
        answers={answers}
        markedQuestions={markedQuestions}
        timeTaken={(quiz.duration || 30) * 60 - timeLeft}
        onRestart={handleRestart}
        onReview={handleReview}
      />
    );
  }

  return (
    <div className="container font-main  lg:max-w-7xl items-center   max-w-6xl mx-auto p-4 md:p-6 pt-16 md:pt-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>{quiz.title}</CardTitle>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div
                className={cn(
                  "flex items-center gap-1 px-3 py-1 rounded-full font-medium",
                  timeLeft <= 60
                    ? "bg-red-100 text-red-700"
                    : "bg-brand-beige-400/20 text-brand-beige-700",
                )}
              >
                <Clock className="h-4 w-4" />
                <span>{formatTime(timeLeft)}</span>
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      onClick={() => setShowSubmitDialog(true)}
                      className="rounded-full"
                    >
                      <Layers2 className="h-4 w-4" />
                      Submit Test
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Submit your test and see results</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-0 mt-3">
          <Progress value={progress} className="h-2" />
          <div className="flex items-center justify-between mb-2 px-2 py-1.5 mt-2  border border-gray-100/10 rounded-lg">
            <div className="md:text-sm text-xs font-mono hidden md:block">
              Progress: <span className="font-medium">{answeredCount}</span> of{" "}
              <span className="font-medium">{quiz.questions.length}</span>{" "}
              questions answered
            </div>
            <div className="md:text-sm md:hidden text-xs font-mono">
              <span className="font-medium">{currentQuestionIndex + 1}</span> /{" "}
              <span className="font-medium">{quiz.questions.length}</span>{" "}
            </div>
            <div className="md:text-sm text-xs font-mono">
              Question{" "}
              <span className="font-medium text-brand-beige-700">
                {currentQuestionIndex + 1}
              </span>{" "}
              of{" "}
              <span className="font-medium text-primary">
                {quiz.questions.length}
              </span>
            </div>
          </div>

          <div className="md:hidden flex flex-wrap gap-2 mt-4 mb-2">
            {markedQuestions.map((questionId, index) => (
              <Button
                key={questionId}
                variant="outline"
                size="sm"
                className="mb-2 md:hidden mt-2 border-brand-beige-80/20 text-brand-beige-900 dark:hover:bg-gray-100/10 dark:hover:text-gray-100 hover:accent hover:text-accent-foreground"
                onClick={() =>
                  goToQuestion(
                    quiz.questions.findIndex(
                      (question) => question.id === questionId,
                    ),
                  )
                }
              >
                {index + 1}
              </Button>
            ))}
          </div>

          {toggleQuestionTraverser && (
            <div className="md:flex hidden flex-wrap gap-2 mt-4 mb-2">
              {quiz.questions.map((question, index) => (
                <TooltipProvider key={question.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "w-10 h-10 p-0 dark:hover:bg-gray-100/10 dark:hover:text-gray-100 hover:accent hover:text-accent-foreground",
                          currentQuestionIndex === index
                            ? "border-primary border-2"
                            : "",
                          isQuestionAnswered(question.id)
                            ? "bg-primary text-primary-foreground hover:bg-primary/90 border-none"
                            : "",
                          markedQuestions.includes(question.id)
                            ? "ring-2 ring-amber-500"
                            : "",
                        )}
                        onClick={() => goToQuestion(index)}
                      >
                        {index + 1}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div>
                        {isQuestionAnswered(question.id)
                          ? "Answered"
                          : "Not answered"}
                        {markedQuestions.includes(question.id) &&
                          " • Marked for review"}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          )}
        </CardContent>

        <CardContent className="pt-6">
          {currentQuestion && (
            <Question
              question={currentQuestion}
              questionIndex={currentQuestionIndex}
              totalQuestions={quiz.questions.length}
              userAnswer={answers[currentQuestion.id] || []}
              onAnswerSelect={handleAnswerSelect}
              isMarked={markedQuestions.includes(currentQuestion.id)}
              onToggleMark={() => toggleMarkQuestion(currentQuestion.id)}
              type={currentQuestion.isMultiSelect ? "multiple" : "single"}
            />
          )}
        </CardContent>

        <CardFooter className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-1 hover:bg-gray-100/10 hover:text-gray-100"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <Button
            variant={
              currentQuestionIndex === quiz.questions.length - 1
                ? "default"
                : "default"
            }
            onClick={
              currentQuestionIndex === quiz.questions.length - 1
                ? () => setShowSubmitDialog(true)
                : goToNextQuestion
            }
            className="flex items-center gap-1"
          >
            {currentQuestionIndex === quiz.questions.length - 1 ? (
              <>Finish Test</>
            ) : (
              <>
                Next <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent className="max-w-lg rounded-lg md:w-full w-[90%] ">
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Test?</AlertDialogTitle>
            <AlertDialogDescription className="w-full flex items-center justify-center flex-col">
              You have answered {answeredCount} out of {quiz.questions.length}{" "}
              questions.
              {answeredCount < quiz.questions.length && (
                <span className="block mt-2 font-medium font-mono text-xs text-center w-[70%] text-amber-600">
                  Warning: You have {quiz.questions.length - answeredCount}{" "}
                  unanswered questions.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSaving}>
              Continue Test
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmitTest} disabled={isSaving}>
              {isSaving ? "Submiting..." : "Submit Test"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Time Warning Dialog */}
      <AlertDialog open={showTimeWarning} onOpenChange={setShowTimeWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Time Warning</AlertDialogTitle>
            <AlertDialogDescription>
              You have less than 1 minute remaining. The test will be
              automatically submitted when the timer reaches zero.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
