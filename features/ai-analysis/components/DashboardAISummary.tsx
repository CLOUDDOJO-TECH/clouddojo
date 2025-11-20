"use client";

import { trpc } from "@/lib/trpc/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { TrendingUp, TrendingDown, ArrowRight, Lock, Zap, Target } from "lucide-react";
import { useSubscription } from "@/hooks/use-subscription";
import { useAutoRefreshDashboard } from "../hooks/useAutoRefreshDashboard";

export function DashboardAISummary() {
  const router = useRouter();
  const { isSubscribed } = useSubscription();
  const { data: dashboard, isLoading } = trpc.analysis.getDashboardAnalysis.useQuery();

  // Auto-refresh if data is stale
  useAutoRefreshDashboard();

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4 animate-pulse">
          <div className="h-5 w-32 bg-muted rounded" />
          <div className="h-20 bg-muted rounded" />
          <div className="h-16 bg-muted rounded" />
        </div>
      </Card>
    );
  }

  if (!dashboard) return null;

  const isPremium = dashboard.isPremium || isSubscribed;

  return (
    <Card className="relative overflow-hidden border-border">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-foreground" />
            <h3 className="font-semibold">AI Insights</h3>
          </div>
          {!isPremium && (
            <Badge variant="outline" className="text-xs">
              Limited
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6 space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Quizzes</p>
            <p className="text-2xl font-bold font-mono">
              {dashboard.totalQuizzesTaken || 0}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Avg Score</p>
            <p className="text-2xl font-bold font-mono">
              {dashboard.overallScore?.toFixed(0) || 0}%
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Trend</p>
            <div className="flex items-center gap-1">
              {dashboard.recentTrend === "improving" ? (
                <>
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-medium">Up</span>
                </>
              ) : dashboard.recentTrend === "declining" ? (
                <>
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">Down</span>
                </>
              ) : (
                <span className="text-sm font-medium text-muted-foreground">Stable</span>
              )}
            </div>
          </div>
        </div>

        {/* Category Insights */}
        {dashboard.categoryBreakdown && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Performance by Category</p>
            <div className="space-y-2">
              {Object.entries(dashboard.categoryBreakdown as Record<string, any>)
                .sort((a, b) => b[1].percentage - a[1].percentage)
                .slice(0, 3)
                .map(([category, data]) => (
                  <div key={category} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{category}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-foreground transition-all"
                          style={{ width: `${data.percentage}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs w-10 text-right">
                        {data.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Premium Features */}
        {isPremium ? (
          <div className="space-y-4 pt-4 border-t border-border">
            {/* Certification Readiness */}
            {dashboard.certificationReadiness !== null && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Certification Ready</p>
                  <span className="text-2xl font-bold font-mono">
                    {dashboard.certificationReadiness?.toFixed(0)}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-foreground transition-all"
                    style={{ width: `${dashboard.certificationReadiness}%` }}
                  />
                </div>
              </div>
            )}

            {/* Top Strength & Weakness */}
            <div className="grid grid-cols-2 gap-3">
              {dashboard.topStrengths?.[0] && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Top Strength</p>
                  <p className="text-sm line-clamp-2">{dashboard.topStrengths[0]}</p>
                </div>
              )}
              {dashboard.topWeaknesses?.[0] && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Focus Area</p>
                  <p className="text-sm line-clamp-2">{dashboard.topWeaknesses[0]}</p>
                </div>
              )}
            </div>

            {/* View Full Report */}
            <Button
              onClick={() => router.push("/dashboard?tab=ai-report")}
              variant="outline"
              className="w-full"
              size="sm"
            >
              View Full Analysis
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        ) : (
          /* Free User - Conversion Section */
          <div className="space-y-4 pt-4 border-t border-border">
            {/* Locked Premium Features Preview */}
            <div className="relative">
              {/* Blurred Background */}
              <div className="space-y-3 blur-sm select-none pointer-events-none opacity-40">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Certification Ready</span>
                  <span className="text-xl font-bold">87%</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-full w-[87%] bg-foreground rounded-full" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="text-muted-foreground">Top Strength</div>
                    <div>S3 Bucket Policies</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Focus Area</div>
                    <div>IAM Role Policies</div>
                  </div>
                </div>
              </div>

              {/* Overlay with CTA */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-3 bg-card/95 backdrop-blur-sm p-6 rounded-lg border border-border">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-2">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold">Unlock AI-Powered Insights</h4>
                    <p className="text-xs text-muted-foreground max-w-xs">
                      Get certification readiness scores, personalized study plans, and topic mastery tracking
                    </p>
                  </div>
                  <Button
                    onClick={() => router.push("/pricing")}
                    className="w-full gap-2"
                    size="sm"
                  >
                    <Target className="h-4 w-4" />
                    Upgrade to Premium
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Subtle accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
    </Card>
  );
}
