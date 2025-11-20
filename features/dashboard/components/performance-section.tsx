"use client"

import { Card } from "@/components/ui/card"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  TooltipProps,
} from "recharts"
import { format } from "date-fns"
import { InfoIcon, RefreshCcwDot, TrendingDown, TrendingUp } from "lucide-react"

import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"

interface PerformanceSectionProps {
  hasAttempts: boolean
  stats: any // Replace with proper type
  isLoading: boolean
}

export default function PerformanceSection({ 
  hasAttempts, 
  stats, 
  isLoading,
}: PerformanceSectionProps) {
  
  // If there are no attempts, show the empty state
  if (!hasAttempts && !isLoading) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
        <div className="rounded-full bg-emerald-500/20 p-3">
            <InfoIcon className="w-6 h-6 text-emerald-500" />
          </div>
          <h3 className="text-lg font-semibold">No quiz attempts yet</h3>
          <p className="text-muted-foreground max-w-md">
            Take your first practice test to see your performance metrics and track your progress over time.
          </p>
        </div>
      </Card>
    )
  }
  
  // Loading state
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-24 bg-muted rounded"></div>
            <div className="h-24 bg-muted rounded"></div>
            <div className="h-24 bg-muted rounded"></div>
          </div>
          <div className="h-[200px] bg-muted rounded"></div>
        </div>
      </Card>
    )
  }
  
  // Format the chart data with proper labels
  const chartData = stats.scoreHistory.map((item: any) => ({
    ...item,
    formattedDate: format(new Date(item.date), "MMM d")
  }))
  
  // Custom tooltip component for the chart
  const CustomTooltip = ({ active, payload, label }: TooltipProps<any, any>) => {
    if (active && payload && payload.length) {
      return (
        <div className="border border-1 italic font-serif bg-card  shadow-sm p-2 text-xs rounded-2xl border-foreground/20">
          <span className="flex items-center gap-2">
            <span className = {`h-3 w-3 rounded-sm ${
                  payload[0].value >= 80
                    ? "bg-emerald-500"
                    : payload[0].value >= 60
                    ? "bg-amber-500"
                    : "bg-red-500"
                }`} />
            <p className="font-medium">{label}</p>
          </span>
          <p className="text-muted-foreground">Score: 
            <span className = {` ${payload[0].value >= 80
                    ? "text-emerald-500"
                    : payload[0].value >= 60
                    ? "text-amber-500"
                    : "text-red-500"
                }`}>
            {payload[0].value}%
            </span>
            </p>
        </div>
      )
    }
    return null
  }
  
  return (
    <Card className="p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your Performance</h2>
          <span className="flex items-center gap-2">
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild >
                  <div className="rounded-full bg-emerald-500/20 p-1 cursor-help">
                    <InfoIcon className="w-4 h-4 text-emerald-600" />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-emerald-500/10">
                  <p className="max-w-xs text-sm font-serif italic font-extralight">
                  Your performance and results from recent quiz attempts.
                  </p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">Total Attempts</p>
            <p className="text-3xl font-bold">{stats.totalAttempts}</p>
            <p className="text-xs text-muted-foreground">Quiz attempts</p>
            
          </Card>
          
          <Card className="p-4 flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">Average Score</p>
            <p className="text-3xl font-bold">{Math.round(stats.averageScore)}%</p>
            <span className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">Across all attempts</p>
              <TrendingDown className="text-red-500 h-6 w-6" />
            </span>
          </Card>
          
          <Card className="p-4 flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">Highest Score</p>
            <p className="text-3xl font-bold">{Math.round(stats.highestScore)}%</p>
            <span className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">Best performance</p>
              { Math.round(stats.highestScore) < 50 ?
                <TrendingDown className="text-red-500 h-6 w-6 " /> 
              :
                <TrendingUp className="text-emerald-500 h-6 w-6" /> 
              }
            </span>
          </Card>
        </div>

        <div className="h-[250px] mt-2">
          {chartData.length > 1 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis 
                  dataKey="formattedDate" 
                  tick={{ fontSize: 12 }} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorScore)"
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, stroke: "#059669" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">Take more quizzes to see your score history</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

