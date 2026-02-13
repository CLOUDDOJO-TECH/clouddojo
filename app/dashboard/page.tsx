"use client";

import { useUser } from "@clerk/nextjs";
import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import PerformanceSection from "@/components/dashboard/performance-section";
import RecentActivitySection from "@/components/dashboard/recent-activity-section";
import { useDashboardQueries } from "./hooks/useDashboardQueries";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Rocket } from "lucide-react";
import IconChartBarTrendUpFillDuo18 from "@/components/icons/chart-bar-trend-up-fill-duo";
import PremiumAnalysisDashboard from "@/components/ai-report/premium-ai-analysis";
import { CheckUser } from "@/app/(actions)/user/check-user";
import React from "react";
import { useSubscription } from "@/hooks/use-subscription";
import Link from "next/link";
import JoyrideIllustration from "@/components/dashboard/joyride-illustration";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  QuizAttemptsSkeleton,
  RecentActivitySkeleton,
} from "@/components/dashboard/dashboard-loading";

function DashboardContent() {
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
    searchParams.get("tab") === "ai-report" ? "report" : "analytics";
  // function to update the URL with the selected tab
  const handleTabChange = (value: string) => {
    const newParams = value === "report" ? "ai-report" : "analytics";
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
    weakAreas,
    hasAttempts,
    isLoadingPerformance,
    isLoadingActivity,
    isLoadingCategories,
    isLoadingWeakAreas,
  } = useDashboardQueries(isLoaded && !!user);

  if (isProfileError) {
    console.log("Unauthorized access");
    router.replace("/");
  }

  return (
    <div className="space-y-8  px-4 pt-6 pb-16 max-w-8xl md:px-12 mx-auto container">

      <Tabs
        defaultValue={initialTab}
        className="w-full"
        onValueChange={handleTabChange}
      >
        <div className="fixed bottom-6 z-50 rounded-xl px-2 py-1 border border-dashed border-border/60 bg-sidebar shadow-[0_12px_60px_rgba(0,0,0,0.7),0_4px_20px_rgba(0,0,0,0.5)]" style={{ left: "calc(50% + var(--sidebar-width, 16rem) / 2)", transform: "translateX(-50%)" }}>
          <TabsList className="grid grid-cols-2 w-auto rounded-lg bg-transparent p-0 gap-1">
            <TabsTrigger value="analytics" className="flex items-center gap-2 px-5 py-1.5 text-sm rounded-md transition-all duration-300 ease-in-out hover:bg-sidebar-accent/40 hover:text-sidebar-foreground hover:scale-[1.02] data-[state=inactive]:active:scale-95 data-[state=active]:bg-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">
              <IconChartBarTrendUpFillDuo18 size="14px" />
              Analytics
            </TabsTrigger>
            <TabsTrigger className="flex items-center gap-2 px-5 py-1.5 text-sm rounded-md transition-all duration-300 ease-in-out hover:bg-sidebar-accent/40 hover:text-sidebar-foreground hover:scale-[1.02] data-[state=inactive]:active:scale-95 data-[state=active]:bg-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:shadow-md" value="report">
              AI Report
              {!isSubscribed && <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-400">Pro</span>}
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="analytics">
          {!hasAttempts && !isLoadingPerformance && !isLoadingActivity ? (
            <div className="relative w-full">
              {/* Grid background */}
              <div
                className={cn(
                  "absolute inset-0",
                  "[background-size:40px_40px]",
                  "[background-image:linear-gradient(to_right,#e4e4e770_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e770_1px,transparent_1px)]",
                  "dark:[background-image:linear-gradient(to_right,#26262670_1px,transparent_1px),linear-gradient(to_bottom,#26262670_1px,transparent_1px)]",
                )}
              />
              {/* Radial fade mask — fades sides and edges, keeps center visible */}
              <div className="pointer-events-none absolute inset-0 bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black_50%)] dark:bg-background" />

              {/* Glow blobs */}
              <div className="absolute -top-10 -left-10 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />
              <div className="absolute -bottom-10 -right-10 h-52 w-52 rounded-full bg-blue-500/15 blur-3xl" />

              <div className="relative flex flex-col items-center justify-center py-16 text-center space-y-6">
                <JoyrideIllustration />
                <div className="space-y-2 max-w-md">

                  <p className="text-muted-foreground">
                    Take your first practice test to unlock your personalized
                    dashboard with performance analytics and progress tracking.
                  </p>
                </div>
                <Button asChild size="lg">
                  <Link href="/dashboard/practice" className="gap-2">
                    <Rocket className="h-4 w-4" />
                    Take a Practice Test
                  </Link>
                </Button>
              </div>

            </div>
          ) : (
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
                    weakAreas={weakAreas || []}
                    isLoading={isLoadingActivity}
                    isLoadingWeakAreas={isLoadingWeakAreas}
                  />
                </Suspense>
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="report">
          <PremiumAnalysisDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8 px-4 pt-6 max-w-8xl xl:mt-8 md:px-12 mx-auto container">
      <div className="px-2">
        <div className="h-9 w-48 bg-muted animate-pulse rounded" />
        <div className="h-5 w-96 bg-muted animate-pulse rounded mt-2" />
      </div>
      <QuizAttemptsSkeleton />
    </div>
  );
}
