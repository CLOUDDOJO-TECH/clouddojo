"use client";

import { trpc } from "@/lib/trpc/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Sparkles, TrendingUp, Target, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

interface QuizInsightsProps {
  quizAttemptId: string;
}

export function QuizInsights({ quizAttemptId }: QuizInsightsProps) {
  const router = useRouter();
  const { data: analysis, isLoading } = trpc.analysis.getQuizAnalysis.useQuery({
    quizAttemptId,
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-24 bg-card border border-border rounded-lg animate-pulse" />
        <div className="h-32 bg-card border border-border rounded-lg animate-pulse" />
      </div>
    );
  }

  if (!analysis?.found) return null;

  return (
    <div className="space-y-4">
      {/* Category Performance */}
      {analysis.categoryScores && (
        <Card className="p-4 border-border">
          <h3 className="text-sm font-medium mb-3">Performance by Category</h3>
          <div className="space-y-2">
            {Object.entries(analysis.categoryScores as Record<string, any>).map(
              ([category, data]) => (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{category}</span>
                    <span className="font-medium">
                      {data.correct}/{data.total}
                    </span>
                  </div>
                  <div className="h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-foreground transition-all"
                      style={{ width: `${data.percentage}%` }}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </Card>
      )}

      {/* AI Insights (Premium) */}
      {analysis.isPremium && (
        <>
          {/* Strengths */}
          {analysis.strengths && Array.isArray(analysis.strengths) && analysis.strengths.length > 0 && (
            <Card className="p-4 border-border">
              <h3 className="text-sm font-medium mb-2">What you did well</h3>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {analysis.strengths.map((strength, idx) => (
                  <li key={idx}>• {strength}</li>
                ))}
              </ul>
            </Card>
          )}

          {/* Weaknesses */}
          {analysis.weaknesses && Array.isArray(analysis.weaknesses) && analysis.weaknesses.length > 0 && (
            <Card className="p-4 border-border">
              <h3 className="text-sm font-medium mb-2">Areas to improve</h3>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {analysis.weaknesses.map((weakness, idx) => (
                  <li key={idx}>• {weakness}</li>
                ))}
              </ul>
            </Card>
          )}

          {/* Recommendations */}
          {analysis.recommendations && Array.isArray(analysis.recommendations) && analysis.recommendations.length > 0 && (
            <Card className="p-4 border-border">
              <h3 className="text-sm font-medium mb-2">Next steps</h3>
              <ul className="space-y-2 text-sm">
                {analysis.recommendations.map((rec: any, idx) => (
                  <li key={idx} className="text-muted-foreground">
                    • <span className="font-medium text-foreground">{rec.title}</span>
                    {rec.description && (
                      <p className="ml-3 mt-0.5 text-xs">{rec.description}</p>
                    )}
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </>
      )}

      {/* Upgrade prompt for free users */}
      {!analysis.isPremium && (
        <div className="space-y-4">
          {/* Preview of Premium Features */}
          <Card className="relative overflow-hidden border-border">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-emerald-500" />
                <h3 className="text-sm font-semibold">AI-Powered Insights</h3>
                <div className="ml-auto rounded-full bg-foreground/10 px-2 py-0.5 text-xs font-medium text-foreground/60">
                  Premium
                </div>
              </div>

              {/* Blurred Preview */}
              <div className="relative">
                <div className="space-y-3 blur-sm select-none pointer-events-none">
                  {/* Mock Strengths */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-emerald-500">
                      <Target className="h-4 w-4" />
                      <span>What you did well</span>
                    </div>
                    <ul className="space-y-1 text-xs text-muted-foreground ml-6">
                      <li>• Strong understanding of S3 storage concepts and use cases</li>
                      <li>• Excellent knowledge of IAM policies and permissions</li>
                      <li>• Good grasp of EC2 instance types and configurations</li>
                    </ul>
                  </div>

                  {/* Mock Weaknesses */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-orange-500">
                      <TrendingUp className="h-4 w-4" />
                      <span>Areas to improve</span>
                    </div>
                    <ul className="space-y-1 text-xs text-muted-foreground ml-6">
                      <li>• VPC networking and subnet configuration needs practice</li>
                      <li>• Security groups and NACLs require deeper understanding</li>
                    </ul>
                  </div>

                  {/* Mock Recommendations */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <BookOpen className="h-4 w-4" />
                      <span>Personalized study plan</span>
                    </div>
                    <ul className="space-y-1 text-xs text-muted-foreground ml-6">
                      <li>• Focus on VPC fundamentals and subnets first</li>
                      <li>• Practice configuring security groups in different scenarios</li>
                      <li>• Review Route 53 and CloudFront integration patterns</li>
                    </ul>
                  </div>
                </div>

                {/* Lock Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center rounded-full bg-foreground/10 p-3">
                      <Lock className="h-6 w-6 text-foreground/60" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Unlock AI Insights</p>
                      <p className="text-xs text-foreground/60 mt-1">
                        Get personalized analysis after every quiz
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Value Proposition */}
          <Card className="p-4 border-emerald-500/20 bg-emerald-500/5">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">
                Why upgrade to Premium?
              </h4>
              <ul className="space-y-2 text-xs text-foreground/70">
                <li className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Personalized insights</strong> - AI analyzes your specific weaknesses and strengths</span>
                </li>
                <li className="flex items-start gap-2">
                  <Target className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Custom study plans</strong> - Get recommendations tailored to your learning style</span>
                </li>
                <li className="flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Faster certification</strong> - Focus on what matters most for your exam</span>
                </li>
              </ul>

              {/* CTA Button */}
              <Button
                onClick={() => router.push("/pricing")}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Upgrade to Premium
              </Button>

              {/* Pricing Hint */}
              <p className="text-center text-xs text-foreground/50">
                Starting at $8.99/month • Cancel anytime
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
