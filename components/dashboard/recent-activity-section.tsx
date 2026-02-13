"use client";

import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon, CircleCheck, CircleX, Target, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { ActivityItem } from "@/app/dashboard/practice/types";
import { useState, useRef, useCallback } from "react";

interface WeakArea {
  service: string;
  accuracy: number;
  total: number;
  correct: number;
}

interface RecentActivityProps {
  activity: ActivityItem[] | null;
  weakAreas: WeakArea[];
  isLoading: boolean;
  isLoadingWeakAreas: boolean;
}

export default function RecentActivitySection({
  activity,
  weakAreas,
  isLoading,
  isLoadingWeakAreas,
}: RecentActivityProps) {
  // Loading state
  if (isLoading) {
    return (
      <Card className="p-6 border-dashed">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-muted rounded"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                  <div className="h-2 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  // Empty state
  if (!activity || activity.length === 0) {
    return (
      <Card className="p-6 border-dashed">
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
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {/* Recent Activity — left, compact */}
      <Card className="p-5 border-dashed md:col-span-3">
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Recent Activity
          </h2>
          <div className="divide-y divide-border/50">
            {activity.slice(0, 5).map((item) => (
              <Link
                key={item.id}
                href={`/dashboard/practice/results/${item.id}`}
                className="flex items-center gap-3 py-2.5 group hover:bg-sidebar -mx-2 px-2 rounded-md transition-colors"
              >
                <span
                  className={`text-xs font-semibold w-10 text-center py-1 rounded ${
                    item.score >= 80
                      ? "bg-emerald-500/15 text-emerald-500"
                      : item.score >= 60
                      ? "bg-amber-500/15 text-amber-500"
                      : "bg-red-500/15 text-red-500"
                  }`}
                >
                  {item.score}%
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.quizTitle}</p>
                </div>
                <span className="text-[11px] text-muted-foreground shrink-0">
                  {formatDistanceToNow(new Date(item.completedAt), { addSuffix: true })}
                </span>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </Card>

      {/* Weak Areas — right */}
      <Card className="p-5 border-dashed md:col-span-2">
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Focus Areas
          </h2>

          {/* TODO: Remove dummy data before production */}
          {(() => {
            const dummyAreas: WeakArea[] = [
              { service: "Amazon S3", accuracy: 82, total: 22, correct: 18 },
              { service: "AWS Lambda", accuracy: 55, total: 20, correct: 11 },
              { service: "Amazon EC2", accuracy: 45, total: 18, correct: 8 },
              { service: "IAM", accuracy: 33, total: 15, correct: 5 },
              { service: "Amazon SageMaker", accuracy: 12, total: 16, correct: 2 },
            ]
            const displayAreas = weakAreas.length <= 1 ? dummyAreas : weakAreas
            return isLoadingWeakAreas ? (
            <div className="animate-pulse space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-6 bg-muted rounded" />
              ))}
            </div>
          ) : displayAreas.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Take more quizzes to reveal weak areas.
            </p>
          ) : (
            <FocusAreasList areas={displayAreas} />
          )
          })()}
        </div>
      </Card>
    </div>
  );
}

function FocusAreasList({ areas }: { areas: WeakArea[] }) {
  const [hovered, setHovered] = useState<string | null>(null)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const tooltipHeight = 160
  const tooltipWidth = 192 // w-48 = 12rem = 192px
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }
  }, [])

  const hoveredArea = areas.find((a) => a.service === hovered)

  const containerHeight = containerRef.current?.offsetHeight ?? 0
  const containerWidth = containerRef.current?.offsetWidth ?? 0
  const overflowY = mouse.y + tooltipHeight > containerHeight
  const overflowX = mouse.x + 16 + tooltipWidth > containerWidth
  const tooltipTop = overflowY ? mouse.y - tooltipHeight - 4 : mouse.y - 20
  const tooltipLeft = overflowX ? mouse.x - tooltipWidth - 16 : mouse.x + 16

  return (
    <div ref={containerRef} className="relative flex flex-col gap-2.5" onMouseMove={handleMouseMove}>
      {areas.map((area) => {
        const statusColor = area.accuracy >= 70
          ? "text-emerald-500"
          : area.accuracy >= 40
          ? "text-amber-500"
          : "text-red-500"
        const barColor = area.accuracy >= 70
          ? "bg-emerald-500"
          : area.accuracy >= 40
          ? "bg-amber-500"
          : "bg-red-500"

        return (
          <div
            key={area.service}
            className="flex items-center gap-3 cursor-default rounded-md -mx-2 px-2 py-1 hover:bg-muted/30 transition-colors"
            onMouseEnter={() => setHovered(area.service)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium truncate">{area.service}</span>
                <span className={`text-[11px] font-medium ${statusColor}`}>{area.accuracy}%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${barColor}`}
                  style={{ width: `${area.accuracy}%` }}
                />
              </div>
            </div>
          </div>
        )
      })}

      {/* Mouse-following tooltip */}
      {hoveredArea && (
        <div
          className="pointer-events-none absolute z-50 bg-sidebar shadow-lg rounded-lg p-3 w-48 transition-opacity duration-100"
          style={{ left: tooltipLeft, top: tooltipTop }}
        >
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold">{hoveredArea.service}</p>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Target className="h-3 w-3" />
                  Questions
                </span>
                <span className="text-[11px] font-medium">{hoveredArea.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <CircleCheck className="h-3 w-3 text-emerald-500" />
                  Correct
                </span>
                <span className="text-[11px] font-medium">{hoveredArea.correct}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <CircleX className="h-3 w-3 text-red-500" />
                  Incorrect
                </span>
                <span className="text-[11px] font-medium">{hoveredArea.total - hoveredArea.correct}</span>
              </div>
            </div>
            <div className="border-t border-border/50 pt-1.5 mt-0.5">
              <span className={`text-[11px] font-medium ${
                hoveredArea.accuracy >= 70
                  ? "text-emerald-500"
                  : hoveredArea.accuracy >= 40
                  ? "text-amber-500"
                  : "text-red-500"
              }`}>
                {hoveredArea.accuracy >= 70 ? "On track" : hoveredArea.accuracy >= 40 ? "Needs practice" : "Needs attention"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
