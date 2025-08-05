import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BookMarked, Clock, Target } from "lucide-react";
import { ReadinessCard } from "./ReadinessCard";

interface CertificationReadinessProps {
  certificationReadiness: number;
  performanceHistory: Array<{
    test: string;
    score: number;
  }>;
  topMissedTopics: Array<{
    topic: string;
  }>;
  summary: {
    totalQuestions: number;
  };
}

export function CertificationReadiness({ 
  certificationReadiness, 
  performanceHistory,
  topMissedTopics,
  summary 
}: CertificationReadinessProps) {
  return (
    <Card className="col-span-1 lg:col-span-2 border-none shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle>Certification Readiness</CardTitle>
        <CardDescription className="text-foreground/60 text-sm font-mono">Based on your performance across recent practice tests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative pt-4">
          <div className="flex justify-between mb-1.5">
            <span className="text-sm font-medium text-foreground">Overall Readiness</span>
            <span className="text-sm font-medium text-primary font-mono">{certificationReadiness}%</span>
          </div>
          <div className="h-3 relative max-w-xl rounded-full overflow-hidden">
            <div className="w-full h-full bg-gray-200 absolute"></div>
            <div
              className="h-full bg-gradient-to-r from-yellow-400 via-emerald-500 to-emerald-600 absolute"
              style={{ width: `${certificationReadiness}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs font-mono leading-none tracking-tight text-gray-500 mt-1.5">
            <span>Not Ready</span>
            <span>Needs Practice</span>
            <span>Almost Ready</span>
            <span>Ready</span>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4">
            <ReadinessCard
              icon={<BookMarked className="h-5 w-5 text-blue-500" />}
              title="Knowledge Areas"
              value="Review Required"
              description="See Weaknesses tab"
            />
            <ReadinessCard
              icon={<Clock className="h-5 w-5 text-emerald-500" />}
              title="Time Management"
              value="Check Analysis"
              description="See Time Distribution"
            />
            <ReadinessCard
              icon={<Target className="h-5 w-5 text-blue-500" />}
              title="Test History"
              value={`${performanceHistory.length} Tests Analyzed`}
              description="Review performance trends"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 