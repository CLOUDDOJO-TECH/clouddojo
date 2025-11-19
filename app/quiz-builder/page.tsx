"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Sparkles, Play } from "lucide-react";
import { trpc } from "@/src/lib/trpc/react";
import {
  QuizBuilderFilters,
  type QuizFilters,
} from "@/features/quiz/components/quiz-builder-filters";

export default function QuizBuilderPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<QuizFilters>({
    provider: "AWS",
    limit: 10,
    mode: "practice",
  });
  const [shouldFetchQuestions, setShouldFetchQuestions] = useState(false);

  // Fetch filtered questions based on current filters
  const {
    data: questions,
    isLoading,
    error,
  } = trpc.quiz.getFilteredQuestions.useQuery(
    {
      provider: filters.provider,
      limit: filters.limit,
      ...(filters.categoryId && { categoryId: filters.categoryId }),
      ...(filters.difficulty && { difficulty: filters.difficulty }),
      ...(filters.service && { service: filters.service }),
      ...(filters.isMultiSelect !== undefined && { isMultiSelect: filters.isMultiSelect }),
    },
    {
      enabled: shouldFetchQuestions,
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );

  // Preview: Get question count without actually fetching questions
  const { data: previewQuestions } = trpc.quiz.getFilteredQuestions.useQuery(
    {
      provider: filters.provider,
      limit: filters.limit,
      ...(filters.categoryId && { categoryId: filters.categoryId }),
      ...(filters.difficulty && { difficulty: filters.difficulty }),
      ...(filters.service && { service: filters.service }),
      ...(filters.isMultiSelect !== undefined && { isMultiSelect: filters.isMultiSelect }),
    },
    {
      enabled: !shouldFetchQuestions, // Only preview when not fetching
      refetchOnWindowFocus: false,
      staleTime: 1000 * 30, // Cache preview for 30 seconds
    }
  );

  const handleStartQuiz = () => {
    setShouldFetchQuestions(true);
  };

  const handleFiltersChange = (newFilters: QuizFilters) => {
    setFilters(newFilters);
    setShouldFetchQuestions(false); // Reset when filters change
  };

  // Redirect to quiz session when questions are loaded
  if (shouldFetchQuestions && questions && questions.length > 0) {
    // Store quiz data in sessionStorage
    sessionStorage.setItem(
      "customQuizSession",
      JSON.stringify({
        questions,
        mode: filters.mode,
        timeLimit: filters.timeLimit,
        provider: filters.provider,
      })
    );
    router.push("/quiz-session");
    return null;
  }

  const availableQuestions = previewQuestions?.length || 0;
  const hasFilters = !!(
    filters.categoryId ||
    filters.difficulty ||
    filters.service ||
    filters.isMultiSelect !== undefined
  );

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
              href="/demo"
              className="text-sm text-foreground/60 transition-colors hover:text-foreground"
            >
              Try Demo Instead
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <Sparkles className="h-8 w-8 text-emerald-500" />
              <h1 className="text-4xl font-bold text-foreground">
                Custom Quiz Builder
              </h1>
            </div>
            <p className="text-lg text-foreground/60">
              Create your perfect practice quiz with advanced filters and customization
            </p>
          </div>

          {/* Quiz Builder Filters */}
          <div className="rounded-2xl border border-border bg-background p-6 shadow-sm sm:p-8">
            <QuizBuilderFilters onFiltersChange={handleFiltersChange} />
          </div>

          {/* Preview & Start Button */}
          <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
              <div className="text-center sm:text-left">
                <div className="mb-2 flex items-center justify-center gap-2 sm:justify-start">
                  <h3 className="text-lg font-semibold text-foreground">
                    Ready to Start
                  </h3>
                  {hasFilters && (
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      Custom Filters Applied
                    </span>
                  )}
                </div>
                <p className="text-sm text-foreground/60">
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading your custom quiz...
                    </span>
                  ) : availableQuestions > 0 ? (
                    <>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {availableQuestions} questions
                      </span>{" "}
                      available with your current filters
                    </>
                  ) : (
                    <span className="text-orange-600 dark:text-orange-400">
                      No questions match your filters. Try adjusting them.
                    </span>
                  )}
                </p>
              </div>

              <button
                onClick={handleStartQuiz}
                disabled={isLoading || availableQuestions === 0}
                className="flex items-center gap-2 rounded-lg border border-border bg-foreground px-8 py-4 text-lg font-semibold text-background transition-all hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5" />
                    Start Quiz
                    <span className="rounded-full bg-background/20 px-3 py-1 text-sm">
                      {filters.limit} Questions
                    </span>
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-center text-sm text-red-600 dark:text-red-400">
                Error loading questions: {error.message}
              </div>
            )}
          </div>

          {/* Info Cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-background/50 p-4 text-center">
              <div className="mb-2 text-2xl">🎯</div>
              <div className="font-semibold text-foreground">
                {filters.mode === "practice"
                  ? "Practice Mode"
                  : filters.mode === "timed"
                    ? "Timed Mode"
                    : "Exam Mode"}
              </div>
              <div className="text-sm text-foreground/60">
                {filters.mode === "practice"
                  ? "Learn at your own pace"
                  : filters.mode === "timed"
                    ? `${filters.timeLimit} minute time limit`
                    : "Realistic exam simulation"}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-background/50 p-4 text-center">
              <div className="mb-2 text-2xl">
                {filters.provider === "AWS"
                  ? "☁️"
                  : filters.provider === "Azure"
                    ? "🔷"
                    : filters.provider === "GCP"
                      ? "🌩️"
                      : filters.provider === "Kubernetes"
                        ? "⎈"
                        : filters.provider === "Terraform"
                          ? "🏗️"
                          : "🐳"}
              </div>
              <div className="font-semibold text-foreground">{filters.provider}</div>
              <div className="text-sm text-foreground/60">Cloud Provider</div>
            </div>

            <div className="rounded-lg border border-border bg-background/50 p-4 text-center">
              <div className="mb-2 text-2xl">📊</div>
              <div className="font-semibold text-foreground">
                {filters.limit} Questions
              </div>
              <div className="text-sm text-foreground/60">
                {filters.difficulty
                  ? `${filters.difficulty.charAt(0) + filters.difficulty.slice(1).toLowerCase()} level`
                  : "All difficulty levels"}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
