"use client"

import { useState, useEffect, useRef, ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { analyzeTestData } from "@/app/(actions)/ai-analysis/analyze-test-data"
import AIAnalysisLoading from "@/app/components/ai-report/loading"
import { format } from "date-fns"
import {
  CheckCircle,
  AlertCircle,
  BookOpen,
  LineChart,
  ChevronDown,
  ChevronUp,
  Clock,
  Target,
  Download,
  Share2,
  Info,
  ArrowUpRight,
  Zap,
  BookMarked,
  BarChart2,
  TrendingUp,
  Lightbulb,
  Layers,
  Shield,
  RefreshCw,
  Brain,
} from "lucide-react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

// --- Interface Definitions ---
export type AIAnalysisProps = {
  // No props needed since we always analyze the last 5 attempts
}

interface ExpandedSections {
  strengths: boolean
  weaknesses: boolean
  recommendations: boolean
  detailed: boolean
}

interface ReportData {
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
  studyPlan?: Array<{
    title: string
    description: string
    resources: string[]
    priority: "High" | "Medium" | "Low"
  }>
}

// Types for helper components
interface ReadinessCardProps {
  icon: ReactNode
  title: string
  value: string | number
  description: string
}

interface MarkdownRendererProps {
  content: string
}

interface StudyPlanCardProps {
  title: string
  description: string
  resources: string[]
  priority: "High" | "Medium" | "Low"
}

// --- Premium Analysis Dashboard Component ---
export default function PremiumAnalysisDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [report, setReport] = useState<ReportData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [activeInsightTab, setActiveInsightTab] = useState("overview")
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    strengths: true,
    weaknesses: true,
    recommendations: true,
    detailed: true,
  })
  const chartRef = useRef(null)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  const toggleSection = (section: keyof ExpandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

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

      // lamda function to analyze test data
      // const response = await fetch('/api/ai-analysis', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     timestamp: new Date().toISOString(),
      //   }),
      // })

      // if (!response.ok) {
      //   const error = await response.json()
      //   throw new Error(error.error || 'Failed to analyze test data')
      // }

      // const result = await response.json()
      
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
  }, []) // Remove quizAttemptId dependency since we always analyze the last 5 attempts

  // Draw charts after component mounts and data is loaded
  useEffect(() => {
    if (!isLoading && report && chartRef.current) {
      // Implement chart drawing logic here if needed
      // drawCategoryChart()
    }
  }, [isLoading, report])

  const handleRerun = () => {
    loadAnalysis()
  }

  const generatePDF = async () => {
    if (!reportRef.current || !report) return;
    
    try {
      setIsGeneratingPDF(true);
      
      // Create new PDF document
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      
      // Set font
      doc.setFont("helvetica");
      
      // Add header
      doc.setFontSize(22);
      doc.setTextColor(44, 62, 80);
      doc.text("AI Analysis Report by CloudDojo", 105, 20, { align: "center" });
      
      // Add date 
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 27, { align: "center" });
      
      // Add separator line
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 45, 190, 45);
      
      // Add summary section
      doc.setFontSize(14);
      doc.setTextColor(44, 62, 80);
      doc.text("Performance Summary", 20, 55);
      
      doc.setFontSize(12);
      doc.text(`Overall Score: ${report.summary.score}%`, 25, 65);
      doc.text(`Total Questions: ${report.summary.totalQuestions}`, 25, 72);
      doc.text(`Correct Answers: ${report.summary.correctAnswers}`, 25, 79);
      doc.text(`Incorrect Answers: ${report.summary.incorrectAnswers}`, 25, 86);
      doc.text(`Time Spent: ${report.summary.timeSpent}`, 25, 93);
      doc.text(`Improvement: +${report.summary.improvement}%`, 25, 100);
      
      // Add strengths section
      doc.setFontSize(14);
      doc.text("Strengths", 20, 120);
      let yPos = 130;
      report.strengths.forEach((strength, index) => {
        doc.setFontSize(12);
        const lines = doc.splitTextToSize(strength, 160);
        doc.text(lines, 25, yPos);
        yPos += 10 * lines.length;
      });
      
      // Add weaknesses section
      yPos += 10;
      doc.setFontSize(14);
      doc.text("Areas for Improvement", 20, yPos);
      yPos += 10;
      report.weaknesses.forEach((weakness, index) => {
        doc.setFontSize(12);
        const lines = doc.splitTextToSize(weakness, 160);
        doc.text(lines, 25, yPos);
        yPos += 10 * lines.length;
      });
      
      // Add recommendations section
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      yPos += 10;
      doc.setFontSize(14);
      doc.text("Recommendations", 20, yPos);
      yPos += 10;
      report.recommendations.forEach((recommendation, index) => {
        doc.setFontSize(12);
        const lines = doc.splitTextToSize(recommendation, 160);
        doc.text(lines, 25, yPos);
        yPos += 10 * lines.length;
      });
      
      // Add footer with page numbers
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: "center" });
      }
      
      // Save the PDF
      doc.save("ai-analysis-report.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 mb-4 flex items-center justify-center">
          <AlertCircle className="h-5 w-5 mr-2" /> Error: {error}
        </div>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }
  
  // Show loading state until the report is available
  if (isLoading || !report) {
    return <AIAnalysisLoading progress={progress} />
  }

  // Use the fetched report data
  const data = report

  return (
    <div className=" mx-auto py-6 bg-none " ref={reportRef}>
      {/* Header with logo and actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 w-full">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="mr-3">

          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">AWS Certification AI Coach</h1>
            <div className="flex items-center">
              {/* Use data from the report */}
              <p className="text-gray-500 text-sm">{data.summary.testName || "Overall Performance Analysis"}</p>
              <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200 text-center">
                Premium Analysis
              </Badge>
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

      {/* Score overview and certification readiness (Use data) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 mt-4">
        <Card className="col-span-1 border-none shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white pb-0">
            <CardTitle className="flex justify-between items-center">
              <span>Overall Score</span>
              <span className="text-3xl">{data.summary.score}%</span>
            </CardTitle>
            <CardDescription className="text-emerald-100">
              {data.summary.correctAnswers} of {data.summary.totalQuestions} questions correct
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-emerald-500 mr-2" />
                <span className="text-gray-700">Improvement</span>
              </div>
              <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                +{data.summary.improvement}% from last test
              </Badge>
            </div>
            <Separator className="my-4" />
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Time Efficiency</span>
                  <span className="text-sm text-gray-500">{data.summary.timeSpent}</span>
                </div>
                {/* Consider adding a progress bar based on time or efficiency metric if available */}
                {/* <Progress value={85} className="h-2" /> */}
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Accuracy</span>
                  <span className="text-sm text-gray-500">
                    {Math.round((data.summary.correctAnswers / data.summary.totalQuestions) * 100)}%
                  </span>
                </div>
                <Progress value={data.summary.score} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-2 border-none shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle>Certification Readiness</CardTitle>
            <CardDescription>Based on your performance across recent practice tests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative pt-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Overall Readiness</span>
                <span className="text-sm font-medium text-gray-700">{data.certificationReadiness}%</span>
              </div>
              <div className="h-3 relative max-w-xl rounded-full overflow-hidden">
                <div className="w-full h-full bg-gray-200 absolute"></div>
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 via-emerald-500 to-emerald-600 absolute"
                  style={{ width: `${data.certificationReadiness}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Not Ready</span>
                <span>Needs Practice</span>
                <span>Almost Ready</span>
                <span>Ready</span>
              </div>

              {/* Certification readiness gauge markers - Consider fetching these details from AI if needed */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                <ReadinessCard
                  icon={<BookMarked className="h-5 w-5 text-blue-500" />}
                  title="Knowledge Areas"
                  value="Review Required" // Placeholder
                  description="See Weaknesses tab"
                />
                <ReadinessCard
                  icon={<Clock className="h-5 w-5 text-emerald-500" />}
                  title="Time Management"
                  value="Check Analysis" // Placeholder
                  description="See Time Distribution"
                />
                <ReadinessCard
                  icon={<Target className="h-5 w-5 text-blue-500" />}
                  title="Test History"
                  value={`${data.performanceHistory.length} Tests Analyzed`}
                  description="Review performance trends"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Study Insights & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-1 lg:col-span-2 border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2 text-emerald-600" />
              Study Insights & Actions
            </CardTitle>
            <CardDescription>Key metrics and recommended next steps for your exam preparation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Quick Stats */}
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <h3 className="text-sm font-medium text-blue-800 mb-3">Study Progress</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-blue-700">{data.summary.correctAnswers}</div>
                      <div className="text-sm text-blue-600">Questions Correct</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-700">
                        {Math.round((data.summary.timeSpent.split(' ')[0] as any) / 60)}h
                      </div>
                      <div className="text-sm text-blue-600">Study Time</div>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                  <h3 className="text-sm font-medium text-emerald-800 mb-3">Performance Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-emerald-700">{data.summary.improvement}%</div>
                      <div className="text-sm text-emerald-600">Improvement</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-emerald-700">{data.certificationReadiness}%</div>
                      <div className="text-sm text-emerald-600">Exam Ready</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Items */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-sm font-medium text-gray-800 mb-4">Recommended Actions</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="bg-purple-100 rounded-full p-2">
                      <Target className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">Focus on Weak Areas</div>
                      <div className="text-sm text-gray-600">Review {data.topMissedTopics[0]?.topic}</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 rounded-full p-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">Time Management</div>
                      <div className="text-sm text-gray-600">
                        Aim for {Math.round(data.summary.totalQuestions / 65 * 60)} seconds per question
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-emerald-100 rounded-full p-2">
                      <BookOpen className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">Next Study Session</div>
                      <div className="text-sm text-gray-600">Practice {data.topMissedTopics[1]?.topic || 'mixed topics'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Indicators */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Questions Completed</span>
                  <span className="text-sm text-gray-500">{data.summary.totalQuestions}/1000</span>
                </div>
                <Progress value={(data.summary.totalQuestions / 1000) * 100} className="h-2" />
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Accuracy Rate</span>
                  <span className="text-sm text-gray-500">
                    {Math.round((data.summary.correctAnswers / data.summary.totalQuestions) * 100)}%
                  </span>
                </div>
                <Progress 
                  value={(data.summary.correctAnswers / data.summary.totalQuestions) * 100} 
                  className="h-2" 
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Study Goal</span>
                  <span className="text-sm text-gray-500">{data.certificationReadiness}%/85%</span>
                </div>
                <Progress value={(data.certificationReadiness / 85) * 100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-blue-600" />
              Top Missed Topics
            </CardTitle>
            <CardDescription>Focus on these areas to improve your score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.topMissedTopics.map((topic, index) => (
                <div key={index} className="flex items-center p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <div
                    className={`w-2 h-10 rounded-full mr-3 ${topic.importance === "High" ? "bg-red-500" : "bg-yellow-500"}`}
                  ></div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{topic.topic}</div>
                    <div className="text-sm text-gray-500">Missed {topic.count} questions</div>
                  </div>
                  <Badge
                    className={
                      topic.importance === "High" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {topic.importance}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="link" className="text-blue-600 hover:text-blue-800 p-0">
              View detailed topic analysis
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          </CardFooter>
        </Card>
      </div>


      {/* Insights Tabs (Use data) */}
      <Card className="border-none shadow-lg mb-8">
        <CardHeader className="pb-0">
          <CardTitle className="flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-emerald-600" />
            AI-Generated Insights
          </CardTitle>
          <CardDescription>Personalized analysis and recommendations based on your test performance</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <Tabs value={activeInsightTab} onValueChange={setActiveInsightTab} className="w-full overflow-hidden">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6 p-1 bg-muted/50">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white px-4 py-2 text-sm font-medium transition-all"
              >
                <Layers className="mr-2 h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="strengths"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white px-4 py-2 text-sm font-medium transition-all"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Strengths
              </TabsTrigger>
              <TabsTrigger
                value="weaknesses"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white px-4 py-2 text-sm font-medium transition-all"
              >
                <AlertCircle className="mr-2 h-4 w-4" />
                Weaknesses
              </TabsTrigger>
              <TabsTrigger
                value="recommendations"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white px-4 py-2 text-sm font-medium transition-all"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Recommendations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-14 md:mt-0 space-y-4">
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-2 mr-4">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-1">AI Analysis Summary</h3>
                    {/* Placeholder for AI Summary Text - consider adding this to the report */}
                    <p className="text-gray-600">
                      Reviewing your performance across the last {data.performanceHistory.length} tests. Check other tabs for detailed insights.
                    </p>
                  </div>
                </div>
              </div>

            
            </TabsContent>

            <TabsContent value="strengths" className="mt-14 md:mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.strengths.map((strength, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg border border-emerald-200 p-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start">
                      <div className="bg-emerald-100 rounded-full p-2 mr-3 flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                      </div>
                      <p className="text-gray-700">{strength}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="weaknesses" className="mt-14 md:mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.weaknesses.map((weakness, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg border border-blue-200 p-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start">
                      <div className="bg-blue-100 rounded-full p-2 mr-3 flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-blue-600" />
                      </div>
                      <p className="text-gray-700">{weakness}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="recommendations" className="mt-14 md:mt-0">
              <div className="space-y-4">
                {data.recommendations.map((recommendation, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start">
                      <div className="bg-emerald-100 rounded-full p-2 mr-4 flex-shrink-0">
                        <BookOpen className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-gray-700">{recommendation}</p>
                        <Button variant="link" className="text-emerald-600 hover:text-emerald-800 p-0 mt-2 h-auto">
                          View related resources
                          <ArrowUpRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Detailed Analysis Section (Use data) */}
      <Card className="border-none shadow-lg mb-8">
        <CardHeader
          className="flex flex-row items-center justify-between cursor-pointer"
          onClick={() => toggleSection("detailed")}
        >
          <div className="flex items-center">
            <LineChart className="h-5 w-5 mr-2 text-blue-600" />
            <div>
              <CardTitle>Detailed Analysis</CardTitle>
              <CardDescription>In-depth review of your performance by topic area</CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-transparent p-1">
            {expandedSections.detailed ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </Button>
        </CardHeader>
        {expandedSections.detailed && (
          <CardContent>
            <div className="prose max-w-none bg-white p-6 rounded-lg border border-gray-100">
              <MarkdownRenderer content={data.detailedAnalysis} />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Study Plan and Next Steps (Use data if available) */}
      {data.studyPlan && data.studyPlan.length > 0 && (
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookMarked className="h-5 w-5 mr-2 text-emerald-600" />
              Personalized Study Plan
            </CardTitle>
            <CardDescription>Based on your performance, we recommend the following study plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.studyPlan.map((planItem, index) => (
                <StudyPlanCard
                  key={index}
                  title={planItem.title}
                  description={planItem.description}
                  resources={planItem.resources}
                  priority={planItem.priority}
                />
              ))}
            </div>
          </CardContent>
 
        </Card>
      )}
    </div>
  )
}

// --- Helper Components (with added types) ---

// Helper component for readiness cards
function ReadinessCard({ icon, title, value, description }: ReadinessCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col items-center text-center">
      <div className="mb-2">{icon}</div>
      <div className="font-medium text-gray-800 text-sm px-2">{title}</div>
      <div className="text-sm font-bold text-gray-900 my-1 ">{value}</div>
      <div className="text-xs text-blue-500/70">{description}</div>
    </div>
  )
}

// Helper function to get color class based on score
function getCategoryColorClass(score: number): string {
  if (score >= 85) return "bg-emerald-500"
  if (score >= 70) return "bg-blue-500"
  if (score >= 60) return "bg-yellow-500"
  return "bg-red-500"
}

// Component to render markdown content with proper formatting
function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Process the content to handle markdown elements
  const processedContent = content
    .replace(/## (.*)/g, '<h2 class="text-xl font-bold mt-6 mb-3 text-blue-700">$1</h2>')
    .replace(
      /> "(.*?)"/g,
      '<blockquote class="border-l-4 border-emerald-500 pl-4 italic my-4 py-2 text-gray-700 bg-emerald-50 rounded-r-md">$1</blockquote>',
    )
    .replace(
      /```([\s\S]*?)```/g,
      '<pre class="bg-gray-100 p-4 rounded-md my-4 overflow-x-auto font-mono text-sm border border-gray-200">$1</pre>',
    )
    .replace(/\n\n/g, "<br/><br/>")
    .replace(
      /\n([0-9]+)\. (.*)/g,
      '<div class="ml-6 my-2 flex"><span class="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600 text-sm font-medium mr-3">$1</span> <span>$2</span></div>',
    )

  return <div dangerouslySetInnerHTML={{ __html: processedContent }} />
}

// Study plan card component
function StudyPlanCard({ title, description, resources, priority }: StudyPlanCardProps) {
  const priorityColor =
    priority === "High"
      ? "bg-red-100 text-red-800 border-red-200"
      : priority === "Medium"
        ? "bg-yellow-100 text-yellow-800 border-yellow-200"
        : "bg-blue-100 text-blue-800 border-blue-200"

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow h-auto">
      <div className="p-4">
        <Badge className={`mb-3 ${priorityColor}`}>{priority} Priority</Badge>
        <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <Separator className="my-3" />
        <h4 className="text-sm font-medium text-gray-700 mb-2">Recommended Resources:</h4>
        <ul className="space-y-2">
          {resources.map((resource: string, index: number) => (
            <li key={index} className="flex items-start">
              <ArrowUpRight className="h-4 w-4 text-emerald-500 mr-2 mt-0.5" />
              <a href={resource} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 cursor-pointer hover:text-blue-400">{resource}</a>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
        <Button variant="link" className="text-emerald-600 hover:text-emerald-800 p-0 h-auto text-sm">
          View detailed curriculum
        </Button>
      </div>
    </div>
  )
}

