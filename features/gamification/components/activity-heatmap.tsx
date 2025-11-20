"use client";

import { useState } from "react";
import HeatMap from "@uiw/react-heat-map";
import { trpc } from "@/src/lib/trpc/react";
import { Loader2 } from "lucide-react";

interface TooltipData {
  date: string;
  count: number;
  questionsAnswered: number;
  quizzesTaken: number;
  flashcardsStudied: number;
  minutesSpent: number;
  xpEarned: number;
}

export function ActivityHeatmap() {
  const [selectedDay, setSelectedDay] = useState<TooltipData | null>(null);

  const { data: activityData, isLoading } = trpc.gamification.getActivityHeatmap.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
    }
  );

  const { data: stats } = trpc.gamification.getStats.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-foreground/60" />
      </div>
    );
  }

  // Transform data for heatmap
  const heatmapData = activityData?.map((day) => ({
    date: day.date,
    count: day.count,
    content: "",
  })) || [];

  // Calculate stats
  const totalActivities = activityData?.reduce((sum, day) => sum + day.count, 0) || 0;
  const busiestDay = activityData?.reduce(
    (max, day) => (day.count > (max?.count || 0) ? day : max),
    activityData[0]
  );

  return (
    <div className="space-y-4">
      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-background/50 p-4">
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {totalActivities}
          </div>
          <div className="text-sm text-foreground/60">Total activities</div>
        </div>

        <div className="rounded-lg border border-border bg-background/50 p-4">
          <div className="text-2xl font-bold text-foreground">
            {stats?.currentStreak || 0} 🔥
          </div>
          <div className="text-sm text-foreground/60">Current streak</div>
        </div>

        <div className="rounded-lg border border-border bg-background/50 p-4">
          <div className="text-2xl font-bold text-foreground">
            {stats?.longestStreak || 0}
          </div>
          <div className="text-sm text-foreground/60">Longest streak</div>
        </div>

        <div className="rounded-lg border border-border bg-background/50 p-4">
          <div className="text-2xl font-bold text-foreground">
            {busiestDay?.count || 0}
          </div>
          <div className="text-sm text-foreground/60">Busiest day</div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="rounded-lg border border-border bg-background p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Activity This Year
        </h3>

        <div className="overflow-x-auto">
          <HeatMap
            value={heatmapData}
            weekLabels={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
            startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
            endDate={new Date()}
            width="100%"
            style={{
              color: "var(--foreground)",
            }}
            rectSize={12}
            space={4}
            rectProps={{
              rx: 2,
            }}
            panelColors={{
              0: "#161b22",
              2: "#0e4429",
              4: "#006d32",
              10: "#26a641",
              20: "#39d353",
            }}
            rectRender={(props, data) => {
              const dayData = activityData?.find(
                (d) => d.date === data.date
              );

              return (
                <rect
                  {...props}
                  onClick={() => {
                    if (dayData) {
                      setSelectedDay(dayData);
                    }
                  }}
                  className="cursor-pointer transition-opacity hover:opacity-80"
                  onMouseEnter={(e) => {
                    if (dayData) {
                      const tooltip = document.getElementById("heatmap-tooltip");
                      if (tooltip) {
                        tooltip.style.display = "block";
                        tooltip.style.left = `${e.clientX + 10}px`;
                        tooltip.style.top = `${e.clientY - 10}px`;
                        tooltip.innerHTML = `
                          <div class="rounded-lg border border-border bg-background p-3 shadow-lg">
                            <div class="font-semibold">${new Date(dayData.date).toLocaleDateString()}</div>
                            <div class="mt-2 space-y-1 text-sm">
                              <div><span class="text-foreground/60">Activities:</span> <span class="font-medium">${dayData.count}</span></div>
                              <div><span class="text-foreground/60">Questions:</span> ${dayData.questionsAnswered}</div>
                              <div><span class="text-foreground/60">Quizzes:</span> ${dayData.quizzesTaken}</div>
                              <div><span class="text-foreground/60">XP Earned:</span> ${dayData.xpEarned}</div>
                            </div>
                          </div>
                        `;
                      }
                    }
                  }}
                  onMouseLeave={() => {
                    const tooltip = document.getElementById("heatmap-tooltip");
                    if (tooltip) {
                      tooltip.style.display = "none";
                    }
                  }}
                />
              );
            }}
          />
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-between text-sm text-foreground/60">
          <span>Less</span>
          <div className="flex gap-1">
            <div
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: "#161b22" }}
            />
            <div
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: "#0e4429" }}
            />
            <div
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: "#006d32" }}
            />
            <div
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: "#26a641" }}
            />
            <div
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: "#39d353" }}
            />
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Tooltip Container */}
      <div
        id="heatmap-tooltip"
        style={{
          display: "none",
          position: "fixed",
          zIndex: 9999,
          pointerEvents: "none",
        }}
      />

      {/* Selected Day Details */}
      {selectedDay && (
        <div className="rounded-lg border border-border bg-background p-6">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              {new Date(selectedDay.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h3>
            <button
              onClick={() => setSelectedDay(null)}
              className="text-foreground/60 hover:text-foreground"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {selectedDay.questionsAnswered}
              </div>
              <div className="text-sm text-foreground/60">Questions</div>
            </div>

            <div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {selectedDay.quizzesTaken}
              </div>
              <div className="text-sm text-foreground/60">Quizzes</div>
            </div>

            <div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {selectedDay.flashcardsStudied}
              </div>
              <div className="text-sm text-foreground/60">Flashcards</div>
            </div>

            <div>
              <div className="text-2xl font-bold text-foreground">
                {selectedDay.minutesSpent}m
              </div>
              <div className="text-sm text-foreground/60">Time spent</div>
            </div>

            <div>
              <div className="text-2xl font-bold text-foreground">
                {selectedDay.xpEarned} XP
              </div>
              <div className="text-sm text-foreground/60">XP earned</div>
            </div>

            <div>
              <div className="text-2xl font-bold text-foreground">
                {selectedDay.count}
              </div>
              <div className="text-sm text-foreground/60">Total activities</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
