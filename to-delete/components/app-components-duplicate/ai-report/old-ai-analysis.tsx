"use client"

import { useState, useEffect } from "react"
import { analyzeTestData } from "@/app/(actions)/ai-analysis/analyze-test-data"
import AIAnalysisLoading from "./loading"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
// ... keep existing imports ...

export type AIAnalysisProps = {
  quizAttemptId?: string
}

interface ExpandedSections {
  strengths: boolean
  weaknesses: boolean
  recommendations: boolean
  detailed: boolean
}

interface AIReport {
  summary: {
    score: number
    totalQuestions: number
    correctAnswers: number
    incorrectAnswers: number
    timeSpent: string
    testDate: string
    improvement: number
    testName: string
  }
  categoryScores: Array<{
    name: string
    score: number
    questions: number
  }>
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  detailedAnalysis: string
  timeDistribution: Array<{
    category: string
    time: number
    count: number
  }>
  performanceHistory: Array<{
    test: string
    score: number
  }>
  certificationReadiness: number
  topMissedTopics: Array<{
    topic: string
    count: number
    importance: string
  }>
}

function PremiumAIAnalysisDashboard(props: AIAnalysisProps) {
  const { quizAttemptId } = props
  const [isLoading, setIsLoading] = useState(true)
  const [activeInsightTab, setActiveInsightTab] = useState("overview")
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    strengths: true,
    weaknesses: true,
    recommendations: true,
    detailed: false,
  })
  const [progress, setProgress] = useState(0)
  const [report, setReport] = useState<AIReport | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadAnalysis = async () => {
    setIsLoading(true)
    setError(null)
    setProgress(0)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 5
      })
    }, 500)

    try {
      const result = await analyzeTestData()
      clearInterval(progressInterval)

      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to analyze test data")
      }
      
      console.log("AI Analysis Report:", result.data)

      setReport(result.data)
      
      setProgress(100)

      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    } catch (err) {
      clearInterval(progressInterval)
      setError(err instanceof Error ? err.message : "An error occurred")
      setIsLoading(false)
      setProgress(0)
    }
  }

  useEffect(() => {
    loadAnalysis()
  }, [])

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  // Use our loading component
  if (isLoading || !report) {
    return <AIAnalysisLoading progress={progress} />
  }

  // Only continue if we have actual report data from AI
  const data = report

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Overview Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test Overview</CardTitle>
          <CardDescription>
            {data.summary.testName} - {data.summary.testDate}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-secondary/10 rounded-lg">
              <div className="text-2xl font-bold">{data.summary.score}%</div>
              <div className="text-sm text-muted-foreground">Overall Score</div>
            </div>
            <div className="p-4 bg-secondary/10 rounded-lg">
              <div className="text-2xl font-bold">{data.summary.correctAnswers}/{data.summary.totalQuestions}</div>
              <div className="text-sm text-muted-foreground">Correct Answers</div>
            </div>
            <div className="p-4 bg-secondary/10 rounded-lg">
              <div className="text-2xl font-bold">{data.summary.timeSpent}</div>
              <div className="text-sm text-muted-foreground">Time Spent</div>
            </div>
            <div className="p-4 bg-secondary/10 rounded-lg">
              <div className="text-2xl font-bold text-green-600">+{data.summary.improvement}%</div>
              <div className="text-sm text-muted-foreground">Improvement</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strengths Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Key Strengths</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpandedSections(prev => ({ ...prev, strengths: !prev.strengths }))}
            >
              {expandedSections.strengths ? "Collapse" : "Expand"}
            </Button>
          </CardTitle>
        </CardHeader>
        {expandedSections.strengths && (
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              {data.strengths.map((strength: string, index: number) => (
                <li key={index} className="text-green-600">{strength}</li>
              ))}
            </ul>
          </CardContent>
        )}
      </Card>

      {/* Weaknesses Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Areas for Improvement</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpandedSections(prev => ({ ...prev, weaknesses: !prev.weaknesses }))}
            >
              {expandedSections.weaknesses ? "Collapse" : "Expand"}
            </Button>
          </CardTitle>
        </CardHeader>
        {expandedSections.weaknesses && (
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              {data.weaknesses.map((weakness: string, index: number) => (
                <li key={index} className="text-red-600">{weakness}</li>
              ))}
            </ul>
          </CardContent>
        )}
      </Card>

      {/* Recommendations Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recommendations</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpandedSections(prev => ({ ...prev, recommendations: !prev.recommendations }))}
            >
              {expandedSections.recommendations ? "Collapse" : "Expand"}
            </Button>
          </CardTitle>
        </CardHeader>
        {expandedSections.recommendations && (
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              {data.recommendations.map((recommendation: string, index: number) => (
                <li key={index} className="text-blue-600">{recommendation}</li>
              ))}
            </ul>
          </CardContent>
        )}
      </Card>

      {/* Detailed Analysis Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Detailed Analysis</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpandedSections(prev => ({ ...prev, detailed: !prev.detailed }))}
            >
              {expandedSections.detailed ? "Collapse" : "Expand"}
            </Button>
          </CardTitle>
        </CardHeader>
        {expandedSections.detailed && (
          <CardContent>
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: data.detailedAnalysis }} />
          </CardContent>
        )}
      </Card>
    </div>
  )
}

export default PremiumAIAnalysisDashboard 