"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart4,
  RefreshCw,
  Eye,
  ArrowLeft,
  CheckSquare,
  Square,
  Circle,
  CheckCircle2,
  Brain
} from "lucide-react"
import Confetti from 'react-confetti'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ResultsProps } from "../types"
import QuestionAnalysis from "./QuestionAnalysis"
import PDFGenerator from "./PDFGenerator"

export default function Results({
  quiz,
  answers,
  markedQuestions,
  timeTaken,
  onRestart,
  onReview,
}: ResultsProps) {
  const router = useRouter()
  const [showConfetti, setShowConfetti] = useState(true)
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  })

  // Results data
  const results = calculateResults()

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', handleResize)
    handleResize()
    
    // Automatically hide confetti after 10 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false)
    }, 10000)

    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timer)
    }
  }, [])

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Calculate results
  function calculateResults() {
    let correct = 0
    let incorrect = 0
    let skipped = 0

    quiz.questions.forEach((question) => {
      const userAnswer = answers[question.id] || []

      if (userAnswer.length === 0) {
        skipped++
      } else if (
        userAnswer.length === question.correctAnswer.length &&
        userAnswer.every((ans) => question.correctAnswer.includes(ans))
      ) {
        correct++
      } else {
        incorrect++
      }
    })

    const score = Math.round((correct / quiz.questions.length) * 100)

    return {
      score,
      correct,
      incorrect,
      skipped,
      total: quiz.questions.length,
    }
  }

  return (
    <div className="relative">
      {/* Confetti canvas */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.1}
        />
      )}

      <Card className="mb-8 mt-2 max-w-7xl mx-auto">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Test Results</CardTitle>
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
                  <span className="font-medium">{formatTime(timeTaken)}</span>
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
        <CardFooter className="flex flex-wrap gap-3 justify-between">
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => router.push("/dashboard/practice")}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tests
            </Button>
            
            <PDFGenerator 
              quiz={quiz}
              answers={answers}
              score={results.score}
              timeTaken={timeTaken}
              correct={results.correct}
              incorrect={results.incorrect}
              skipped={results.skipped}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => router.push(`/dashboard/`)}
            >
              <Brain className="h-4 w-4" />
              View Analytics
            </Button>

            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={onReview}
            >
              <Eye className="h-4 w-4" />
              Review Answers
            </Button>

            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={onRestart}
            >
              <RefreshCw className="h-4 w-4" />
              Restart Test
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Question Analysis Card */}
      <Card className="max-w-7xl mx-auto">
        <CardHeader>
          <CardTitle>Question Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <QuestionAnalysis quiz={quiz} answers={answers} />
        </CardContent>
      </Card>
    </div>
  )
} 