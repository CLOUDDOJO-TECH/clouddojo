"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProfileEssentials } from "./components/profile-essentials";
import { DiagnosticQuiz } from "./components/diagnostic-quiz";
import { ActivationResults } from "./components/activation-results";
import type { ActivationState, ProfileData } from "./types";
import { cn } from "@/lib/utils";

export default function ActivationPage() {
  const [state, setState] = useState<ActivationState>({
    step: 1,
    profile: {},
    quizAnswers: {},
    quizAttemptId: null,
    score: { correct: 0, total: 5 },
  });

  const handleProfileComplete = (profile: ProfileData) => {
    setState((prev) => ({
      ...prev,
      profile,
      step: 2,
    }));
  };

  const handleQuizComplete = (quizAttemptId: string, score: { correct: number; total: number }) => {
    setState((prev) => ({
      ...prev,
      quizAttemptId,
      score,
      step: 3,
    }));
  };

  const handleAnswerUpdate = (questionId: string, selectedOptions: string[]) => {
    setState((prev) => ({
      ...prev,
      quizAnswers: {
        ...prev.quizAnswers,
        [questionId]: selectedOptions,
      },
    }));
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 w-full">
      {/* Grid background */}
      <div
        className={cn(
          "absolute inset-0 -z-10",
          "bg-size-[20px_20px]",
          "bg-[radial-gradient(circle,#e5e5e5_1px,transparent_1px)]",
          "dark:bg-[radial-gradient(circle,#404040_1px,transparent_1px)]"
        )}
      />

      {/* Radial gradient overlay */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center bg-background mask-[radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-3xl space-y-8">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={cn(
                "h-2 rounded-full transition-all",
                step === state.step ? "w-12 bg-foreground" : "w-8 bg-foreground/20",
                step < state.step && "bg-emerald-500"
              )}
            />
          ))}
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          {state.step === 1 && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ProfileEssentials onComplete={handleProfileComplete} />
            </motion.div>
          )}

          {state.step === 2 && state.profile.certification && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DiagnosticQuiz
                certification={state.profile.certification}
                platform={state.profile.platform!}
                experience={state.profile.experience!}
                onComplete={handleQuizComplete}
                onAnswerUpdate={handleAnswerUpdate}
              />
            </motion.div>
          )}

          {state.step === 3 && state.quizAttemptId && (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ActivationResults
                quizAttemptId={state.quizAttemptId}
                score={state.score}
                profile={state.profile as ProfileData}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
