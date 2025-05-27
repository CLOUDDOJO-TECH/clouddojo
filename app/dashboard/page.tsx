"use client";

import { useUser } from "@clerk/nextjs";
import { Suspense, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
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
import { CheckUser } from "@/app/(actions)/user/check-user";
import React from "react";
import Image from "next/image";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  
  // Check if user profile exists
  const { data: userProfile, isLoading: isCheckingProfile, isError: isProfileError } = useQuery({
    queryKey: ["checkUserProfile"],
    queryFn: () => CheckUser(),
    enabled: isLoaded && !!user,
  });

  // Redirect to profile setup if needed
  useEffect(() => {
    if (!isLoaded || isCheckingProfile) return;
    
    if (userProfile?.exists === false) {
      router.push("/dashboard/profile");
    }
  }, [userProfile, isCheckingProfile, isLoaded, router]);

  const {
    performanceStats,
    activityHistory,
    hasAttempts,
    isLoadingPerformance,
    isLoadingActivity,
    isLoadingCategories,
  } = useDashboardQueries(isLoaded && !!user);

  // Handle progress bar
  useEffect(() => {
    // Only start progress if we're loading data
    if (isLoadingPerformance || isLoadingActivity || isLoadingCategories) {
  const interval = setInterval(() => {
    setProgress((prev) => {
      if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, 50);

      // Cleanup interval on unmount or when loading completes
      return () => clearInterval(interval);
    } else {
      // Reset progress when loading completes
      setProgress(0);
    }
  }, [isLoadingPerformance, isLoadingActivity, isLoadingCategories]);

  // Show loading state while checking profile
  if (isProfileError) {
    console.log("Unauthorized access")
    router.replace("/")
  }

  if (isLoadingPerformance || isLoadingActivity || isLoadingCategories) {
    return (
      <div className="fixed inset-0 min-h-screen w-full dark:bg-background bg-white flex flex-col items-center justify-center">
        <div className="w-96 mb-8 animate-pulse flex items-center justify-center">
          <Image src="/images/main-logo.png" alt="dojo-logo" className="w-32 h-32" width={160} height={160} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Preparing your dashboard data</h2>
        <p className="text-gray-600 mb-6">Processing all your data in one place</p>
        <div className="w-80">
          <Progress value={progress} className="h-2" />
        </div>
        <div className="mt-4 text-sm text-gray-500 flex items-center">
          <Zap className="h-4 w-4 mr-1 text-emerald-500" />
          Checking your performance...
        </div>
      </div>
    );
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
            <PremiumAnalysisDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
