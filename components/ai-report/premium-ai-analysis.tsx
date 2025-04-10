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
} from "lucide-react"

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
    detailed: false,
  })
  const chartRef = useRef(null)

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
    <div className="container mx-auto py-6 px-4">
      {/* Header with logo and actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="mr-3">
            {/* SVG Logo */}
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="8" fill="#10b981" fillOpacity="0.1" />
              <path
                d="M20 10C14.477 10 10 14.477 10 20C10 25.523 14.477 30 20 30C25.523 30 30 25.523 30 20C30 14.477 25.523 10 20 10ZM20 28C15.582 28 12 24.418 12 20C12 15.582 15.582 12 20 12C24.418 12 28 15.582 28 20C28 24.418 24.418 28 20 28Z"
                fill="#10b981"
              />
              <path d="M21 15H19V21H25V19H21V15Z" fill="#10b981" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">AWS Certification AI Coach</h1>
            <div className="flex items-center">
              {/* Use data from the report */}
              <p className="text-gray-500 text-sm">{data.summary.testName || "Overall Performance Analysis"}</p>
              <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                Premium Analysis
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex space-x-3">
          {/* Report status */}
          <div className="flex items-center mr-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => loadAnalysis()}
              disabled={isLoading}
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh Analysis
            </Button>
          </div>
          <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Share2 className="h-4 w-4 mr-2" />
            Share Results
          </Button>
        </div>
      </div>

      {/* Score overview and certification readiness (Use data) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
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

      {/* Performance by category (Use data) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-1 lg:col-span-2 border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart2 className="h-5 w-5 mr-2 text-emerald-600" />
              Performance by Category
            </CardTitle>
            <CardDescription>Your score breakdown across AWS service categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.categoryScores.map((category) => (
                <div key={category.name}>
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700">{category.name}</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-gray-400 ml-1 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Based on {category.questions} questions</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <span className="text-sm text-gray-500">{category.score}%</span>
                  </div>
                  <div className="h-2 relative max-w-xl rounded-full overflow-hidden">
                    <div className="w-full h-full bg-gray-200 absolute"></div>
                    <div
                      className={`h-full absolute ${getCategoryColorClass(category.score)}`}
                      style={{ width: `${category.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
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
          <Tabs value={activeInsightTab} onValueChange={setActiveInsightTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                <Layers className="mr-2 h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="strengths"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Strengths
              </TabsTrigger>
              <TabsTrigger
                value="weaknesses"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                <AlertCircle className="mr-2 h-4 w-4" />
                Weaknesses
              </TabsTrigger>
              <TabsTrigger
                value="recommendations"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Recommendations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-0 space-y-4">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-emerald-500" />
                    Performance Trend
                  </h3>
                  <div className="h-40 flex items-end justify-between">
                    {data.performanceHistory.map((item, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div className="text-sm text-gray-500 mb-2">{item.score}%</div>
                        <div
                          className="w-12 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-md"
                          style={{ height: `${item.score * 0.35}%` }} // Adjust multiplier as needed
                        ></div>
                        <div className="text-sm text-gray-500 mt-2">{item.test}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-blue-500" />
                    Time Distribution
                  </h3>
                  <div className="space-y-4 mt-4">
                    {data.timeDistribution.map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">
                            {item.category} ({item.count})
                          </span>
                          <span className="text-sm text-gray-500">{Math.round(item.time / 60)} min</span>
                        </div>
                        <div className="h-2 relative rounded-full overflow-hidden">
                          <div className="w-full h-full bg-gray-200 absolute"></div>
                          <div
                            className={`h-full absolute ${index === 0 ? "bg-emerald-500" : index === 1 ? "bg-blue-500" : "bg-purple-500"}`}
                            style={{
                              width: `${(item.time / data.timeDistribution.reduce((acc, curr) => acc + curr.time, 1)) * 100}%`, // Avoid division by zero
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="strengths" className="mt-0">
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

            <TabsContent value="weaknesses" className="mt-0">
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

            <TabsContent value="recommendations" className="mt-0">
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
          <CardFooter className="flex justify-end">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Generate Full Study Plan</Button>
          </CardFooter>
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
      <div className="font-medium text-gray-800">{title}</div>
      <div className="text-xl font-bold text-gray-900 my-1">{value}</div>
      <div className="text-sm text-gray-500">{description}</div>
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
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
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
              <span className="text-sm text-gray-600">{resource}</span>
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

