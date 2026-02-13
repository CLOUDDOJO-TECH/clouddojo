"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  RefreshCw,
} from "lucide-react"
import {
  CheckSquareIcon,
  IconTriangleWarningOutlineDuo18,
  IconTextHighlightFillDuo18,
  IconAlarmClockFillDuo18,
  IconAlign3VerticalFillDuo18,
  IconPuzzlePieceOutlineDuo18,
} from "@/components/icons/results"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import Confetti from 'react-confetti'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { ResultsProps } from "../types"
import QuestionAnalysis from "./QuestionAnalysis"
import PDFGenerator from "./PDFGenerator"

export default function Results({ attempt }: ResultsProps) {
  const router = useRouter()
  const [showConfetti, setShowConfetti] = useState(true)
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  })

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

    const timer = setTimeout(() => {
      setShowConfetti(false)
    }, 10000)

    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timer)
    }
  }, [])

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

  const accuracy = results.correct > 0
    ? Math.round((results.correct / (results.correct + results.incorrect)) * 100)
    : 0

  return (
    <div className="container font-main lg:max-w-7xl max-w-6xl mx-auto p-4 md:p-6 pt-16 md:pt-6 min-h-[calc(100vh-4rem)]">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.1}
        />
      )}

      {/* Results Card — Variant 2: Side-by-side */}
      <Card className="border-dashed border-border/60 mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Test Results</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left: Chart */}
            <div className="flex flex-col items-center justify-center">
              <ChartContainer
                config={{
                  correct: { label: "Correct", color: "oklch(0.627 0.194 149.214)" },
                  incorrect: { label: "Incorrect", color: "oklch(0.637 0.237 25.331)" },
                  skipped: { label: "Skipped", color: "oklch(0.769 0.188 70.08)" },
                } satisfies ChartConfig}
                className="mx-auto aspect-square w-full max-w-[300px]"
              >
                <RadialBarChart
                  data={[{ correct: results.correct, incorrect: results.incorrect, skipped: results.skipped }]}
                  endAngle={180}
                  innerRadius={85}
                  outerRadius={140}
                >
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        hideLabel
                        className="w-[180px]"
                      />
                    }
                  />
                  <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) - 16}
                                className="fill-foreground text-4xl font-bold"
                              >
                                {results.score}%
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 10}
                                className="fill-muted-foreground text-base"
                              >
                                Score
                              </tspan>
                            </text>
                          )
                        }
                      }}
                    />
                  </PolarRadiusAxis>
                  <RadialBar
                    dataKey="correct"
                    stackId="a"
                    cornerRadius={5}
                    fill="var(--color-correct)"
                    className="stroke-transparent stroke-2"
                  />
                  <RadialBar
                    dataKey="incorrect"
                    stackId="a"
                    cornerRadius={5}
                    fill="var(--color-incorrect)"
                    className="stroke-transparent stroke-2"
                  />
                  <RadialBar
                    dataKey="skipped"
                    stackId="a"
                    cornerRadius={5}
                    fill="var(--color-skipped)"
                    className="stroke-transparent stroke-2"
                  />
                </RadialBarChart>
              </ChartContainer>

              <p className="-mt-10 text-base text-muted-foreground text-center">
                {results.score >= 80 && "Excellent work! You've mastered this topic."}
                {results.score >= 70 && results.score < 80 && "Good job! You've passed the test."}
                {results.score >= 60 && results.score < 70 && "Almost there! A bit more study and you'll pass."}
                {results.score < 60 && "Keep practicing! Review the topics and try again."}
              </p>
            </div>

            {/* Right: Stats grid */}
            <div className="grid grid-cols-2 gap-0 self-center w-full">
              {[
                { label: "Correct", value: results.correct, icon: CheckSquareIcon, color: "text-green-600" },
                { label: "Incorrect", value: results.incorrect, icon: IconTriangleWarningOutlineDuo18, color: "text-red-500" },
                { label: "Skipped", value: results.skipped, icon: IconTextHighlightFillDuo18, color: "text-amber-500" },
                { label: "Time Taken", value: formatTime(attempt.timeSpentSecs), icon: IconAlarmClockFillDuo18, color: "text-blue-500", isTime: true },
                { label: "Accuracy", value: `${accuracy}%`, icon: IconAlign3VerticalFillDuo18, color: "text-purple-500", isText: true },
                { label: "Total", value: results.total, icon: IconPuzzlePieceOutlineDuo18, color: "text-foreground", isText: true },
              ].map(({ label, value, icon: Icon, color, isTime, isText }, i) => (
                <div
                  key={label}
                  className={cn(
                    "group flex flex-col gap-1.5 p-5 cursor-default",
                    "border-dashed border-border/60",
                    // Right border for left column items
                    i % 2 === 0 && "border-r",
                    // Bottom border for all except last row
                    i < 4 && "border-b",
                  )}
                >
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Icon className={cn(
                      "h-6 w-6 transition-transform duration-300 ease-out",
                      "group-hover:rotate-[-8deg] group-hover:scale-110 group-hover:translate-y-[-1px]",
                      color,
                    )} />
                    <span className="text-sm">{label}</span>
                  </div>
                  <p className="text-2xl font-bold font-mono">
                    {isTime || isText ? value : (
                      <>{value}<span className="text-muted-foreground font-normal text-sm">/{results.total}</span></>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-wrap gap-3 justify-between pt-2 pb-6">
          <div className="flex flex-wrap gap-3">
            <PDFGenerator
              attempt={attempt}
              score={results.score}
              correct={results.correct}
              incorrect={results.incorrect}
              skipped={results.skipped}
            />
          </div>

          <Button
            variant="outline"
            className="gap-2"
            onClick={() => router.push(`/dashboard/practice/${attempt.quizId}`)}
          >
            <RefreshCw className="h-4 w-4" />
            Retake Test
          </Button>
        </CardFooter>
      </Card>

      {/* Question Analysis */}
      <Card className="border-dashed border-border/60 mb-6">
        <CardHeader>
          <CardTitle className="text-xl">Question Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <QuestionAnalysis questions={attempt.questions} />
        </CardContent>
      </Card>
    </div>
  )
}
