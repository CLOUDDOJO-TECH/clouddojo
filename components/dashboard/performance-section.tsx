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
import { InfoIcon, TrendingDown, TrendingUp, Minus } from "lucide-react"

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

function TrendDelta({ value, suffix = "", invert = false }: { value: number; suffix?: string; invert?: boolean }) {
  // For speed, lower is better (invert the color logic)
  const isPositive = invert ? value < 0 : value > 0
  const isNeutral = value === 0
  const displayValue = invert ? Math.abs(value) : Math.abs(value)

  if (isNeutral) {
    return (
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        <Minus className="h-3 w-3" />
        <span>No change</span>
      </span>
    )
  }

  return (
    <span className={cn("flex items-center gap-1 text-xs", isPositive ? "text-emerald-500" : "text-red-500")}>
      {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      <span>{invert ? (value < 0 ? "-" : "+") : (value > 0 ? "+" : "")}{displayValue}{suffix} recent trend</span>
    </span>
  )
}

export default function PerformanceSection({ 
  hasAttempts, 
  stats, 
  isLoading,
}: PerformanceSectionProps) {
  
  // If there are no attempts, show the empty state
  if (!hasAttempts && !isLoading) {
    return (
      <Card className="p-6 border-dashed">
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
      <Card className="p-6 border-dashed">
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
  
  // Normalize timePerQuestion to a 0-100 scale for the shared Y axis
  const maxTime = Math.max(...chartData.map((d: any) => d.timePerQuestion || 0), 1)
  const normalizedData = chartData.map((item: any) => ({
    ...item,
    timeNormalized: Math.round((item.timePerQuestion / maxTime) * 100),
  }))

  // Custom tooltip component for the chart
  const CustomTooltip = ({ active, payload, label }: TooltipProps<any, any>) => {
    if (active && payload && payload.length) {
      const scoreEntry = payload.find((p: any) => p.dataKey === "score")
      const rawTime = payload[0]?.payload?.timePerQuestion
      return (
        <div className="bg-sidebar rounded-lg shadow-md px-3 py-2">
          <p className="text-xs font-semibold text-sidebar-foreground mb-1.5">{label}</p>
          <div className="flex flex-col gap-1">
            {scoreEntry && (
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
                  <span className="text-[11px] text-sidebar-foreground/60">Score</span>
                </span>
                <span className="text-[11px] font-medium text-sidebar-foreground">{scoreEntry.value}%</span>
              </div>
            )}
            {rawTime != null && (
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-blue-500" />
                  <span className="text-[11px] text-sidebar-foreground/60">Avg time/q</span>
                </span>
                <span className="text-[11px] font-medium text-sidebar-foreground">{rawTime}s</span>
              </div>
            )}
          </div>
        </div>
      )
    }
    return null
  }
  
  return (
    <Card className="p-6 border-dashed">
      <div className="flex flex-col gap-6">
        <h2 className="text-lg font-semibold">Your Performance</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 flex flex-col justify-between gap-3 bg-sidebar border-0">
            <p className="text-xs text-muted-foreground tracking-wide uppercase">Pass Rate</p>
            <p className="text-3xl font-bold tracking-tight">{stats.passRate}%</p>
            <TrendDelta value={stats.passRateTrend} suffix="%" />
          </Card>

          <Card className="p-4 flex flex-col justify-between gap-3 bg-sidebar border-0">
            <p className="text-xs text-muted-foreground tracking-wide uppercase">Average Score</p>
            <p className="text-3xl font-bold tracking-tight">{Math.round(stats.averageScore)}%</p>
            <TrendDelta value={stats.scoreTrend} suffix="%" />
          </Card>

          <Card className="p-4 flex flex-col justify-between gap-3 bg-sidebar border-0">
            <p className="text-xs text-muted-foreground tracking-wide uppercase">Avg Speed</p>
            <p className="text-3xl font-bold tracking-tight">{stats.avgSpeed}s</p>
            <TrendDelta value={stats.speedTrend} suffix="s" invert />
          </Card>
        </div>

        <div className="h-[250px] mt-2">
          {chartData.length > 1 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={normalizedData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                <XAxis
                  dataKey="formattedDate"
                  tick={{ fontSize: 12, fill: "currentColor", opacity: 0.6 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={false}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: "currentColor", strokeOpacity: 0.15, strokeDasharray: "4 4" }} />
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorScore)"
                  dot={false}
                  activeDot={false}
                />
                <Area
                  type="monotone"
                  dataKey="timeNormalized"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorTime)"
                  dot={false}
                  activeDot={false}
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

