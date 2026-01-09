"use client";

import { Progress } from "@/components/ui/progress";
import { Loader2, Brain, ChartLine, Target, TrendingUp } from "lucide-react";

interface AIAnalysisLoadingProps {
  progress: number;
}

export function AIAnalysisLoading({ progress }: AIAnalysisLoadingProps) {
  const getLoadingMessage = () => {
    if (progress < 25) return "Analyzing your quiz performance...";
    if (progress < 50) return "Identifying strengths and weaknesses...";
    if (progress < 75) return "Generating personalized recommendations...";
    return "Finalizing your AI-powered insights...";
  };

  const getLoadingIcon = () => {
    if (progress < 25) return <Brain className="h-5 w-5" />;
    if (progress < 50) return <ChartLine className="h-5 w-5" />;
    if (progress < 75) return <Target className="h-5 w-5" />;
    return <TrendingUp className="h-5 w-5" />;
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-6">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <div className="absolute inset-0 flex items-center justify-center">
                {getLoadingIcon()}
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">
              Generating AI Analysis
            </h3>
            <p className="text-muted-foreground text-sm">
              {getLoadingMessage()}
            </p>
          </div>
          
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-xs text-muted-foreground">
              {progress}% complete
            </p>
          </div>
          
          <div className="text-xs text-muted-foreground">
            This usually takes 10-30 seconds
          </div>
        </div>
      </div>
    </div>
  );
}