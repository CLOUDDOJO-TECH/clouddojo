"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, AlertCircle, Lightbulb } from "lucide-react";

export interface QuestionOption {
  id: string;
  content: string;
}

export interface Question {
  id: string;
  content: string;
  isMultiSelect: boolean;
  options: QuestionOption[];
  explanation?: string;
  awsService?: string;
  difficultyLevel?: string;
}

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (questionId: string, selectedOptionIds: string[]) => void;
  correctAnswers?: string[];
  isAnswered?: boolean;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  correctAnswers = [],
  isAnswered = false,
}: QuestionCardProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleOptionClick = (optionId: string) => {
    if (isAnswered) return;

    if (question.isMultiSelect) {
      setSelectedOptions((prev) =>
        prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const handleSubmit = () => {
    if (selectedOptions.length === 0) return;
    onAnswer(question.id, selectedOptions);
    setShowExplanation(true);
  };

  const isCorrect = (optionId: string) => {
    return correctAnswers.includes(optionId);
  };

  const userAnswerCorrect =
    isAnswered &&
    selectedOptions.length === correctAnswers.length &&
    selectedOptions.every((id) => correctAnswers.includes(id));

  return (
    <div className="w-full rounded-xl border border-border bg-background/50 p-6 backdrop-blur">
      {/* Question Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-500">
              Question {questionNumber} of {totalQuestions}
            </span>
            {question.difficultyLevel && (
              <span className="rounded-full bg-foreground/10 px-3 py-1 text-xs font-semibold text-foreground/60">
                {question.difficultyLevel}
              </span>
            )}
            {question.awsService && (
              <span className="rounded-full bg-foreground/10 px-3 py-1 text-xs font-semibold text-foreground/60">
                {question.awsService}
              </span>
            )}
          </div>
          {question.isMultiSelect && (
            <div className="mb-2 flex items-center gap-1 text-sm text-foreground/60">
              <AlertCircle className="h-4 w-4" />
              <span>Select all that apply</span>
            </div>
          )}
        </div>
      </div>

      {/* Question Text */}
      <p className="mb-6 text-lg font-medium leading-relaxed text-foreground">
        {question.content}
      </p>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedOptions.includes(option.id);
          const isCorrectOption = isCorrect(option.id);
          const showCorrect = isAnswered && isCorrectOption;
          const showIncorrect = isAnswered && isSelected && !isCorrectOption;

          return (
            <button
              key={option.id}
              onClick={() => handleOptionClick(option.id)}
              disabled={isAnswered}
              className={cn(
                "relative w-full rounded-lg border p-4 text-left transition-all",
                "disabled:cursor-not-allowed",
                !isAnswered && !isSelected && "border-border bg-background hover:bg-foreground/5",
                !isAnswered && isSelected && "border-emerald-500 bg-emerald-500/10",
                showCorrect && "border-emerald-500 bg-emerald-500/10",
                showIncorrect && "border-red-500/50 bg-red-500/10"
              )}
            >
              <div className="flex items-start gap-3">
                {/* Option Letter */}
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-semibold",
                    !isAnswered && !isSelected && "bg-foreground/10 text-foreground/60",
                    !isAnswered && isSelected && "bg-emerald-500 text-white",
                    showCorrect && "bg-emerald-500 text-white",
                    showIncorrect && "bg-red-500 text-white"
                  )}
                >
                  {String.fromCharCode(65 + index)}
                </span>

                {/* Option Text */}
                <span className="flex-1 pt-1 text-foreground">
                  {option.content}
                </span>

                {/* Result Icon */}
                {showCorrect && (
                  <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-500" />
                )}
                {showIncorrect && (
                  <XCircle className="h-6 w-6 shrink-0 text-red-500" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Submit Button */}
      {!isAnswered && (
        <button
          onClick={handleSubmit}
          disabled={selectedOptions.length === 0}
          className="mt-6 w-full rounded-lg border border-border bg-foreground px-6 py-3 font-semibold text-background transition-all hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Submit Answer
        </button>
      )}

      {/* Result & Explanation */}
      {isAnswered && (
        <div className="mt-6 space-y-4">
          {/* Result Banner */}
          <div
            className={cn(
              "rounded-lg border p-4",
              userAnswerCorrect
                ? "border-emerald-500/50 bg-emerald-500/10"
                : "border-red-500/50 bg-red-500/10"
            )}
          >
            <div className="flex items-center gap-3">
              {userAnswerCorrect ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
              ) : (
                <XCircle className="h-6 w-6 text-red-500" />
              )}
              <span
                className={cn(
                  "font-semibold",
                  userAnswerCorrect ? "text-emerald-500" : "text-red-500"
                )}
              >
                {userAnswerCorrect ? "Correct!" : "Incorrect"}
              </span>
            </div>
          </div>

          {/* Explanation */}
          {question.explanation && (
            <div className="rounded-lg border border-border bg-foreground/5 p-4">
              <div className="mb-2 flex items-center gap-2 text-foreground">
                <Lightbulb className="h-5 w-5 text-emerald-500" />
                <span className="font-semibold">Explanation</span>
              </div>
              <p className="text-sm leading-relaxed text-foreground/80">
                {question.explanation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
