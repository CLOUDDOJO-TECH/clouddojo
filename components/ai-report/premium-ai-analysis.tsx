"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { getCachedAIAnalysis } from "@/app/(actions)/ai-analysis/get-cached-ai-analysis"
import { AIAnalysisLoading } from "@/app/components/ai-report/loading"
import { Download, Share2, RefreshCw, AlertCircle, RefreshCcw } from "lucide-react"
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
import { transformAnalysisData } from "./utils/transform-analysis"
import PaywallCard from "./paywall-card"
import type { ReportData } from "./types"
import useAIAnalysis from "./utils/use-ai-analysis"

// --- Premium Analysis Dashboard Component ---
export default function PremiumAnalysisDashboard() {
  const { data: report, error, isLoading } = useAIAnalysis();
  const [progress, setProgress] = useState(0)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)
  const [nextUpdate, setNextUpdate] = useState<string>("")

  // --- Subscription Check ---
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
      const utcNow = new Date(now.toISOString())  // current time in UTC time zone
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



  // Simulate progress bar while loading
useEffect(() => {
  if (!isLoading) {
    setProgress(100)
    return
  }

  let interval: NodeJS.Timeout
  setProgress(0)
  interval = setInterval(() => {
    setProgress((prev) => {
      if (prev >= 90) {
        clearInterval(interval)
        return 90
      }
      return prev + 5
    })
  }, 500)

  return () => clearInterval(interval)
}, [isLoading])


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
          <AlertCircle className="h-5 w-5 mr-2" /> An Error Occurred. Please try again later.
        </div>
        <Button Icon={RefreshCcw} onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }
  
  if (isLoading || !report) {
    return <AIAnalysisLoading progress={progress} />
  }

  return (
    <div className="mx-auto px-3 py-6 bg-none" ref={reportRef}>
      {/* Header with logo and actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 w-full">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="mr-3">
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">AWS Certification AI Coach</h1>
            <div className="flex flex-wrap items-center gap-2">
              {/* <p className="text-foreground/60 font-mono text-sm">{report.summary.testName || "Overall Performance Analysis"}</p> */}
              {/* <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-center">
                Premium Analysis
              </Badge> */}
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
        <div className="flex space-x-3  mt-2 items-center justify-between md:justify-center w-full md:w-auto">
          <Button 
            className=""
            Icon={Download}
            onClick={generatePDF}
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? "Generating..." : "Export PDF"}
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" Icon={Share2}>
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

