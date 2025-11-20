"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc/react";
import type { ExperienceLevel, CloudPlatform } from "../types";
import { saveActivationQuizAttempt } from "@/app/(actions)/activation/save-activation-quiz";
import { toast } from "sonner";

interface QuestionOption {
  id: string;
  text: string;
}

interface Question {
  id: string;
  text: string;
  difficulty: string;
  service: string;
  isMultiSelect: boolean;
  options: QuestionOption[];
}

interface AnswerState {
  [questionId: string]: {
    selectedOptions: string[];
    correctOptions: string[];
    isCorrect: boolean;
  };
}

interface DiagnosticQuizProps {
  certification: string;
  platform: CloudPlatform;
  experience: ExperienceLevel;
  onComplete: (quizAttemptId: string, score: { correct: number; total: number }) => void;
  onAnswerUpdate: (questionId: string, selectedOptions: string[]) => void;
}

export function DiagnosticQuiz({
  certification,
  platform,
  experience,
  onComplete,
  onAnswerUpdate,
}: DiagnosticQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerState>({});
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch questions
  const { data: questions, isLoading } = trpc.quiz.getPublicQuestions.useQuery({
    provider: platform,
    limit: 5,
  });

  // Verify answer mutation
  const verifyMutation = trpc.quiz.verifyAnswer.useMutation({
    onSuccess: (data, variables) => {
      setAnswers((prev) => ({
        ...prev,
        [variables.questionId]: {
          selectedOptions: variables.selectedOptionIds,
          correctOptions: data.correctOptionIds,
          isCorrect: data.isCorrect,
        },
      }));
      onAnswerUpdate(variables.questionId, variables.selectedOptionIds);
    },
  });

  const currentQuestion = questions?.[currentQuestionIndex];
  const isQuestionAnswered = currentQuestion ? !!answers[currentQuestion.id] : false;
  const totalAnswered = Object.keys(answers).length;

  const handleOptionClick = (optionId: string) => {
    if (isQuestionAnswered) return;

    if (currentQuestion?.isMultiSelect) {
      setSelectedOptions((prev) =>
        prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]
      );
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const handleSubmitAnswer = () => {
    if (!currentQuestion || selectedOptions.length === 0) return;

    verifyMutation.mutate({
      questionId: currentQuestion.id,
      selectedOptionIds: selectedOptions,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < (questions?.length || 0) - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptions([]);
    } else {
      handleCompleteQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setSelectedOptions([]);
    }
  };

  const handleCompleteQuiz = async () => {
    if (!questions) return;

    setIsSubmitting(true);

    try {
      // Calculate score
      const correctCount = Object.values(answers).filter((a) => a.isCorrect).length;
      const totalQuestions = questions.length;

      // Save quiz attempt with activation flag
      const result = await saveActivationQuizAttempt({
        questionIds: questions.map((q) => q.id),
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          questionId,
          selectedOptionIds: answer.selectedOptions,
        })),
        score: Math.round((correctCount / totalQuestions) * 100),
        certification,
        platform,
        experience,
      });

      if (result.success && result.data) {
        onComplete(result.data.attemptId, {
          correct: correctCount,
          total: totalQuestions,
        });
      } else {
        toast.error("Failed to save quiz results. Please try again.");
      }
    } catch (error) {
      console.error("Error completing quiz:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-border bg-background p-12">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-foreground/60" />
          <p className="text-foreground/60">Preparing your diagnostic quiz...</p>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-background p-8 text-center">
        <p className="text-foreground/60">No questions available. Please try again.</p>
      </div>
    );
  }

  if (!currentQuestion) return null;

  const userAnswer = answers[currentQuestion.id];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-border bg-background p-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold text-foreground">Diagnostic Assessment</h2>
          <p className="text-foreground/60">Answer these questions to assess your current knowledge</p>
        </div>

        {/* Progress */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-sm text-foreground/60">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>{totalAnswered} / {questions.length} answered</span>
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
      </div>

      {/* Question */}
      <div className="rounded-2xl border border-border bg-background p-6">
        {/* Question header */}
        <div className="mb-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-500">
              Question {currentQuestionIndex + 1}
            </span>
            {currentQuestion.difficulty && (
              <span className="rounded-full bg-foreground/10 px-3 py-1 text-xs font-semibold text-foreground/60">
                {currentQuestion.difficulty}
              </span>
            )}
            {currentQuestion.service && (
              <span className="rounded-full bg-foreground/10 px-3 py-1 text-xs font-semibold text-foreground/60">
                {currentQuestion.service}
              </span>
            )}
          </div>
          {currentQuestion.isMultiSelect && (
            <div className="text-sm text-foreground/60">Select all that apply</div>
          )}
        </div>

        {/* Question text */}
        <p className="mb-6 text-lg font-medium text-foreground">{currentQuestion.text}</p>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedOptions.includes(option.id) || userAnswer?.selectedOptions.includes(option.id);
            const isCorrect = userAnswer?.correctOptions.includes(option.id);
            const showFeedback = isQuestionAnswered;

            return (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option.id)}
                disabled={isQuestionAnswered}
                className={`w-full rounded-lg border p-4 text-left transition-all ${
                  showFeedback
                    ? isCorrect
                      ? "border-emerald-500 bg-emerald-500/10"
                      : isSelected
                        ? "border-red-500 bg-red-500/10"
                        : "border-border bg-background"
                    : isSelected
                      ? "border-foreground bg-foreground/5"
                      : "border-border bg-background hover:border-foreground/40"
                } ${isQuestionAnswered ? "cursor-not-allowed" : "cursor-pointer"}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 h-5 w-5 rounded-full border-2 transition-all ${
                      showFeedback
                        ? isCorrect
                          ? "border-emerald-500 bg-emerald-500"
                          : isSelected
                            ? "border-red-500 bg-red-500"
                            : "border-border"
                        : isSelected
                          ? "border-foreground bg-foreground"
                          : "border-border"
                    }`}
                  >
                    {(isSelected || isCorrect) && (
                      <div className={`h-full w-full rounded-full ${showFeedback ? "bg-background" : "bg-background"} scale-[0.4]`} />
                    )}
                  </div>
                  <span className="flex-1 text-foreground">{option.text}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Submit button */}
        {!isQuestionAnswered && (
          <Button
            onClick={handleSubmitAnswer}
            disabled={selectedOptions.length === 0 || verifyMutation.isPending}
            className="mt-6 w-full bg-foreground text-background hover:bg-foreground/90"
          >
            {verifyMutation.isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Checking...
              </>
            ) : (
              "Submit Answer"
            )}
          </Button>
        )}

        {/* Result feedback */}
        {isQuestionAnswered && (
          <div className={`mt-6 rounded-lg border p-4 ${userAnswer.isCorrect ? "border-emerald-500/20 bg-emerald-500/10" : "border-orange-500/20 bg-orange-500/10"}`}>
            <div className={`font-semibold ${userAnswer.isCorrect ? "text-emerald-500" : "text-orange-500"}`}>
              {userAnswer.isCorrect ? "✓ Correct!" : "✗ Incorrect"}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          variant="outline"
          className="border-border"
        >
          <ArrowLeft className="h-5 w-5" />
          Previous
        </Button>

        <Button
          onClick={handleNext}
          disabled={!isQuestionAnswered || isSubmitting}
          className="bg-foreground text-background hover:bg-foreground/90"
        >
          {currentQuestionIndex === questions.length - 1 ? (
            isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : (
              "View Results"
            )
          ) : (
            <>
              Next Question
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
