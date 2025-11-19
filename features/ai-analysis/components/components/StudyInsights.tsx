import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, Clock, BookOpen, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StudyInsightsProps {
  summary: {
    correctAnswers: number;
    totalQuestions: number;
    timeSpent: string;
    improvement: number;
  };
  certificationReadiness: number;
  topMissedTopics: Array<{
    topic: string;
    importance: string;
  }>;
}

export function StudyInsights({ summary, certificationReadiness, topMissedTopics }: StudyInsightsProps) {
  return (
    <Card className="col-span-1 lg:col-span-2 border-none shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Zap className="h-5 w-5 mr-2 text-emerald-600" />
          Study Insights & Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quick Stats */}
          <div className="space-y-6">
            <div className="bg-foreground/20 rounded-lg p-4 border border-foreground/30">
              <h3 className="text-lg font-medium text-foreground mb-3">Study Progress</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-foreground">{summary.correctAnswers}</div>
                  <div className="text-sm text-foreground font-mono font-light">Questions Correct</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {Math.round((summary.timeSpent.split(' ')[0] as any) / 60)}h
                  </div>
                  <div className="text-sm text-foreground font-mono font-light">Study Time</div>
                </div>
              </div>
            </div>

            <div className="bg-foreground/20 rounded-lg p-4 border ">
              <h3 className="text-lg font-medium text-foreground mb-3">Performance Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-foreground">{summary.improvement}%</div>
                  <div className="text-sm text-foreground font-mono font-light">Improvement</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{certificationReadiness}%</div>
                  <div className="text-sm text-foreground font-mono font-light">Exam Ready</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Items */}
          <div className="bg-accent/10 rounded-lg border border-foreground/30 p-4">
            <h3 className="text-lg font-medium text-foreground mb-4">Recommended Actions</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="bg-purple-100 rounded-full p-2">
                  <Target className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <div className="text-md font-medium text-foreground">Focus on Weak Areas</div>
                  <div className="text-sm text-primary font-mono">Review {topMissedTopics[0]?.topic}</div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 rounded-full p-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-md font-medium text-foreground">Time Management</div>
                  <div className="text-sm text-primary font-mono">
                    Aim for {Math.round(summary.totalQuestions / 65 * 60)} seconds per question
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-emerald-100 rounded-full p-2">
                  <BookOpen className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <div className="text-md font-medium text-foreground">Next Study Session</div>
                  <div className="text-sm text-primary font-mono">Practice {topMissedTopics[1]?.topic || 'mixed topics'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Questions Completed</span>
              <span className="text-sm text-gray-500">{summary.totalQuestions}/1000</span>
            </div>
            <Progress value={(summary.totalQuestions / 1000) * 100} className="h-2" />
          </div> */}

          <div className="bg-accent/10 rounded-lg p-4 border border-foreground/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Accuracy Rate</span>
              <span className="text-lg text-foreground font-mono">
                {Math.round((summary.correctAnswers / summary.totalQuestions) * 100)}%
              </span>
            </div>
            <Progress 
              value={(summary.correctAnswers / summary.totalQuestions) * 100} 
              className="h-2" 
            />
          </div>

          <div className="bg-accent/10 rounded-lg p-4 border border-foreground/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Study Goal</span>
              <span className="text-lg font-mono text-foreground">{certificationReadiness}/85 %</span>
            </div>
            <Progress value={(certificationReadiness / 85) * 100} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 