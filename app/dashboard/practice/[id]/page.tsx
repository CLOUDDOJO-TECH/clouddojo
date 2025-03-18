"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Flag,
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
} from "lucide-react"
import confetti from "canvas-confetti"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Confetti from 'react-confetti'

// Mock test data
const testData = {
  id: "aws-cloud-practitioner-1",
  title: "AWS Cloud Practitioner Practice Test",
  description: "Test your knowledge of AWS Cloud Practitioner concepts",
  timeLimit: 10, // in minutes
  questions: [
    {
      id: "q1",
      text: "Which AWS service is used for storing objects?",
      type: "single",
      options: [
        { id: "q1-a", text: "Amazon EC2" },
        { id: "q1-b", text: "Amazon S3" },
        { id: "q1-c", text: "Amazon RDS" },
        { id: "q1-d", text: "Amazon VPC" },
      ],
      correctAnswer: ["q1-b"],
      explanation:
        "Amazon S3 (Simple Storage Service) is an object storage service that offers industry-leading scalability, data availability, security, and performance.",
    },
    {
      id: "q2",
      text: "Which of the following are compute services in AWS? (Select all that apply)",
      type: "multiple",
      options: [
        { id: "q2-a", text: "Amazon EC2" },
        { id: "q2-b", text: "AWS Lambda" },
        { id: "q2-c", text: "Amazon RDS" },
        { id: "q2-d", text: "Amazon ECS" },
      ],
      correctAnswer: ["q2-a", "q2-b", "q2-d"],
      explanation: "Amazon EC2, AWS Lambda, and Amazon ECS are compute services. Amazon RDS is a database service.",
    },
    {
      id: "q3",
      text: "What is the AWS shared responsibility model?",
      type: "single",
      options: [
        { id: "q3-a", text: "AWS is responsible for everything" },
        { id: "q3-b", text: "Customers are responsible for everything" },
        {
          id: "q3-c",
          text: "AWS is responsible for the security of the cloud, customers are responsible for security in the cloud",
        },
        { id: "q3-d", text: "AWS and customers share responsibility for all aspects equally" },
      ],
      correctAnswer: ["q3-c"],
      explanation:
        "In the AWS shared responsibility model, AWS is responsible for security 'of' the cloud (infrastructure), while customers are responsible for security 'in' the cloud (data, applications, etc.).",
    },
    {
      id: "q4",
      text: "Which of the following are benefits of using AWS Cloud? (Select all that apply)",
      type: "multiple",
      options: [
        { id: "q4-a", text: "Trade capital expense for variable expense" },
        { id: "q4-b", text: "Benefit from massive economies of scale" },
        { id: "q4-c", text: "Maintain and operate data centers" },
        { id: "q4-d", text: "Go global in minutes" },
      ],
      correctAnswer: ["q4-a", "q4-b", "q4-d"],
      explanation:
        "AWS Cloud benefits include trading capital expense for variable expense, economies of scale, and global reach. Maintaining data centers is actually something you avoid by using AWS.",
    },
    {
      id: "q5",
      text: "Which AWS service would you use to run a database with high availability?",
      type: "single",
      options: [
        { id: "q5-a", text: "Amazon S3" },
        { id: "q5-b", text: "Amazon RDS" },
        { id: "q5-c", text: "Amazon EC2" },
        { id: "q5-d", text: "AWS Lambda" },
      ],
      correctAnswer: ["q5-b"],
      explanation:
        "Amazon RDS (Relational Database Service) provides high availability options with Multi-AZ deployments, read replicas, and automated backups.",
    },
  ],
}

export default function PracticeTestPage() {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [markedQuestions, setMarkedQuestions] = useState<string[]>([])
  const [timeLeft, setTimeLeft] = useState(testData.timeLimit * 60) // in seconds
  const [isTestSubmitted, setIsTestSubmitted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [showTimeWarning, setShowTimeWarning] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  })

  // Timer
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

    if (isTestSubmitted || showResults) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer)
          handleSubmitTest()
          return 0
        }

        // Show warning when 1 minute left
        if (prev === 60) {
          setShowTimeWarning(true)
        }

        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isTestSubmitted, showResults])

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Handle answer selection
  const handleAnswerSelect = (questionId: string, optionId: string) => {
    const question = testData.questions.find((q) => q.id === questionId)

    if (question?.type === "single") {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: [optionId],
      }))
    } else {
      // For multiple choice questions
      const currentAnswers = answers[questionId] || []
      const updatedAnswers = currentAnswers.includes(optionId)
        ? currentAnswers.filter((id) => id !== optionId)
        : [...currentAnswers, optionId]

      setAnswers((prev) => ({
        ...prev,
        [questionId]: updatedAnswers,
      }))
    }
  }

  // Handle marking a question for review
  const toggleMarkQuestion = (questionId: string) => {
    setMarkedQuestions((prev) =>
      prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId],
    )
  }

  // Navigation
  const goToNextQuestion = () => {
    if (currentQuestionIndex < testData.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index)
  }

  // Submit test
  const handleSubmitTest = () => {
   setIsTestSubmitted(true)
    setShowResults(true)
    setShowConfetti(true)
    
    // Automatically hide confetti after 5 seconds
    setTimeout(() => {
      setShowConfetti(false)
    }, 10000)

  }

  // Calculate results
  const calculateResults = () => {
    let correct = 0
    let incorrect = 0
    let skipped = 0

    testData.questions.forEach((question) => {
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

    const score = Math.round((correct / testData.questions.length) * 100)
    const timeTaken = testData.timeLimit * 60 - timeLeft

    return {
      score,
      correct,
      incorrect,
      skipped,
      total: testData.questions.length,
      timeTaken,
    }
  }

  // Check if a question is answered
  const isQuestionAnswered = (questionId: string) => {
    return !!answers[questionId] && answers[questionId].length > 0
  }

  // Get current question
  const currentQuestion = testData.questions[currentQuestionIndex]

  // Calculate progress
  const answeredCount = Object.keys(answers).length
  const progress = Math.round((answeredCount / testData.questions.length) * 100)

  // Results data
  const results = calculateResults()

  if (showResults) {
    return (
      <div className="container max-w-4xl mx-auto p-4 md:p-6 pt-16 md:pt-6">
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

          <Card className="mb-8">
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
                      <span className="font-medium">{formatTime(results.timeTaken)}</span>
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
            <CardFooter className="flex flex-wrap gap-3 justify-center md:justify-between">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => router.push("/practice-tests")}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Tests
              </Button>

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => {
                    setShowResults(false)
                    setCurrentQuestionIndex(0)
                  }}
                >
                  <Eye className="h-4 w-4" />
                  Review Answers
                </Button>

                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => {
                    setAnswers({})
                    setMarkedQuestions([])
                    setTimeLeft(testData.timeLimit * 60)
                    setIsTestSubmitted(false)
                    setShowResults(false)
                    setCurrentQuestionIndex(0)
                  }}
                >
                  <RefreshCw className="h-4 w-4" />
                  Restart Test
                </Button>
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Question Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {testData.questions.map((question, index) => {
                  const userAnswer = answers[question.id] || []
                  const isCorrect =
                    userAnswer.length === question.correctAnswer.length &&
                    userAnswer.every((ans) => question.correctAnswer.includes(ans))
                  const isSkipped = userAnswer.length === 0

                  return (
                    <div key={question.id} className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "mt-1 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center",
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
                            <h3 className="font-medium">Question {index + 1}</h3>
                            <div
                              className={cn(
                                "text-sm font-medium",
                                isCorrect ? "text-green-600" : isSkipped ? "text-amber-600" : "text-red-600",
                              )}
                            >
                              {isCorrect ? "Correct" : isSkipped ? "Skipped" : "Incorrect"}
                            </div>
                          </div>

                          <p className="mt-1">{question.text}</p>

                          <div className="mt-3 space-y-2">
                            {question.options.map((option) => {
                              const isSelected = userAnswer.includes(option.id)
                              const isCorrectOption = question.correctAnswer.includes(option.id)

                              return (
                                <div
                                  key={option.id}
                                  className={cn(
                                    "flex items-center p-2 rounded-md",
                                    isCorrectOption
                                      ? "bg-green-50 border border-green-200"
                                      : isSelected && !isCorrectOption
                                        ? "bg-red-50 border border-red-200"
                                        : "bg-gray-50 border border-gray-200",
                                  )}
                                >
                                  <div className="mr-2">
                                    {question.type === "multiple" ? (
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
                                  <span className={cn(isCorrectOption ? "font-medium" : "")}>{option.text}</span>
                                  {isCorrectOption && <CheckCircle2 className="ml-auto h-4 w-4 text-green-600" />}
                                </div>
                              )
                            })}
                          </div>

                          <div className="mt-3 text-sm bg-blue-50 border border-blue-200 p-3 rounded-md">
                            <div className="font-medium text-blue-800">Explanation:</div>
                            <div className="text-blue-700 mt-1">{question.explanation}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto p-4 md:p-6 pt-16 md:pt-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>{testData.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {testData.questions.length} questions • {testData.timeLimit} minutes
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex items-center gap-1 px-3 py-1 rounded-full font-medium",
                  timeLeft <= 60 ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700",
                )}
              >
                <Clock className="h-4 w-4" />
                <span>{formatTime(timeLeft)}</span>
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setShowSubmitDialog(true)}>
                      Submit Test
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Submit your test and see results</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-0">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm">
              Progress: <span className="font-medium">{answeredCount}</span> of{" "}
              <span className="font-medium">{testData.questions.length}</span> questions answered
            </div>
            <div className="text-sm">
              Question <span className="font-medium">{currentQuestionIndex + 1}</span> of{" "}
              <span className="font-medium">{testData.questions.length}</span>
            </div>
          </div>

          <Progress value={progress} className="h-2" />

          <div className="flex flex-wrap gap-2 mt-4 mb-2">
            {testData.questions.map((question, index) => (
              <TooltipProvider key={question.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "w-10 h-10 p-0",
                        currentQuestionIndex === index ? "border-primary border-2" : "",
                        isQuestionAnswered(question.id) ? "bg-primary text-primary-foreground hover:bg-primary/90" : "",
                        markedQuestions.includes(question.id) ? "ring-2 ring-amber-500" : "",
                      )}
                      onClick={() => goToQuestion(index)}
                    >
                      {index + 1}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div>
                      {isQuestionAnswered(question.id) ? "Answered" : "Not answered"}
                      {markedQuestions.includes(question.id) && " • Marked for review"}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </CardContent>

        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Question {currentQuestionIndex + 1}</h2>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "flex items-center gap-1",
                  markedQuestions.includes(currentQuestion.id) ? "text-amber-600" : "",
                )}
                onClick={() => toggleMarkQuestion(currentQuestion.id)}
              >
                <Flag className="h-4 w-4" />
                {markedQuestions.includes(currentQuestion.id) ? "Unmark" : "Mark for Review"}
              </Button>
            </div>

            <div className="text-lg">{currentQuestion.text}</div>

            <div className="mt-4">
              {currentQuestion.type === "single" ? (
                <RadioGroup
                  value={answers[currentQuestion.id]?.[0] || ""}
                  onValueChange={(value) => handleAnswerSelect(currentQuestion.id, value)}
                  className="space-y-3"
                >
                  {currentQuestion.options.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2 rounded-md border p-3 hover:bg-accent">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label htmlFor={option.id} className="flex-1 cursor-pointer py-2">
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <div className="space-y-3">
                  {currentQuestion.options.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2 rounded-md border p-3 hover:bg-accent">
                      <Checkbox
                        id={option.id}
                        checked={(answers[currentQuestion.id] || []).includes(option.id)}
                        onCheckedChange={() => handleAnswerSelect(currentQuestion.id, option.id)}
                      />
                      <Label htmlFor={option.id} className="flex-1 cursor-pointer py-2">
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </div>
              )}

              {currentQuestion.type === "multiple" && (
                <p className="text-sm text-muted-foreground mt-2">Select all that apply</p>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <Button
            variant={currentQuestionIndex === testData.questions.length - 1 ? "default" : "outline"}
            onClick={
              currentQuestionIndex === testData.questions.length - 1
                ? () => setShowSubmitDialog(true)
                : goToNextQuestion
            }
            className="flex items-center gap-1"
          >
            {currentQuestionIndex === testData.questions.length - 1 ? (
              <>Finish Test</>
            ) : (
              <>
                Next <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Test?</AlertDialogTitle>
            <AlertDialogDescription>
              You have answered {answeredCount} out of {testData.questions.length} questions.
              {answeredCount < testData.questions.length && (
                <span className="block mt-2 font-medium text-amber-600">
                  Warning: You have {testData.questions.length - answeredCount} unanswered questions.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Test</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmitTest}>Submit Test</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Time Warning Dialog */}
      <AlertDialog open={showTimeWarning} onOpenChange={setShowTimeWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Time Warning</AlertDialogTitle>
            <AlertDialogDescription>
              You have less than 1 minute remaining. The test will be automatically submitted when the timer reaches
              zero.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

