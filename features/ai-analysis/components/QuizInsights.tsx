"use client";

import { trpc } from "@/lib/trpc/react";
import { Card } from "@/components/ui/card";

interface QuizInsightsProps {
  quizAttemptId: string;
}

export function QuizInsights({ quizAttemptId }: QuizInsightsProps) {
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
        <Card className="p-4 border-border">
          <div className="text-center space-y-2">
            <p className="text-sm font-medium">Get AI-powered insights</p>
            <p className="text-xs text-muted-foreground">
              Upgrade to see personalized strengths, weaknesses, and study recommendations
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
