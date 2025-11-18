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
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg dark:border-gray-700 dark:from-blue-950 dark:to-purple-950">
        <div className="p-8 text-center">
          <div className="mb-4 flex justify-center">
            <div
              className={`rounded-full p-4 ${isPassing ? "bg-green-100 dark:bg-green-900" : "bg-orange-100 dark:bg-orange-900"}`}
            >
              <Trophy
                className={`h-12 w-12 ${isPassing ? "text-green-600 dark:text-green-300" : "text-orange-600 dark:text-orange-300"}`}
              />
            </div>
          </div>

          <h2 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            {getMessage()}
          </h2>

          <div className="mb-4">
            <div className="text-6xl font-bold text-blue-600 dark:text-blue-400">
              {percentage}%
            </div>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              {correctAnswers} out of {totalQuestions} correct
            </p>
          </div>

          <p className="mx-auto max-w-md text-gray-700 dark:text-gray-300">
            {getMotivation()}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="h-3 bg-gray-200 dark:bg-gray-700">
          <div
            className={`h-full transition-all ${isPassing ? "bg-green-500" : "bg-orange-500"}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-2 flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Target className="h-5 w-5" />
            <span className="text-sm font-medium">Accuracy</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {percentage}%
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-2 flex items-center gap-2 text-green-600 dark:text-green-400">
            <TrendingUp className="h-5 w-5" />
            <span className="text-sm font-medium">Correct</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {correctAnswers}/{totalQuestions}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-2 flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <Clock className="h-5 w-5" />
            <span className="text-sm font-medium">Questions</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {totalQuestions}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-8 dark:border-blue-800 dark:from-blue-950 dark:to-purple-950">
        <h3 className="mb-3 text-center text-2xl font-bold text-gray-900 dark:text-white">
          Ready to Master Your Certification?
        </h3>
        <p className="mb-6 text-center text-gray-700 dark:text-gray-300">
          Get access to 1000+ practice questions, AI-powered explanations,
          personalized study plans, and detailed progress tracking.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/onboarding"
            className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-3 text-center font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
          >
            Sign Up Free
          </Link>
          <button
            onClick={onTryAgain}
            className="rounded-lg border-2 border-gray-300 bg-white px-8 py-3 font-semibold text-gray-700 transition-all hover:scale-105 hover:border-blue-500 hover:bg-blue-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-blue-400 dark:hover:bg-blue-950"
          >
            Try Different Questions
          </button>
        </div>
      </div>

      {/* Features Highlight */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">
            What You'll Get
          </h4>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>1000+ practice questions across all certifications</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>AI-powered explanations for every answer</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Personalized study plans based on your progress</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Performance analytics and weak area identification</span>
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">
            Why CloudDojo?
          </h4>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-blue-500">★</span>
              <span>AI chatbot to answer your study questions 24/7</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">★</span>
              <span>Realistic exam simulations with timing</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">★</span>
              <span>Flashcards for quick concept review</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">★</span>
              <span>Track progress and get readiness assessment</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
