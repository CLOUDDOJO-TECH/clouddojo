"use client"

import PremiumAnalysisDashboard from "@/components/ai-report/premium-ai-analysis"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function AITab() {
  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Practice Test Analysis</CardTitle>
          <CardDescription>
            Comprehensive analysis of your recent practice test performances
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-2">
            <PremiumAnalysisDashboard />
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 