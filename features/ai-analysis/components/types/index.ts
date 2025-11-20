import { ReactNode } from "react"

export interface AIAnalysisProps {
  // No props needed since we always analyze the last 5 attempts
}

export interface ExpandedSections {
  strengths: boolean
  weaknesses: boolean
  recommendations: boolean
  detailed: boolean
}

export interface ReportData {
  summary: {
    testName: string
    overallScore: number
    totalQuestions: number
    correctAnswers: number
    incorrectAnswers: number
    timeSpent: string
    testDate: string
    improvement: number
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
  studyPlan?: Array<{
    title: string
    description: string
    resources: string[]
    priority: "High" | "Medium" | "Low"
  }>
}

export interface ReadinessCardProps {
  icon: ReactNode
  title: string
  value: string | number
  description: string
}

export interface MarkdownRendererProps {
  content: string
}

export interface StudyPlanCardProps {
  title: string
  description: string
  resources: string[]
  priority: "High" | "Medium" | "Low"
} 