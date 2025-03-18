"use client"

import { useState, useEffect } from "react"
import { Award, BookOpen, Clock, CheckCircle2, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for the performance graph
const performanceData = [
  { month: "Jan", score: 65, average: 60, completion: 75 },
  { month: "Feb", score: 72, average: 63, completion: 80 },
  { month: "Mar", score: 68, average: 65, completion: 78 },
  { month: "Apr", score: 75, average: 68, completion: 85 },
  { month: "May", score: 82, average: 70, completion: 90 },
  { month: "Jun", score: 78, average: 72, completion: 88 },
  { month: "Jul", score: 85, average: 75, completion: 92 },
  { month: "Aug", score: 89, average: 78, completion: 95 },
]

// Mock data for quiz categories
const categoryData = [
  { name: "AWS", score: 85, total: 100 },
  { name: "GCP", score: 72, total: 100 },
  { name: "Azure", score: 78, total: 100 },
  { name: "K8s", score: 92, total: 100 },
  { name: "Docker", score: 88, total: 100 },
  { name: "DevOps", score: 76, total: 100 },
]

export default function PerformanceSection() {
  const [isClient, setIsClient] = useState(false)
  const [animatedData, setAnimatedData] = useState(
    performanceData.map((item) => ({ ...item, score: 0, average: 0, completion: 0 })),
  )

  // Animation effect for the chart
  useEffect(() => {
    setIsClient(true)

    const timer = setTimeout(() => {
      setAnimatedData(performanceData)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Calculate overall statistics
  const averageScore = Math.round(performanceData.reduce((acc, item) => acc + item.score, 0) / performanceData.length)

  const completionRate = Math.round(
    performanceData.reduce((acc, item) => acc + item.completion, 0) / performanceData.length,
  )

  const totalQuizzes = 42
  const completedQuizzes = Math.round(totalQuizzes * (completionRate / 100))

  // Calculate trend (positive or negative)
  const scoreTrend =
    performanceData[performanceData.length - 1].score - performanceData[performanceData.length - 2].score

  const completionTrend =
    performanceData[performanceData.length - 1].completion - performanceData[performanceData.length - 2].completion

  return (
    <div className="space-y-6 mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Performance Overview</h2>
          <p className="text-muted-foreground">Track your progress and quiz performance</p>
        </div>
        <Tabs defaultValue="score" className="w-full md:w-auto mt-4 md:mt-0">
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="score">Score</TabsTrigger>
            <TabsTrigger value="completion">Completion</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore}%</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {scoreTrend > 0 ? (
                <>
                  <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-500">{scoreTrend}% increase</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="mr-1 h-4 w-4 text-rose-500" />
                  <span className="text-rose-500">{Math.abs(scoreTrend)}% decrease</span>
                </>
              )}
              <span className="ml-1">from last month</span>
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-primary"
                style={{ width: `${averageScore}%`, transition: "width 1s ease-in-out" }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {completionTrend > 0 ? (
                <>
                  <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-500">{completionTrend}% increase</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="mr-1 h-4 w-4 text-rose-500" />
                  <span className="text-rose-500">{Math.abs(completionTrend)}% decrease</span>
                </>
              )}
              <span className="ml-1">from last month</span>
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-primary"
                style={{ width: `${completionRate}%`, transition: "width 1s ease-in-out" }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quizzes Completed</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedQuizzes} <span className="text-sm text-muted-foreground">/ {totalQuizzes}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{totalQuizzes - completedQuizzes} quizzes remaining</p>
            <div className="mt-3 h-2 w-full rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-primary"
                style={{ width: `${(completedQuizzes / totalQuizzes) * 100}%`, transition: "width 1s ease-in-out" }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48.5h</div>
            <p className="text-xs text-muted-foreground mt-1">+5.2h from last week</p>
            <div className="mt-3 h-2 w-full rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-primary"
                style={{ width: "65%", transition: "width 1s ease-in-out" }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Graph */}
      <Tabs defaultValue="score" className="w-full">
        <TabsContent value="score" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Score Trends</CardTitle>
              <CardDescription>Your performance compared to class average</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px] w-full">
                {isClient && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={animatedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#888" opacity={0.2} />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.8)",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="score"
                        name="Your Score"
                        stroke="#8884d8"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 8 }}
                        isAnimationActive={true}
                        animationDuration={1500}
                      />
                      <Line
                        type="monotone"
                        dataKey="average"
                        name="Class Average"
                        stroke="#82ca9d"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ r: 3 }}
                        isAnimationActive={true}
                        animationDuration={1500}
                        animationBegin={300}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completion" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Completion Rate Trends</CardTitle>
              <CardDescription>Percentage of quizzes completed over time</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px] w-full">
                {isClient && (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={animatedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#888" opacity={0.2} />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.8)",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="completion"
                        name="Completion Rate"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.3}
                        isAnimationActive={true}
                        animationDuration={1500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Performance by Category</CardTitle>
              <CardDescription>Your scores across different quiz categories</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px] w-full">
                {isClient && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} barSize={40}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#888" opacity={0.2} />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.8)",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                        }}
                        formatter={(value) => [`${value}%`, "Score"]}
                      />
                      <Bar
                        dataKey="score"
                        name="Score"
                        fill="#8884d8"
                        radius={[4, 4, 0, 0]}
                        isAnimationActive={true}
                        animationDuration={1500}
                        animationBegin={300}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

