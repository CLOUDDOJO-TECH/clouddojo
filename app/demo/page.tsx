"use client";

import { useState, useEffect } from "react";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ProviderSelector, PROVIDERS } from "@/components/demo/provider-selector";
import { QuestionCard, Question } from "@/components/demo/question-card";
import { ResultsSummary } from "@/components/demo/results-summary";

interface ApiResponse {
  success: boolean;
  data?: {
    quizTitle: string;
    quizDescription: string;
    provider: string;
    category: string;
    questions: Question[];
  };
  error?: string;
}

interface AnswerState {
  [questionId: string]: {
    selectedOptions: string[];
    correctOptions: string[];
    isCorrect: boolean;
  };
}

type DemoStep = "select-provider" | "taking-quiz" | "view-results";

export default function DemoPage() {
  const [step, setStep] = useState<DemoStep>("select-provider");
  const [selectedProvider, setSelectedProvider] = useState<string>("AWS");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerState>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizInfo, setQuizInfo] = useState<{
    title: string;
    description: string;
  } | null>(null);

  const fetchQuestions = async (provider: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/demo/questions?provider=${provider}&limit=10`
      );
      const data: ApiResponse = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || "Failed to fetch questions");
      }

      setQuestions(data.data.questions);
      setQuizInfo({
        title: data.data.quizTitle,
        description: data.data.quizDescription || "",
      });
      setCurrentQuestionIndex(0);
      setAnswers({});
      setStep("taking-quiz");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load questions"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleProviderSelect = (provider: string) => {
    setSelectedProvider(provider);
  };

  const handleStartQuiz = () => {
    fetchQuestions(selectedProvider);
  };

  const handleAnswer = async (questionId: string, selectedOptionIds: string[]) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;

    try {
      // Verify answer with backend
      const response = await fetch("/api/demo/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId,
          selectedOptionIds,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAnswers((prev) => ({
          ...prev,
          [questionId]: {
            selectedOptions: selectedOptionIds,
            correctOptions: data.data.correctOptionIds,
            isCorrect: data.data.isCorrect,
          },
        }));
      }
    } catch (error) {
      console.error("Error verifying answer:", error);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
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
    setStep("select-provider");
    setAnswers({});
    setCurrentQuestionIndex(0);
    setQuestions([]);
    setQuizInfo(null);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isQuestionAnswered = currentQuestion
    ? !!answers[currentQuestion.id]
    : false;

  // Calculate results
  const totalAnswered = Object.keys(answers).length;
  const correctAnswersCount = Object.values(answers).filter(
    (a) => a.isCorrect
  ).length;

  return (
    <div className="min-h-screen bg-[#FAFAF9] dark:bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/50 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-foreground/60 transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <Link
              href="/onboarding"
              className="rounded-lg border border-border bg-foreground px-6 py-2 font-semibold text-background transition-all hover:bg-foreground/90"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Step 1: Provider Selection */}
        {step === "select-provider" && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="mb-4 text-4xl font-bold text-foreground">
                Try CloudDojo Free
              </h1>
              <p className="text-lg text-foreground/60">
                Experience real certification practice questions with AI-powered
                explanations. No signup required.
              </p>
            </div>

            <ProviderSelector
              selectedProvider={selectedProvider}
              onProviderChange={handleProviderSelect}
              disabled={loading}
            />

            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-center text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="text-center">
              <button
                onClick={handleStartQuiz}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-foreground px-8 py-4 text-lg font-semibold text-background transition-all hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading Questions...
                  </>
                ) : (
                  <>
                    Start Practice Quiz
                    <span className="rounded-full bg-background/20 px-3 py-1 text-sm">
                      10 Questions
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Features Preview */}
            <div className="mt-12 rounded-2xl border border-border bg-background/50 p-8 backdrop-blur">
              <h3 className="mb-6 text-center text-xl font-bold text-foreground">
                What You'll Experience
              </h3>
              <div className="grid gap-6 sm:grid-cols-3">
                <div className="text-center">
                  <div className="mb-3 flex justify-center">
                    <div className="rounded-full bg-emerald-500/10 p-4">
                      <svg
                        className="h-6 w-6 text-emerald-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <h4 className="mb-2 font-semibold text-foreground">
                    Real Exam Questions
                  </h4>
                  <p className="text-sm text-foreground/60">
                    Actual certification-style questions
                  </p>
                </div>

                <div className="text-center">
                  <div className="mb-3 flex justify-center">
                    <div className="rounded-full bg-emerald-500/10 p-4">
                      <svg
                        className="h-6 w-6 text-emerald-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    </div>
                  </div>
                  <h4 className="mb-2 font-semibold text-foreground">
                    AI Explanations
                  </h4>
                  <p className="text-sm text-foreground/60">
                    Understand why answers are correct
                  </p>
                </div>

                <div className="text-center">
                  <div className="mb-3 flex justify-center">
                    <div className="rounded-full bg-emerald-500/10 p-4">
                      <svg
                        className="h-6 w-6 text-emerald-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <h4 className="mb-2 font-semibold text-foreground">
                    Instant Feedback
                  </h4>
                  <p className="text-sm text-foreground/60">
                    See results and track progress
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Taking Quiz */}
        {step === "taking-quiz" && currentQuestion && (
          <div className="space-y-6">
            {/* Quiz Header */}
            <div className="text-center">
              <h1 className="mb-2 text-3xl font-bold text-foreground">
                {quizInfo?.title || "Practice Quiz"}
              </h1>
              {quizInfo?.description && (
                <p className="text-foreground/60">
                  {quizInfo.description}
                </p>
              )}
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-foreground/60">
                <span>
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span>
                  {totalAnswered} / {questions.length} answered
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-foreground/10">
                <div
                  className="h-full bg-emerald-500 transition-all"
                  style={{
                    width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Question Card */}
            <QuestionCard
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              onAnswer={handleAnswer}
              correctAnswers={
                answers[currentQuestion.id]?.correctOptions || []
              }
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
                disabled={!isQuestionAnswered}
                className="rounded-lg border border-border bg-foreground px-6 py-3 font-semibold text-background transition-all hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {currentQuestionIndex === questions.length - 1
                  ? "View Results"
                  : "Next Question"}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {step === "view-results" && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="mb-2 text-3xl font-bold text-foreground">
                Quiz Complete!
              </h1>
              <p className="text-foreground/60">
                Here's how you did
              </p>
            </div>

            <ResultsSummary
              correctAnswers={correctAnswersCount}
              totalQuestions={questions.length}
              onTryAgain={handleTryAgain}
            />
          </div>
        )}
      </main>
    </div>
  );
}
