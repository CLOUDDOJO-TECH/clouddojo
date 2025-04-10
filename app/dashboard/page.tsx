"use client";

import { useUser } from "@clerk/nextjs";
import { Suspense, useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import PerformanceSection from "@/components/dashboard/performance-section";
import RecentActivitySection from "@/components/dashboard/recent-activity-section";
import CategoriesSection from "@/components/dashboard/categories-section";
import { useDashboardQueries } from "./hooks/useDashboardQueries";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Zap } from "lucide-react";
import PremiumAnalysisDashboard from "@/components/ai-report/premium-ai-analysis";
import React from "react";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [progress, setProgress] = useState(0);
  const {
    performanceStats,
    activityHistory,
    performanceRefetch,
    hasAttempts,
    isLoadingPerformance,
    isLoadingActivity,
    isLoadingCategories,
  } = useDashboardQueries(isLoaded && !!user);

  // Add effect to listen for refresh event as a fallback
  useEffect(() => {
    const handleRefreshEvent = () => {
      if (typeof performanceRefetch === 'function') {
        performanceRefetch();
      }
    };
  }, [performanceRefetch]);

  const interval = setInterval(() => {
    setProgress((prev) => {
      if (prev >= 100) {
        clearInterval(interval)
        return 100
      }
      return prev + 5
    })
  }, 50)

  if (isLoadingPerformance || isLoadingActivity || isLoadingCategories) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
        <div className="w-64 mb-8">
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
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Analyzing Your AWS Test Results</h2>
        <p className="text-gray-600 mb-6">Processing all your data in one place</p>
        <div className="w-80">
          <Progress value={progress} className="h-2" />
        </div>
        <div className="mt-4 text-sm text-gray-500 flex items-center">
          <Zap className="h-4 w-4 mr-1 text-emerald-500" />
          Checking your performance...
        </div>
      </div>
    )
  }


  return (
    <div className="py-6 space-y-8 max-w-7xl mx-auto container px-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back, {isLoaded ? user?.firstName || "there" : "there"}!
          Here's an overview of your learning progress.
        </p>
      </div>

      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="report">AI Report</TabsTrigger>
        </TabsList>
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 w-full">
            <div className="lg:col-span-4 space-y-6 w-full">
              <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                <PerformanceSection
                  hasAttempts={hasAttempts}
                  stats={performanceStats || {}}
                  isLoading={isLoadingPerformance}
                  refetch={performanceRefetch}
                />
              </Suspense>

              <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
                <RecentActivitySection
                  activity={activityHistory || []}
                  isLoading={isLoadingActivity}
                />
              </Suspense>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="report">
          <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <PremiumAnalysisDashboard />
          </main>
        </TabsContent>
      </Tabs>
    </div>
  );
}
