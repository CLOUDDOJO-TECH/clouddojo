"use client";

import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc/react";

interface AnalysisStatusProps {
  quizAttemptId: string;
  onComplete?: () => void;
}

export function AnalysisStatus({ quizAttemptId, onComplete }: AnalysisStatusProps) {
  const [elapsed, setElapsed] = useState(0);

  // Poll status every 3 seconds
  const { data: status } = trpc.analysis.checkAnalysisStatus.useQuery(
    { quizAttemptId },
    {
      refetchInterval: (data) => {
        if (!data) return 3000;
        if (data.status === "completed") {
          onComplete?.();
          return false;
        }
        if (data.status === "failed") return false;
        return 3000;
      },
      refetchOnWindowFocus: false,
    }
  );

  // Track elapsed time
  useEffect(() => {
    const timer = setInterval(() => setElapsed((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!status) return null;

  if (status.status === "completed") {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="h-2 w-2 rounded-full bg-emerald-500" />
        <span>Analysis complete</span>
      </div>
    );
  }

  if (status.status === "failed") {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="h-2 w-2 rounded-full bg-red-500" />
        <span>Analysis failed</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
      <span>Analyzing... {elapsed}s</span>
    </div>
  );
}
