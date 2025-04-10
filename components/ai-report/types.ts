import { ReactNode } from "react"

// / Type definitions for the report data
export interface ReportSummary {
  score: number
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
  timeSpent: string
  testDate: string
  improvement: number
  testName: string
}

export interface CategoryScore {
  name: string
  score: number
  questions: number
}

export interface TimeDistribution {
  category: string
  time: number
  count: number
}

export interface PerformanceHistory {
  test: string
  score: number
}

export interface MissedTopic {
  topic: string
  count: number
  importance: "High" | "Medium" | "Low"
}

export interface ReportData {
  summary: ReportSummary
  categoryScores: CategoryScore[]
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  detailedAnalysis: string
  timeDistribution: TimeDistribution[]
  performanceHistory: PerformanceHistory[]
  certificationReadiness: number
  topMissedTopics: MissedTopic[]
}

// Type for expanded sections state
export interface ExpandedSections {
  strengths: boolean
  weaknesses: boolean
  recommendations: boolean
  detailed: boolean
}

// Type for ReadinessCard props
export interface ReadinessCardProps {
  icon: ReactNode
  title: string
  value: string
  description: string
}

// Type for StudyPlanCard props
export interface StudyPlanCardProps {
  title: string
  description: string
  resources: string[]
  priority: "High" | "Medium" | "Low"
}

// Type for MarkdownRenderer props
export interface MarkdownRendererProps {
  content: string
}