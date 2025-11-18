"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, Loader2 } from "lucide-react";
import Link from "next/link";
import { trpc } from "@/src/lib/trpc/react";
import { QuestionCard } from "@/components/demo/question-card";
import { ResultsSummary } from "@/components/demo/results-summary";

interface QuizSession {
  questions: Array<{
    id: string;
    text: string;
    difficulty: string | null;
    service: string | null;
    isMultiSelect: boolean;
    options: Array<{
      id: string;
      text: string;
    }>;
    quizTitle: string;
  }>;
  mode: "practice" | "timed" | "exam";
  timeLimit?: number;
  provider: string;
}

interface AnswerState {
  [questionId: string]: {
    selectedOptions: string[];
    correctOptions: string[];
    isCorrect: boolean;
  };
}

type SessionStep = "taking-quiz" | "view-results";

export default function QuizSessionPage() {
  const router = useRouter();
  const [session, setSession] = useState<QuizSession | null>(null);
  const [step, setStep] = useState<SessionStep>("taking-quiz");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerState>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [timerExpired, setTimerExpired] = useState(false);

  // Load quiz session from sessionStorage
  useEffect(() => {
    const sessionData = sessionStorage.getItem("customQuizSession");
    if (!sessionData) {
      router.push("/quiz-builder");
      return;
    }

    try {
      const parsed: QuizSession = JSON.parse(sessionData);
      setSession(parsed);

      // Initialize timer for timed mode
      if (parsed.mode === "timed" && parsed.timeLimit) {
        setTimeRemaining(parsed.timeLimit * 60); // Convert to seconds
      }
    } catch (error) {
      console.error("Error loading quiz session:", error);
      router.push("/quiz-builder");
    }
  }, [router]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0 || step !== "taking-quiz") {
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          setTimerExpired(true);
          setStep("view-results");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, step]);

  // tRPC mutation for verifying answers
  const verifyMutation = trpc.quiz.verifyAnswer.useMutation({
    onSuccess: (
      data: { isCorrect: boolean; correctOptionIds: string[]; explanation: string | null; questionText: string | null },
      variables: { questionId: string; selectedOptionIds: string[] }
    ) => {
      setAnswers((prev) => ({
        ...prev,
        [variables.questionId]: {
          selectedOptions: variables.selectedOptionIds,
          correctOptions: data.correctOptionIds,
          isCorrect: data.isCorrect,
        },
      }));
    },
    onError: (error: Error) => {
      console.error("Error verifying answer:", error.message);
    },
  });

  const handleAnswer = async (questionId: string, selectedOptionIds: string[]) => {
    verifyMutation.mutate({
      questionId,
      selectedOptionIds,
    });
  };

  const handleNext = () => {
    if (!session) return;

    if (currentQuestionIndex < session.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setStep("view-results");
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleTryAgain = () => {
    sessionStorage.removeItem("customQuizSession");
    router.push("/quiz-builder");
  };

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAF9] dark:bg-background">
        <div className="flex items-center gap-2 text-foreground/60">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading quiz session...</span>
        </div>
      </div>
    );
  }

  const currentQuestion = session.questions[currentQuestionIndex];
  const isQuestionAnswered = currentQuestion ? !!answers[currentQuestion.id] : false;
  const totalAnswered = Object.keys(answers).length;
  const correctAnswersCount = Object.values(answers).filter((a) => a.isCorrect).length;

  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] dark:bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/50 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link
              href="/quiz-builder"
              className="flex items-center gap-2 text-foreground/60 transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Exit Quiz</span>
            </Link>

            {/* Timer for timed mode */}
            {session.mode === "timed" && timeRemaining !== null && step === "taking-quiz" && (
              <div
                className={`flex items-center gap-2 rounded-lg border px-4 py-2 font-mono text-lg font-semibold ${
                  timeRemaining < 60
                    ? "border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400"
                    : "border-border bg-background text-foreground"
                }`}
              >
                <Clock className="h-5 w-5" />
                {formatTime(timeRemaining)}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Taking Quiz */}
        {step === "taking-quiz" && currentQuestion && (
          <div className="space-y-6">
            {/* Quiz Header */}
            <div className="text-center">
              <h1 className="mb-2 text-3xl font-bold text-foreground">
                {session.provider} Custom Quiz
              </h1>
              <p className="text-foreground/60">
                {session.mode === "practice"
                  ? "Practice mode - Take your time"
                  : session.mode === "timed"
                    ? "Timed mode - Answer quickly!"
                    : "Exam mode - Simulating real exam conditions"}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-foreground/60">
                <span>
                  Question {currentQuestionIndex + 1} of {session.questions.length}
                </span>
                <span>
                  {totalAnswered} / {session.questions.length} answered
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-foreground/10">
                <div
                  className="h-full bg-emerald-500 transition-all"
                  style={{
                    width: `${((currentQuestionIndex + 1) / session.questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Question Card */}
            <QuestionCard
              question={{
                id: currentQuestion.id,
                content: currentQuestion.text,
                isMultiSelect: currentQuestion.isMultiSelect,
                options: currentQuestion.options.map((opt) => ({
                  id: opt.id,
                  content: opt.text,
                })),
                awsService: currentQuestion.service || undefined,
                difficultyLevel: currentQuestion.difficulty || undefined,
              }}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={session.questions.length}
              onAnswer={handleAnswer}
              correctAnswers={answers[currentQuestion.id]?.correctOptions || []}
              isAnswered={isQuestionAnswered}
            />

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="rounded-lg border border-border bg-background px-6 py-3 font-semibold text-foreground transition-all hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              <button
                onClick={handleNext}
                disabled={!isQuestionAnswered && session.mode !== "exam"}
                className="rounded-lg border border-border bg-foreground px-6 py-3 font-semibold text-background transition-all hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {currentQuestionIndex === session.questions.length - 1
                  ? "View Results"
                  : "Next Question"}
              </button>
            </div>

            {/* Exam mode note */}
            {session.mode === "exam" && !isQuestionAnswered && (
              <p className="text-center text-sm text-foreground/60">
                In exam mode, you can skip questions and answer them later
              </p>
            )}
          </div>
        )}

        {/* Results */}
        {step === "view-results" && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="mb-2 text-3xl font-bold text-foreground">
                {timerExpired ? "Time's Up!" : "Quiz Complete!"}
              </h1>
              <p className="text-foreground/60">
                {timerExpired
                  ? "Your time has expired. Here are your results."
                  : "Here's how you did on your custom quiz"}
              </p>
            </div>

            <ResultsSummary
              correctAnswers={correctAnswersCount}
              totalQuestions={session.questions.length}
              onTryAgain={handleTryAgain}
            />

            {/* Additional Stats for Timed/Exam Mode */}
            {(session.mode === "timed" || session.mode === "exam") && (
              <div className="rounded-2xl border border-border bg-background p-6">
                <h3 className="mb-4 font-semibold text-foreground">Quiz Stats</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-border bg-background/50 p-4">
                    <div className="text-sm text-foreground/60">Questions Answered</div>
                    <div className="text-2xl font-bold text-foreground">
                      {totalAnswered} / {session.questions.length}
                    </div>
                  </div>
                  <div className="rounded-lg border border-border bg-background/50 p-4">
                    <div className="text-sm text-foreground/60">Accuracy</div>
                    <div className="text-2xl font-bold text-foreground">
                      {totalAnswered > 0
                        ? `${Math.round((correctAnswersCount / totalAnswered) * 100)}%`
                        : "0%"}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
