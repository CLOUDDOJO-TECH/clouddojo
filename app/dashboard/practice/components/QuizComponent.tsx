"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  ChevronLeft,
  ChevronRight,
  SendHorizontal,
  SendIcon,
  Layers2,
  Bookmark,
  Grid3X3,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

import { QuizComponentProps, QuizWithRelations } from "../types";
import Question from "./Question";
import ExpandableClock from "./ExpandableClock";
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
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [userProfileExists, setUserProfileExists] = useState(false);
  const [toggleQuestionTraverser, setToggleQuestionTraverser] = useState(false);
  const [questionNavOpen, setQuestionNavOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

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
    if (isTestSubmitted || isPaused) return;

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
  }, [isTestSubmitted, isPaused]);

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
      const current = answers[questionId] || [];
      setAnswers((prev) => ({
        ...prev,
        [questionId]: current.includes(optionId) ? [] : [optionId],
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

      if (response.success && response.data) {
        setIsTestSubmitted(true);
        setShowSubmitDialog(false);
        router.push(`/dashboard/practice/results/${response.data.id}`);
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

  // Handle timer reset from clock controls
  const handleTimerReset = () => {
    setTimeLeft((quiz.duration || 30) * 60);
    setCurrentQuestionIndex(0);
    setIsPaused(false);
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

  return (
    <div className="container font-main lg:max-w-7xl items-center max-w-6xl mx-auto p-4 md:p-6 pt-16 md:pt-6 min-h-[calc(100vh-4rem)]">
      <Card className="border-dashed border-border/60 min-h-[calc(100vh-7rem)] relative">
        {/* Hanging Clock */}
        <ExpandableClock
          timeLeft={timeLeft}
          isWarning={timeLeft <= 60}
          isPaused={isPaused}
          formatTime={formatTime}
          onPause={() => setIsPaused(true)}
          onResume={() => setIsPaused(false)}
          onReset={handleTimerReset}
        />

        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>{quiz.title}</CardTitle>
            </div>

            <div className="flex items-center justify-between gap-2">
              <Popover open={questionNavOpen} onOpenChange={setQuestionNavOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-md gap-1.5"
                  >
                    <Grid3X3 className="h-4 w-4" />
                    <span className="hidden sm:inline">Questions</span>
                    {markedQuestions.length > 0 && (
                      <Badge className="bg-amber-500 text-white hover:bg-amber-500 rounded-full px-1.5 py-0 text-[10px] min-w-[1.25rem] flex items-center justify-center">
                        {markedQuestions.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[320px] p-4 z-50 shadow-xl shadow-black/20 dark:shadow-black/40" align="end" side="bottom" sideOffset={4} avoidCollisions={false}>
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Question Navigator</h4>
                    <TooltipProvider delayDuration={200}>
                      <div className="grid grid-cols-8 gap-1.5">
                        {quiz.questions.map((question, index) => {
                          const answered = isQuestionAnswered(question.id);
                          const flagged = markedQuestions.includes(question.id);
                          const current = currentQuestionIndex === index;
                          const tooltipParts = [
                            current ? "Current" : "",
                            answered ? "Answered" : "Unanswered",
                          ].filter(Boolean);
                          const tooltipColor = flagged
                            ? "text-amber-500"
                            : answered
                              ? "text-primary"
                              : "text-muted-foreground";

                          return (
                            <Tooltip key={question.id}>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => {
                                    goToQuestion(index);
                                    setQuestionNavOpen(false);
                                  }}
                                  className={cn(
                                    "w-8 h-8 rounded-md text-xs font-medium transition-colors",
                                    current
                                      ? "ring-2 ring-inset ring-primary bg-primary/10 text-primary"
                                      : answered
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted/50 text-muted-foreground hover:bg-muted",
                                    flagged && "ring-2 ring-inset ring-amber-500"
                                  )}
                                >
                                  {index + 1}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="top" className={cn("text-xs", tooltipColor)}>
                                {tooltipParts.join(" · ")}
                              </TooltipContent>
                            </Tooltip>
                          );
                        })}
                      </div>
                    </TooltipProvider>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-sm bg-primary" /> Answered
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-sm bg-muted/50" /> Unanswered
                      </span>
                      <span className="flex items-center gap-1">
                        Bookmarked <span className="text-amber-500/70">{markedQuestions.length > 0 && `(${markedQuestions.length})`}</span>
                      </span>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      onClick={() => setShowSubmitDialog(true)}
                      className="rounded-md"
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
          <div className="flex items-center gap-3 mt-1 mb-2">
            <Progress value={progress} className="h-2 flex-1" />
            <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">
              {currentQuestionIndex + 1}/{quiz.questions.length}
            </span>
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
                          " • Bookmarked"}
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
        <AlertDialogContent className="max-w-sm rounded-lg border-dashed border-border/60 md:w-full w-[90%] p-6">
          <AlertDialogHeader className="space-y-3">
            <AlertDialogTitle className="text-center text-xl">
              Submit Test
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  You&apos;ve completed{" "}
                  <span className="font-semibold text-foreground">
                    {answeredCount}
                  </span>
                  /{quiz.questions.length} questions.
                  {answeredCount < quiz.questions.length
                    ? " Are you sure you want to submit?"
                    : " Ready to see your results?"}
                </p>
                {answeredCount < quiz.questions.length && (
                  <div className="rounded-md border border-dashed border-amber-500/30 px-3 py-2">
                    <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
                      Unanswered questions will be marked incorrect.
                    </p>
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex-row gap-3 sm:justify-center">
            <AlertDialogCancel
              disabled={isSaving}
              className="flex-1 rounded-md"
            >
              Continue Test
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmitTest}
              disabled={isSaving}
              className="flex-1 rounded-md"
            >
              {isSaving ? "Submitting..." : "Submit Test"}
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
