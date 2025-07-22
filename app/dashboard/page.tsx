"use client";

import { useUser } from "@clerk/nextjs";
import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import PerformanceSection from "@/components/dashboard/performance-section";
import RecentActivitySection from "@/components/dashboard/recent-activity-section";
import CategoriesSection from "@/components/dashboard/categories-section";
import { useDashboardQueries } from "./hooks/useDashboardQueries";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChartArea, ChartLineIcon, Zap } from "lucide-react";
import PremiumAnalysisDashboard from "@/components/ai-report/premium-ai-analysis";
import { CheckUser } from "@/app/(actions)/user/check-user";
import React from "react";
import Image from "next/image";
import { Spotlight } from "@/components/spotlight";
import { Badge } from "@/components/ui/badge";
import UpgradeBadge from "@/components/ui/upgrade-badge";
import { useSubscription } from "@/hooks/use-subscription";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const searchParams = useSearchParams();

  // inital tab from url
  const initialTab = searchParams.get("tab") === 'ai-report' ? 'report' : 'analytics';  
  // function to update the URL with the selected tab
  const handleTabChange = (value: string) => {
    const newParams = value === 'report' ? 'ai-report' : 'analytics';
    const url = new URL(window.location.href);
    url.searchParams.set('tab', newParams);
    window.history.pushState({}, '', url);
  }
;
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
    console.log("Unauthorized access");
    router.replace("/");
  }

  if (isLoadingPerformance || isLoadingActivity || isLoadingCategories) {
    return (
      <div className="fixed min-h-screen w-full flex flex-col items-center mt-20">
        {/* <Spotlight
          className="-top-40 left-0 md:-top-20 md:left-80"
          fill="white"
        /> */}
        <div className="w-96 mb-8 animate-pulse flex items-center justify-center">
          <Image
            src="/3d-icons/3d-cloud-file.png"
            alt="dojo-logo"
            className="w-32 h-32"
            width={460}
            height={460}
          />
        </div>
        <h2 className="text-2xl  font-bold text-secondary-foreground mb-2">
          Preparing your dashboard data
        </h2>
        <p className="text-brand-beige-700 font-mono text-sm mb-6">
          Processing all your data in one place
        </p>
        <div className="w-80">
          <Progress value={progress} className="h-2 " />
        </div>
        <div className="mt-4 text-sm text-foreground flex items-center">
          <Zap className="h-4 w-4 mr-3 animate-spin text-emerald-600" />
          Checking your performance...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pt-6 max-w-8xl xl:mt-8 md:px-12 mx-auto container">
      {/* <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-[420px]"
        fill="#ecfdf5"
      /> */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back, {isLoaded ? user?.firstName || "there" : "there"}!
          Here's an overview of your learning progress.
        </p>
      </div>

      <Tabs defaultValue={initialTab} className="w-full" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2 ">
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <ChartLineIcon className="h-4 w-4" />
            Analytics
            </TabsTrigger>
          <TabsTrigger className="flex items-center gap-3" value="report">
            AI Report 
            {!isSubscribed && <UpgradeBadge>Premium</UpgradeBadge>} 
            </TabsTrigger>
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
