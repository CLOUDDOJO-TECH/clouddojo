"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { getCachedAIAnalysis } from "@/app/(actions)/ai-analysis/get-cached-ai-analysis"
import AIAnalysisLoading from "@/app/components/ai-report/loading"
import { Download, Share2, RefreshCw, AlertCircle } from "lucide-react"
import jsPDF from "jspdf"
import { formatDistanceToNow } from "date-fns"
import { generateAnalysisPDF } from "./utils/pdf-generator"

// Import components
import { ScoreOverview } from "./components/ScoreOverview"
import { CertificationReadiness } from "./components/CertificationReadiness"
import { StudyInsights } from "./components/StudyInsights"
import { TopMissedTopics } from "./components/TopMissedTopics"
import { AIInsightsTabs } from "./components/AIInsightsTabs"
import { DetailedAnalysis } from "./components/DetailedAnalysis"
import { PersonalizedStudyPlan } from "./components/PersonalizedStudyPlan"
import { useSubscription } from "@/hooks/use-subscription"
import PaywallCard from "./paywall-card"

// --- Interface Definitions ---
interface ReportData {
  summary: {
    testName: string
    overallScore: number
    totalQuestions: number
    correctAnswers: number
    incorrectAnswers: number
    skippedQuestions: number
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

// --- Premium Analysis Dashboard Component ---
export default function PremiumAnalysisDashboard() {
  const [isLoading, setIsLoading] = useState(false)
  const [report, setReport] = useState<ReportData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)
  const [nextUpdate, setNextUpdate] = useState<string>("")

  const { isSubscribed, planName, isLoading: PlanLoading, isError } = useSubscription();
  

  if(!isSubscribed){
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <PaywallCard />

      </div>
    )
  }

  // Calculate time until next update (runs at midnight UTC)
  useEffect(() => {
    const calculateTimeUntilNextUpdate = () => {
      const now = new Date()
      const utcNow = new Date(now.toISOString())
      const nextUTCMidnight = new Date(Date.UTC(
        utcNow.getUTCFullYear(),
        utcNow.getUTCMonth(),
        utcNow.getUTCDate() + 1,
        0, 0, 0, 0
      ))
      const timeUntil = formatDistanceToNow(nextUTCMidnight, { addSuffix: true })
      setNextUpdate(timeUntil)
    }

    calculateTimeUntilNextUpdate()
    const timer = setInterval(calculateTimeUntilNextUpdate, 1000)
    return () => clearInterval(timer)
  }, [])

  const loadAnalysis = async () => {
    if (!report) {
      setIsLoading(true)
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
    }

    try {
      const result = await getCachedAIAnalysis()
      
      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to analyze test data")
      }
      
      setReport(result.data as unknown as ReportData)
      setProgress(100)
      setIsLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setIsLoading(false)
      setProgress(0)
    }
  }

  useEffect(() => {
    loadAnalysis()
  }, [])

  const generatePDF = async () => {
    if (!report) return;
    
    try {
      setIsGeneratingPDF(true);
      const success = await generateAnalysisPDF(report);
      if (!success) {
        throw new Error("Failed to generate PDF");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (error) {
    return (
      <div className="p-6 text-center h-[50vh] flex flex-col items-center justify-center">
        <div className="text-brand-beige-950 mb-4 flex items-center justify-center">
          <AlertCircle className="h-5 w-5 mr-2" /> Error: {error}
        </div>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }
  
  if (isLoading || !report) {
    return <AIAnalysisLoading progress={progress} />
  }

  return (
    <div className="mx-auto py-6 bg-none" ref={reportRef}>
      {/* Header with logo and actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 w-full">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="mr-3">
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">AWS Certification AI Coach</h1>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-gray-500 text-sm">{report.summary.testName || "Overall Performance Analysis"}</p>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-center">
                Premium Analysis
              </Badge>
              {nextUpdate && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 cursor-help">
                        <RefreshCw className="h-3 w-3" />
                        <span className="hidden sm:inline">Next analysis:</span>
                        <span className="sm:hidden">Update:</span>
                        <span className="text-primary underline">{nextUpdate}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="text-primary italic font-serif max-w-[200px] text-center">
                      <p>AI analysis is refreshed daily at midnight (UTC) to optimize resource usage and provide consistent insights.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        </div>
        <div className="flex space-x-3 items-center justify-center w-full md:w-auto">
          <Button 
            variant="outline" 
            className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            onClick={generatePDF}
            disabled={isGeneratingPDF}
          >
            <Download className="h-4 w-4 mr-2" />
            {isGeneratingPDF ? "Generating..." : "Export PDF"}
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Share2 className="h-4 w-4 mr-2" />
            Share Results
          </Button>
        </div>
      </div>

      {/* Score overview and certification readiness */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 mt-4">
        <ScoreOverview summary={report.summary} />
        <CertificationReadiness 
          certificationReadiness={report.certificationReadiness}
          performanceHistory={report.performanceHistory}
          topMissedTopics={report.topMissedTopics}
          summary={report.summary}
        />
      </div>

      {/* Study Insights & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <StudyInsights 
          summary={report.summary}
          certificationReadiness={report.certificationReadiness}
          topMissedTopics={report.topMissedTopics}
        />
        <TopMissedTopics topMissedTopics={report.topMissedTopics} />
      </div>

      {/* AI Insights Tabs */}
      <AIInsightsTabs 
        strengths={report.strengths}
        weaknesses={report.weaknesses}
        recommendations={report.recommendations}
        performanceHistory={report.performanceHistory}
      />

      {/* Detailed Analysis Section */}
      <DetailedAnalysis detailedAnalysis={report.detailedAnalysis} />

      {/* Study Plan and Next Steps */}
      {report.studyPlan && <PersonalizedStudyPlan studyPlan={report.studyPlan} />}
    </div>
  )
}

