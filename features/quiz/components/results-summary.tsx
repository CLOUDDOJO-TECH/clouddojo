"use client";

import { Trophy, TrendingUp, Clock, Target } from "lucide-react";
import Link from "next/link";

interface ResultsSummaryProps {
  correctAnswers: number;
  totalQuestions: number;
  onTryAgain: () => void;
}

export function ResultsSummary({
  correctAnswers,
  totalQuestions,
  onTryAgain,
}: ResultsSummaryProps) {
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const isPassing = percentage >= 70;

  const getMessage = () => {
    if (percentage === 100) return "Perfect Score!";
    if (percentage >= 80) return "Excellent Work!";
    if (percentage >= 70) return "Good Job!";
    if (percentage >= 50) return "Keep Practicing!";
    return "Don't Give Up!";
  };

  const getMotivation = () => {
    if (percentage === 100)
      return "You're ready to ace the real exam! Sign up for 1000+ more questions.";
    if (percentage >= 70)
      return "You're on the right track! Join CloudDojo for personalized study plans and AI-powered insights.";
    return "Practice makes perfect! CloudDojo offers unlimited practice questions with detailed explanations to help you improve.";
  };

  return (
    <div className="w-full space-y-6">
      {/* Score Card */}
      <div className="overflow-hidden rounded-2xl border border-border bg-background/50 backdrop-blur">
        <div className="p-8 text-center">
          <div className="mb-4 flex justify-center">
            <div
              className={`rounded-full p-4 ${isPassing ? "bg-emerald-500/10" : "bg-orange-100 dark:bg-orange-900"}`}
            >
              <Trophy
                className={`h-12 w-12 ${isPassing ? "text-emerald-500" : "text-orange-600 dark:text-orange-300"}`}
              />
            </div>
          </div>

          <h2 className="mb-2 text-3xl font-bold text-foreground">
            {getMessage()}
          </h2>

          <div className="mb-4">
            <div className={`text-6xl font-bold ${isPassing ? "text-emerald-500" : "text-orange-600 dark:text-orange-400"}`}>
              {percentage}%
            </div>
            <p className="mt-2 text-lg text-foreground/60">
              {correctAnswers} out of {totalQuestions} correct
            </p>
          </div>

          <p className="mx-auto max-w-md text-foreground/80">
            {getMotivation()}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="h-3 bg-foreground/10">
          <div
            className={`h-full transition-all ${isPassing ? "bg-emerald-500" : "bg-orange-500"}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-background/50 p-6 backdrop-blur">
          <div className="mb-2 flex items-center gap-2 text-emerald-500">
            <Target className="h-5 w-5" />
            <span className="text-sm font-medium">Accuracy</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {percentage}%
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background/50 p-6 backdrop-blur">
          <div className="mb-2 flex items-center gap-2 text-emerald-500">
            <TrendingUp className="h-5 w-5" />
            <span className="text-sm font-medium">Correct</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {correctAnswers}/{totalQuestions}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background/50 p-6 backdrop-blur">
          <div className="mb-2 flex items-center gap-2 text-emerald-500">
            <Clock className="h-5 w-5" />
            <span className="text-sm font-medium">Questions</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {totalQuestions}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="rounded-2xl border border-border bg-background/50 p-8 backdrop-blur">
        <h3 className="mb-3 text-center text-2xl font-bold text-foreground">
          Ready to Master Your Certification?
        </h3>
        <p className="mb-6 text-center text-foreground/60">
          Get access to 1000+ practice questions, AI-powered explanations,
          personalized study plans, and detailed progress tracking.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/onboarding"
            className="rounded-lg border border-border bg-foreground px-8 py-3 text-center font-semibold text-background transition-all hover:bg-foreground/90"
          >
            Sign Up Free
          </Link>
          <button
            onClick={onTryAgain}
            className="rounded-lg border border-border bg-background px-8 py-3 font-semibold text-foreground transition-all hover:bg-foreground/5"
          >
            Try Different Questions
          </button>
        </div>
      </div>

      {/* Features Highlight */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-background/50 p-6 backdrop-blur">
          <h4 className="mb-2 font-semibold text-foreground">
            What You'll Get
          </h4>
          <ul className="space-y-2 text-sm text-foreground/60">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500">✓</span>
              <span>1000+ practice questions across all certifications</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500">✓</span>
              <span>AI-powered explanations for every answer</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500">✓</span>
              <span>Personalized study plans based on your progress</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500">✓</span>
              <span>Performance analytics and weak area identification</span>
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-background/50 p-6 backdrop-blur">
          <h4 className="mb-2 font-semibold text-foreground">
            Why CloudDojo?
          </h4>
          <ul className="space-y-2 text-sm text-foreground/60">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500">★</span>
              <span>AI chatbot to answer your study questions 24/7</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500">★</span>
              <span>Realistic exam simulations with timing</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500">★</span>
              <span>Flashcards for quick concept review</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500">★</span>
              <span>Track progress and get readiness assessment</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
