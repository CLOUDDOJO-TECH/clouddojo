"use client"

import {
  CheckCircle,
  XCircle,
  AlertCircle,
  CheckSquare,
  Square,
  Circle,
  CheckCircle2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { QuizWithRelations } from "../types"
import { Fragment } from "react"
import { Separator } from "@/components/ui/separator"

interface QuestionAnalysisProps {
  quiz: QuizWithRelations;
  answers: Record<string, string[]>;
}

export default function QuestionAnalysis({ quiz, answers }: QuestionAnalysisProps) {
  return (
    <div className="flex flex-col gap-6 my-2">
      {quiz.questions.map((question, index) => {
        const userAnswer = answers[question.id] || []
        const isCorrect =
          userAnswer.length === question.correctAnswer.length &&
          userAnswer.every((ans) => question.correctAnswer.includes(ans))
        const isSkipped = userAnswer.length === 0

        return (
          <Fragment key={question.id}>
            {index > 0 && <Separator className="bg-orange-200" />}
            <div className="rounded-lg p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "mt-1 flex-shrink-0 w-6 h-6 rounded-full md:flex items-center justify-center hidden",
                    isCorrect
                      ? "bg-green-100 text-green-600"
                      : isSkipped
                        ? "bg-amber-100 text-amber-600"
                        : "bg-red-100 text-red-600",
                  )}
                >
                  {isCorrect ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : isSkipped ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-bold">Question {index + 1}</h3>
                    <div
                      className={cn(
                        "text-sm font-medium",
                        isCorrect ? "text-green-600" : isSkipped ? "text-amber-600" : "text-red-600",
                      )}
                    >
                      {isCorrect ? "Correct" : isSkipped ? "Skipped" : "Incorrect"}
                    </div>
                  </div>

                  <p className="mt-1">{question.content}</p>

                  <div className="mt-3 space-y-2">
                    {question.options.map((option) => {
                      const isSelected = userAnswer.includes(option.id)
                      const isCorrectOption = question.correctAnswer.includes(option.id)

                      return (
                        <div
                          key={option.id}
                          className={cn(
                            "flex items-center p-2 rounded-md text-sm text-foreground font-normal",
                            isCorrectOption
                              ? "border border-green-200/50"
                              : isSelected && !isCorrectOption
                                ? " border border-red-200/50"
                                : "  border-gray-200",
                          )}
                        >
                          <div className="mr-2 ">
                            {question.isMultiSelect ? (
                              isSelected ? (
                                <CheckSquare
                                  className={cn("h-4 w-4", isCorrectOption ? "text-green-600" : "text-red-600")}
                                />
                              ) : (
                                <Square
                                  className={cn(
                                    "h-4 w-4",
                                    isCorrectOption ? "text-green-600" : "text-gray-400",
                                  )}
                                />
                              )
                            ) : isSelected ? (
                              <Circle
                                className={cn(
                                  "h-4 w-4 fill-current",
                                  isCorrectOption ? "text-green-600" : "text-red-600",
                                )}
                              />
                            ) : (
                              <Circle
                                className={cn(
                                  "h-4 w-4",
                                  isCorrectOption ? "text-green-600 fill-current" : "text-gray-400",
                                )}
                              />
                            )}
                          </div>
                          <span className={cn(isCorrectOption ? "font-medium" : "")}>{option.content}</span>
                          {isCorrectOption && <CheckCircle2 className="ml-auto h-4 w-4 text-green-600" />}
                          {!isCorrectOption && isSelected && (
                            <XCircle className="ml-auto h-4 w-4 text-red-600" />
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {question.explanation && (
                    <div className="mt-3 text-sm bg-blue-50 font-mono border border-blue-200 p-3 rounded-md">
                      <div className="font-medium text-blue-800">Explanation:</div>
                      <div className="text-blue-700 mt-1">{question.explanation}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Fragment>
        )
      })}
    </div>
  )
} 