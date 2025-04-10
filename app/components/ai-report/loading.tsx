"use client"

import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Brain } from "lucide-react"

interface LoadingProps {
  progress: number
}

export default function AIAnalysisLoading({ progress }: LoadingProps) {
  return (
    <div className="bg-white flex flex-col items-center justify-center z-50 p-8">
      <div className="w-64 mb-8">
        <div className="relative">
          <svg viewBox="0 0 100 100" className="animate-pulse-subtle">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#10b981"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="251.2"
              strokeDashoffset="125.6"
              className="animate-dash"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Brain className="h-12 w-12 text-emerald-500" />
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Analyzing Your AWS Test Results</h2>
      <p className="text-gray-600 mb-6">Our AI is processing your performance data</p>
      <div className="w-80">
        <Progress value={progress} className="h-2" />
      </div>
      <div className="mt-4 text-sm text-gray-500 flex items-center">
        <Brain className="h-4 w-4 mr-1 text-emerald-500" />
        Generating personalized insights
      </div>

      {/* Loading cards preview */}
      <div className="mt-12 w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="w-full animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                <div className="h-3 bg-gray-200 rounded w-4/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 