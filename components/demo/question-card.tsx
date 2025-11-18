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
    <div className="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      {/* Question Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-900 dark:text-blue-300">
              Question {questionNumber} of {totalQuestions}
            </span>
            {question.difficultyLevel && (
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold",
                  question.difficultyLevel === "BEGINER" &&
                    "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300",
                  question.difficultyLevel === "INTERMEDIATE" &&
                    "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300",
                  question.difficultyLevel === "ADVANCED" &&
                    "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300",
                  question.difficultyLevel === "EXPERT" &&
                    "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                )}
              >
                {question.difficultyLevel}
              </span>
            )}
            {question.awsService && (
              <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-600 dark:bg-purple-900 dark:text-purple-300">
                {question.awsService}
              </span>
            )}
          </div>
          {question.isMultiSelect && (
            <div className="mb-2 flex items-center gap-1 text-sm text-amber-600 dark:text-amber-400">
              <AlertCircle className="h-4 w-4" />
              <span>Select all that apply</span>
            </div>
          )}
        </div>
      </div>

      {/* Question Text */}
      <p className="mb-6 text-lg font-medium leading-relaxed text-gray-900 dark:text-white">
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
                "relative w-full rounded-lg border-2 p-4 text-left transition-all",
                "hover:scale-[1.02] disabled:cursor-not-allowed",
                !isAnswered && !isSelected && "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800",
                !isAnswered && isSelected && "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950",
                showCorrect && "border-green-500 bg-green-50 dark:border-green-400 dark:bg-green-950",
                showIncorrect && "border-red-500 bg-red-50 dark:border-red-400 dark:bg-red-950"
              )}
            >
              <div className="flex items-start gap-3">
                {/* Option Letter */}
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-semibold",
                    !isAnswered && !isSelected && "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
                    !isAnswered && isSelected && "bg-blue-500 text-white",
                    showCorrect && "bg-green-500 text-white",
                    showIncorrect && "bg-red-500 text-white"
                  )}
                >
                  {String.fromCharCode(65 + index)}
                </span>

                {/* Option Text */}
                <span className="flex-1 pt-1 text-gray-900 dark:text-white">
                  {option.content}
                </span>

                {/* Result Icon */}
                {showCorrect && (
                  <CheckCircle2 className="h-6 w-6 shrink-0 text-green-500" />
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
          className="mt-6 w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 font-semibold text-white transition-all hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
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
              "rounded-lg border-2 p-4",
              userAnswerCorrect
                ? "border-green-500 bg-green-50 dark:border-green-400 dark:bg-green-950"
                : "border-red-500 bg-red-50 dark:border-red-400 dark:bg-red-950"
            )}
          >
            <div className="flex items-center gap-3">
              {userAnswerCorrect ? (
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              ) : (
                <XCircle className="h-6 w-6 text-red-500" />
              )}
              <span
                className={cn(
                  "font-semibold",
                  userAnswerCorrect ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"
                )}
              >
                {userAnswerCorrect ? "Correct!" : "Incorrect"}
              </span>
            </div>
          </div>

          {/* Explanation */}
          {question.explanation && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
              <div className="mb-2 flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <Lightbulb className="h-5 w-5" />
                <span className="font-semibold">Explanation</span>
              </div>
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {question.explanation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
