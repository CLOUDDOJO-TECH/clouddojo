import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ReadinessCard } from "./ReadinessCard"
import { BookMarked, Clock, Target, TrendingUp } from "lucide-react"
import { format } from "date-fns"
import { Separator } from "@/components/ui/separator"

interface ScoreOverviewProps {
  summary: {
    testName: string;
    overallScore: number;
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    timeSpent: string;
    testDate: string;
    improvement: number;
  }
}

export function ScoreOverview({ summary }: ScoreOverviewProps) {
  return (
    <Card className="col-span-1 border-none shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>Overall Score</span>
          <span className="text-3xl font-bold font-mono">{summary.overallScore}%</span>
        </CardTitle>
        <CardDescription className="text-emerald-100">
          {summary.correctAnswers} of {summary.totalQuestions} questions correct
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-medium">Performance Trend</span>
          </div>
          <div className="text-xs text-primary font-mono">
            Last updated: {format(new Date(summary.testDate), "MMM d, yyyy")}
          </div>
        </div>
        <Separator className="my-4" />
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-foreground">Time Efficiency</span>
              <span className="text-sm text-primary font-mono">{summary.timeSpent}</span>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-foreground">Accuracy</span>
              <span className="text-sm text-primary font-mono">
                {Math.round((summary.correctAnswers / summary.totalQuestions) * 100)}%
              </span>
            </div>
            <Progress value={summary.overallScore} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 