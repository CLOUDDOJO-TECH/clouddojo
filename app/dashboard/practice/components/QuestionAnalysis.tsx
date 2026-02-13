"use client"

import {
  XCircle,
  CheckSquare,
  Square,
  Circle,
} from "lucide-react"
import IconCircleHalfDottedCheckFillDuo18 from "@/components/icons/circle-half-dotted-check"
import IconCheckFill12 from "@/components/icons/check-fill"
import { cn } from "@/lib/utils"
import { AttemptQuestion } from "../types"
import { Fragment, useState } from "react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

const PAGE_SIZE = 5

interface QuestionAnalysisProps {
  questions: AttemptQuestion[];
}

export default function QuestionAnalysis({ questions }: QuestionAnalysisProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const visibleQuestions = questions.slice(0, visibleCount)
  const hasMore = visibleCount < questions.length

  return (
    <div className="flex flex-col gap-6 my-2">
      {visibleQuestions.map((qa, index) => {
        const userAnswer = qa.userAnswer ? qa.userAnswer.split(',').filter(Boolean) : []
        const isCorrect = qa.isCorrect
        const isSkipped = userAnswer.length === 0
        const { question } = qa

        return (
          <Fragment key={qa.id}>
            {index > 0 && <Separator className="bg-border" />}
            <div className="rounded-lg p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "mt-2.5 flex-shrink-0 w-2.5 h-2.5 rounded-full",
                    isCorrect
                      ? "bg-green-500"
                      : isSkipped
                        ? "bg-amber-500"
                        : "bg-red-500",
                  )}
                />

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
                              ? "border border-green-500/30 bg-green-500/10 dark:border-green-500/40 dark:bg-green-500/15"
                              : isSelected && !isCorrectOption
                                ? "border border-red-500/20 dark:border-red-500/25"
                                : "border border-border/60",
                          )}
                        >
                          <div className="mr-2">
                            {question.isMultiSelect ? (
                              isSelected ? (
                                <CheckSquare
                                  className={cn("h-4 w-4", isCorrectOption ? "text-green-600" : "text-muted-foreground")}
                                />
                              ) : (
                                <Square
                                  className={cn(
                                    "h-4 w-4",
                                    isCorrectOption ? "text-green-600" : "text-muted-foreground/60",
                                  )}
                                />
                              )
                            ) : isSelected ? (
                              <Circle
                                className={cn(
                                  "h-4 w-4 fill-current",
                                  isCorrectOption ? "text-green-600" : "text-muted-foreground",
                                )}
                              />
                            ) : (
                              <Circle
                                className={cn(
                                  "h-4 w-4",
                                  isCorrectOption ? "text-green-600 fill-current" : "text-muted-foreground/60",
                                )}
                              />
                            )}
                          </div>
                          <span className={cn(isCorrectOption ? "font-medium" : "")}>{option.content}</span>
                          {isCorrectOption && (
                            question.isMultiSelect
                              ? <IconCheckFill12 className="ml-auto text-green-600" />
                              : <IconCircleHalfDottedCheckFillDuo18 className="ml-auto text-green-600" />
                          )}
                          {!isCorrectOption && isSelected && (
                            <XCircle className="ml-auto h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {question.explanation && (
                    <div className="mt-3 text-sm bg-muted/50 border border-border/60 p-3 rounded-lg">
                      <div className="font-medium text-foreground">Explanation:</div>
                      <div className="text-muted-foreground mt-1">{question.explanation}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Fragment>
        )
      })}
      {hasMore && (
        <Button
          variant="outline"
          className="mx-auto"
          onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
        >
          Load More ({Math.min(PAGE_SIZE, questions.length - visibleCount)} of {questions.length - visibleCount} remaining)
        </Button>
      )}
    </div>
  )
}
