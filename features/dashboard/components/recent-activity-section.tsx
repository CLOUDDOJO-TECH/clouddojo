"use client";

import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InfoIcon, ExternalLinkIcon } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { ActivityItem } from "@/app/dashboard/practice/types";
import { useState } from "react";
import { useGetQuizAttempts } from "@/app/dashboard/hooks/useQuizAttempt";
import { AttemptsDialog } from "./attempts-modal";



interface RecentActivityProps {
  activity: ActivityItem[] | null;
  isLoading: boolean;
}

export default function RecentActivitySection({
  activity,
  isLoading,
}: RecentActivityProps) {

  const [slice, setSlice] = useState(5);
  const isExpanded = slice > 5;



  // Loading state
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-muted rounded-md"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  // Empty state - no activity
  if (!activity || activity.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
          <div className="rounded-full bg-emerald-500/20 p-3">
            <InfoIcon className="w-6 h-6 text-emerald-500" />
          </div>
          <h3 className="text-lg font-semibold">No recent activity</h3>
          <p className="text-muted-foreground max-w-md">
            Start taking quizzes to see your recent activity here.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild >
                <div className="rounded-full bg-emerald-500/20 p-1 cursor-help">
                  <InfoIcon className="w-4 h-4 text-emerald-600" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-emerald-500/10">
                <p className="max-w-xs text-sm font-serif italic font-extralight">
                  Your most recent quiz attempts and their results.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="space-y-4">
          {activity.slice(0, slice).map((item) => (
            <div key={item.id} className="flex items-start gap-3 py-2">
              {/* Score indicator */}
              <div
                className={`h-12 w-12 rounded-md flex items-center justify-center font-medium text-white ${
                  item.score >= 80
                    ? "bg-emerald-500"
                    : item.score >= 60
                    ? "bg-amber-500"
                    : "bg-red-500"
                }`}
              >
                {item.score}%
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium truncate">{item.quizTitle}</h3>
                  {/* just keep this out for nows */}
                  {/* <Badge variant="outline" className="text-xs bg-emerald-400/10 border-emerald-500 text-emerald-600 truncate">
                    {item.category.name}
                  </Badge> */}
                </div>
                <p className="text-xs text-emerald-700 mt-1 font-mono">
                  {format(new Date(item.completedAt), "MMM d, yyyy • h:mm a")}
                </p>
              </div>

             <AttemptsDialog attemptId={item.id}/>
            </div>
          ))}

          {activity.length > 5 && (
            <div className="flex justify-center mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSlice(isExpanded ? 5 : activity.length)}
              >
                {isExpanded ? "Show Less" : "View All Activity"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
