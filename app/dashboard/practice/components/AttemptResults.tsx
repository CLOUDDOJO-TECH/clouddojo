"use client"

import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart4,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AttemptData } from "../types"
import QuestionAnalysis from "./QuestionAnalysis"
import PDFGenerator from "./PDFGenerator"

interface AttemptResultsProps {
  attempt: AttemptData
}

export default function AttemptResults({ attempt }: AttemptResultsProps) {
  const results = calculateResults()

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  function calculateResults() {
    let correct = 0
    let incorrect = 0
    let skipped = 0

    attempt.questions.forEach((qa) => {
      if (!qa.userAnswer || qa.userAnswer.length === 0) {
        skipped++
      } else if (qa.isCorrect) {
        correct++
      } else {
        incorrect++
      }
    })

    const total = attempt.questions.length
    const score = Math.round(attempt.percentageScore)

    return { score, correct, incorrect, skipped, total }
  }

  return (
    <div className="relative">
      <Card className="mb-8 mt-2 max-w-7xl mx-auto">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Quiz Results: {attempt.quiz.title}</CardTitle>
            <div className="text-2xl font-bold">
              Score:{" "}
              <span className={cn(results.score >= 70 ? "text-green-600" : "text-red-600")}>{results.score}%</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Performance Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Correct</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{results.correct}</span>
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-600 rounded-full"
                        style={{ width: `${(results.correct / results.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <span>Incorrect</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{results.incorrect}</span>
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-600 rounded-full"
                        style={{ width: `${(results.incorrect / results.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    <span>Skipped</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{results.skipped}</span>
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-600 rounded-full"
                        style={{ width: `${(results.skipped / results.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span>Time Taken:</span>
                  <span className="font-medium">{formatTime(attempt.timeSpentSecs)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <BarChart4 className="h-5 w-5 text-purple-600" />
                  <span>Accuracy:</span>
                  <span className="font-medium">
                    {results.correct > 0
                      ? Math.round((results.correct / (results.correct + results.incorrect)) * 100)
                      : 0}
                    %
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center text-center">
              <div className="relative w-40 h-40">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-4xl font-bold">{results.score}%</div>
                </div>
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-gray-200"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className={cn("text-primary", results.score >= 70 ? "text-green-600" : "text-red-600")}
                    strokeWidth="10"
                    strokeDasharray={`${results.score * 2.51} 251`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>

              <div className="mt-4 text-lg">
                {results.score >= 80 && "Excellent work! You've mastered this topic."}
                {results.score >= 70 && results.score < 80 && "Good job! You've passed the test."}
                {results.score >= 60 && results.score < 70 && "Almost there! A bit more study and you'll pass."}
                {results.score < 60 && "Keep practicing! Review the topics and try again."}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-foreground/50 font-mono font-bold">
            Date Taken: {new Date(attempt.quiz.createdAt).toLocaleDateString()}
          </div>
          <PDFGenerator
            attempt={attempt}
            score={results.score}
            correct={results.correct}
            incorrect={results.incorrect}
            skipped={results.skipped}
          />
        </CardFooter>
      </Card>

      {/* Question Analysis Card */}
      <Card className="max-w-7xl mx-auto">
        <CardHeader>
          <CardTitle>Question Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <QuestionAnalysis questions={attempt.questions} />
        </CardContent>
      </Card>
    </div>
  )
}
