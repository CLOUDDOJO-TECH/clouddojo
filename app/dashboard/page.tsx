"use client";

import { useUser } from "@clerk/nextjs";
import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import PerformanceSection from "@/components/dashboard/performance-section";
import RecentActivitySection from "@/components/dashboard/recent-activity-section";
import { useDashboardQueries } from "./hooks/useDashboardQueries";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartArea, ChartLineIcon, Zap, Trophy } from "lucide-react";
import PremiumAnalysisDashboard from "@/components/ai-report/premium-ai-analysis";
import { ActivityHeatmap } from "@/components/gamification/activity-heatmap";
import { StreakDisplay } from "@/components/gamification/streak-display";
import { DailyGoalCard } from "@/components/gamification/daily-goal-card";
import { CheckUser } from "@/app/(actions)/user/check-user";
import React from "react";
import UpgradeBadge from "@/components/ui/upgrade-badge";
import { useSubscription } from "@/hooks/use-subscription";
import {
  QuizAttemptsSkeleton,
  RecentActivitySkeleton,
} from "@/components/dashboard/dashboard-loading";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  // inital tab from url
  // Check if user profile exists
  const {
    data: userProfile,
    isLoading: isCheckingProfile,
    isError: isProfileError,
  } = useQuery({
    queryKey: ["checkUserProfile"],
    queryFn: () => CheckUser(),
    enabled: isLoaded && !!user,
  });

  const initialTab =
    searchParams.get("tab") === "ai-report"
      ? "report"
      : searchParams.get("tab") === "gamification"
        ? "gamification"
        : "analytics";
  // function to update the URL with the selected tab
  const handleTabChange = (value: string) => {
    const newParams = value === "report" ? "ai-report" : value === "gamification" ? "gamification" : "analytics";
    const url = new URL(window.location.href);
    url.searchParams.set("tab", newParams);
    window.history.pushState({}, "", url);
  };

  const { isSubscribed, planName, isLoading, isError } = useSubscription();

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

  if (isProfileError) {
    console.log("Unauthorized access");
    router.replace("/");
  }

  return (
    <div className="space-y-8  px-4 pt-6 max-w-8xl xl:mt-8 md:px-12 mx-auto container">
      <div className="px-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back, {isLoaded ? user?.firstName || "there" : "there"}!
          Here's an overview of your learning progress.
        </p>
      </div>

      <Tabs
        defaultValue={initialTab}
        className="w-full"
        onValueChange={handleTabChange}
      >
        <TabsList className="grid w-full grid-cols-3 ">
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <ChartLineIcon className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="gamification" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Progress
          </TabsTrigger>
          <TabsTrigger className="flex items-center gap-3" value="report">
            AI Report
            {!isSubscribed && <UpgradeBadge>Premium</UpgradeBadge>}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 w-full">
            <div className="lg:col-span-4 space-y-6 w-full">
              <Suspense fallback={<QuizAttemptsSkeleton />}>
                <PerformanceSection
                  hasAttempts={hasAttempts}
                  stats={performanceStats || {}}
                  isLoading={isLoadingPerformance}
                />
              </Suspense>

              <Suspense fallback={<RecentActivitySkeleton />}>
                <RecentActivitySection
                  activity={activityHistory || []}
                  isLoading={isLoadingActivity}
                />
              </Suspense>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="gamification">
          <div className="space-y-6">
            {/* Top Row: Streak and Daily Goal */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <StreakDisplay />
              <DailyGoalCard />
            </div>

            {/* Activity Heatmap */}
            <ActivityHeatmap />
          </div>
        </TabsContent>
        <TabsContent value="report">
          <PremiumAnalysisDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
