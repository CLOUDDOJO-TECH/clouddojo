"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trophy, Target, TrendingUp, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc/react";
import { AnalysisStatus } from "@/features/ai-analysis/components/AnalysisStatus";
import { saveActivationProfile } from "@/app/(actions)/activation/save-activation-profile";
import { toast } from "sonner";
import { useSubscription } from "@/lib/hooks/useSubscription";
import type { ProfileData } from "../types";

interface ActivationResultsProps {
  quizAttemptId: string;
  score: { correct: number; total: number };
  profile: ProfileData;
}

export function ActivationResults({ quizAttemptId, score, profile }: ActivationResultsProps) {
  const router = useRouter();
  const { isSubscribed } = useSubscription();
  const [isSaving, setIsSaving] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const percentage = Math.round((score.correct / score.total) * 100);

  // Fetch AI analysis (will be empty until analysis completes)
  const { data: analysis } = trpc.analysis.getQuizAnalysis.useQuery(
    { quizAttemptId },
    {
      enabled: analysisComplete,
      refetchInterval: analysisComplete ? false : 5000,
    }
  );

  const getMessage = () => {
    if (percentage === 100) return "Perfect Start!";
    if (percentage >= 80) return "Excellent Work!";
    if (percentage >= 60) return "Great Start!";
    if (percentage >= 40) return "Good Effort!";
    return "Keep Learning!";
  };

  const getMotivation = () => {
    if (percentage >= 80)
      return "You're well on your way! Keep practicing to master your certification.";
    if (percentage >= 60)
      return "Solid foundation! CloudDojo will help you fill in the gaps and ace your exam.";
    return "Everyone starts somewhere! CloudDojo's personalized study plan will guide you to success.";
  };

  const handleContinueToDashboard = async () => {
    setIsSaving(true);

    try {
      // Save activation profile
      const result = await saveActivationProfile(profile, quizAttemptId);

      if (!result.success) {
        toast.error(result.error || "Failed to save profile");
        setIsSaving(false);
        return;
      }

      toast.success("Welcome to CloudDojo! 🎉");

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Error completing activation:", error);
      toast.error("Something went wrong. Please try again.");
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Score Card */}
      <div className="rounded-2xl border border-border bg-background p-8">
        <div className="space-y-6 text-center">
          {/* Icon */}
          <div className="flex justify-center">
            <div className={`rounded-full p-4 ${percentage >= 70 ? "bg-emerald-500/10" : "bg-orange-500/10"}`}>
              <Trophy className={`h-12 w-12 ${percentage >= 70 ? "text-emerald-500" : "text-orange-500"}`} />
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground">{getMessage()}</h2>
            <p className="text-foreground/60">{getMotivation()}</p>
          </div>

          {/* Score */}
          <div className="space-y-3">
            <div className={`text-6xl font-bold ${percentage >= 70 ? "text-emerald-500" : "text-orange-500"}`}>
              {percentage}%
            </div>
            <p className="text-lg text-foreground/60">
              {score.correct} out of {score.total} correct
            </p>
          </div>

          {/* Progress bar */}
          <div className="h-3 overflow-hidden rounded-full bg-foreground/10">
            <div
              className={`h-full transition-all ${percentage >= 70 ? "bg-emerald-500" : "bg-orange-500"}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-background p-6">
          <div className="mb-2 flex items-center gap-2 text-emerald-500">
            <Target className="h-5 w-5" />
            <span className="text-sm font-medium">Accuracy</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{percentage}%</div>
        </div>

        <div className="rounded-xl border border-border bg-background p-6">
          <div className="mb-2 flex items-center gap-2 text-emerald-500">
            <TrendingUp className="h-5 w-5" />
            <span className="text-sm font-medium">Correct</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {score.correct}/{score.total}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background p-6">
          <div className="mb-2 flex items-center gap-2 text-emerald-500">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-medium">AI Analysis</span>
          </div>
          <AnalysisStatus
            quizAttemptId={quizAttemptId}
            onComplete={() => setAnalysisComplete(true)}
          />
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="rounded-2xl border border-border bg-background p-6">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-emerald-500" />
          <h3 className="text-lg font-semibold text-foreground">AI Insights</h3>
          {!isSubscribed && (
            <span className="rounded-full bg-foreground/10 px-2 py-1 text-xs font-semibold text-foreground/60">
              Premium
            </span>
          )}
        </div>

        {isSubscribed && analysisComplete && analysis ? (
          <div className="space-y-4">
            {/* Strengths */}
            {analysis.strengths && analysis.strengths.length > 0 && (
              <div>
                <div className="mb-2 text-sm font-medium text-emerald-500">✓ Top Strength</div>
                <div className="text-foreground">{analysis.strengths[0]}</div>
              </div>
            )}

            {/* Weaknesses */}
            {analysis.weaknesses && analysis.weaknesses.length > 0 && (
              <div>
                <div className="mb-2 text-sm font-medium text-orange-500">⚠ Focus Area</div>
                <div className="text-foreground">{analysis.weaknesses[0]}</div>
              </div>
            )}

            {/* Recommendations */}
            {analysis.recommendations && analysis.recommendations.length > 0 && (
              <div>
                <div className="mb-2 text-sm font-medium text-foreground/60">📚 Recommendation</div>
                <div className="text-foreground">{analysis.recommendations[0]}</div>
              </div>
            )}
          </div>
        ) : isSubscribed && !analysisComplete ? (
          <div className="flex items-center gap-2 text-foreground/60">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>AI is analyzing your responses...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Preview for free users */}
            <div className="rounded-lg border border-border bg-foreground/5 p-4 blur-sm">
              <div className="mb-2 text-sm font-medium text-emerald-500">✓ Top Strength</div>
              <div className="text-foreground">Storage fundamentals and S3 concepts</div>

              <div className="mb-2 mt-4 text-sm font-medium text-orange-500">⚠ Focus Area</div>
              <div className="text-foreground">Networking and VPC configuration</div>

              <div className="mb-2 mt-4 text-sm font-medium text-foreground/60">📚 Recommendation</div>
              <div className="text-foreground">Start with VPC basics, then practice subnets and security groups</div>
            </div>

            {/* Upgrade CTA */}
            <div className="text-center">
              <Button
                onClick={() => router.push("/pricing")}
                variant="outline"
                className="border-foreground text-foreground hover:bg-foreground/5"
              >
                <Target className="h-4 w-4" />
                Upgrade to Premium for AI Insights
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Continue to Dashboard */}
      <div className="rounded-2xl border border-border bg-background p-6 text-center">
        <h3 className="mb-3 text-xl font-bold text-foreground">Ready to Master Your Certification?</h3>
        <p className="mb-6 text-foreground/60">
          Your personalized dashboard is ready with practice questions, progress tracking, and more.
        </p>

        <Button
          onClick={handleContinueToDashboard}
          disabled={isSaving}
          className="bg-foreground text-background hover:bg-foreground/90"
          size="lg"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Setting up your dashboard...
            </>
          ) : (
            <>
              View Your Dashboard
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
