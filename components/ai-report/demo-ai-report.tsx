"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Target,
  Clock,
  TrendingUp,
  CheckCircle2,
  Circle,
  AlertTriangle,
  BookOpen,
  ExternalLink,
  FileText,
  Video,
  Wrench,
  FlaskConical,
  Flame,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";
import {
  demoCoachBrief,
  demoActionItems,
  demoResources,
  demoMomentum,
  demoReportData,
} from "./demo-report-data";
import { useState } from "react";
import { cn } from "@/lib/utils";
import IconWandSparkle from "@/components/icons/wand-sparkle";
import IconTargetFill from "@/components/icons/target-fill";

// --- Section 1: AI Coach Brief ---
function CoachBrief() {
  const [expanded, setExpanded] = useState(true);

  // Simple markdown bold renderer
  const renderText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="text-foreground font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <Card className="p-6 border-dashed">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <IconWandSparkle size="20px" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">AI Coach Brief</h2>
            <p className="text-xs text-muted-foreground">
              Based on your last 5 attempts
            </p>
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronDown
            className={cn(
              "h-5 w-5 transition-transform duration-200",
              !expanded && "-rotate-90"
            )}
          />
        </button>
      </div>
      {expanded && (
        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          {demoCoachBrief.split("\n\n").map((paragraph, i) => (
            <p key={i}>{renderText(paragraph)}</p>
          ))}
        </div>
      )}
    </Card>
  );
}

// --- Section 2: Weak Area Breakdown ---
function WeakAreaBreakdown() {
  const weakAreas = [
    {
      domain: "Networking (VPC, Route 53)",
      score: 45,
      gap: "conceptual",
      detail:
        "You consistently confuse VPC peering with Transit Gateway. This isn't a careless mistake — the underlying mental model needs adjustment.",
    },
    {
      domain: "Security (IAM, KMS)",
      score: 55,
      gap: "conceptual",
      detail:
        "Cross-account IAM policy evaluation is the specific weak point. You understand single-account policies but struggle with permission boundaries.",
    },
    {
      domain: "High Availability & Scaling",
      score: 61,
      gap: "time-pressure",
      detail:
        "You get these right when untimed but rush them under pressure. Your accuracy drops from 75% to 40% when you spend less than 60 seconds.",
    },
  ];

  const gapLabels = {
    conceptual: {
      label: "Conceptual Gap",
      color: "text-red-400 bg-red-500/10",
    },
    careless: {
      label: "Careless Mistakes",
      color: "text-amber-400 bg-amber-500/10",
    },
    "time-pressure": {
      label: "Time Pressure",
      color: "text-blue-400 bg-blue-500/10",
    },
  };

  return (
    <Card className="p-6 border-dashed">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-9 w-9 rounded-lg bg-red-500/10 flex items-center justify-center">
          <AlertTriangle className="h-5 w-5 text-red-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Weak Area Breakdown</h2>
          <p className="text-xs text-muted-foreground">
            Categorized by gap type — not just what's weak, but why
          </p>
        </div>
      </div>
      <div className="space-y-4">
        {weakAreas.map((area) => (
          <div
            key={area.domain}
            className="p-4 rounded-xl bg-muted/30 border border-border/40"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{area.domain}</span>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full font-medium",
                    gapLabels[area.gap as keyof typeof gapLabels].color
                  )}
                >
                  {gapLabels[area.gap as keyof typeof gapLabels].label}
                </span>
                <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-foreground/10 text-foreground/70">
                  {area.score}%
                </span>
              </div>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full mb-3">
              <div
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  area.score >= 70
                    ? "bg-emerald-500"
                    : area.score >= 50
                    ? "bg-amber-500"
                    : "bg-red-500"
                )}
                style={{ width: `${area.score}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {area.detail}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

// --- Section 3: Action Items ---
function ActionItems() {
  const [items, setItems] = useState(demoActionItems);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const priorityColors = {
    High: "text-red-400",
    Medium: "text-amber-400",
    Low: "text-blue-400",
  };

  return (
    <Card className="p-6 border-dashed">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-9 w-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
          <Target className="h-5 w-5 text-amber-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">This Week's Action Items</h2>
          <p className="text-xs text-muted-foreground">
            {items.filter((i) => i.completed).length} of {items.length}{" "}
            completed
          </p>
        </div>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={cn(
              "w-full text-left p-4 rounded-xl border border-border/40 transition-all duration-200",
              item.completed
                ? "bg-primary/5 border-primary/20"
                : "bg-muted/30 hover:bg-muted/50"
            )}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {item.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground/40" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      item.completed &&
                        "line-through text-muted-foreground"
                    )}
                  >
                    {item.task}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.timeEstimate}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.detail}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}

// --- Section 4: Curated Resources ---
function CuratedResources() {
  const typeIcons = {
    docs: FileText,
    video: Video,
    tool: Wrench,
    lab: FlaskConical,
  };

  const typeColors = {
    docs: "text-blue-400 bg-blue-500/10",
    video: "text-red-400 bg-red-500/10",
    tool: "text-purple-400 bg-purple-500/10",
    lab: "text-emerald-400 bg-emerald-500/10",
  };

  return (
    <Card className="p-6 border-dashed">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
          <BookOpen className="h-5 w-5 text-blue-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Recommended Resources</h2>
          <p className="text-xs text-muted-foreground">
            Free resources curated for your weak areas
          </p>
        </div>
      </div>
      <div className="space-y-6">
        {demoResources.map((category) => (
          <div key={category.category}>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              {category.category}
            </h3>
            <div className="space-y-2">
              {category.items.map((item) => {
                const Icon = typeIcons[item.type];
                return (
                  <a
                    key={item.title}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/40 hover:bg-muted/50 hover:border-border/60 transition-all group"
                  >
                    <div
                      className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                        typeColors[item.type]
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium group-hover:text-primary transition-colors">
                          {item.title}
                        </span>
                        <ExternalLink className="h-3 w-3 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// --- Section 5: Certification Readiness ---
function CertificationReadiness() {
  const { categoryScores } = demoReportData;
  const readiness = demoMomentum.currentScore;
  const passingScore = demoMomentum.passingScore;

  return (
    <Card className="p-6 border-dashed">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
          <IconTargetFill size="20px" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Certification Readiness</h2>
          <p className="text-xs text-muted-foreground">
            AWS Solutions Architect Associate — passing score: {passingScore}%
          </p>
        </div>
      </div>

      {/* Overall readiness */}
      <div className="mb-6 p-4 rounded-xl bg-muted/30 border border-border/40">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Overall Readiness</span>
          <span className="text-lg font-mono font-semibold px-2.5 py-0.5 rounded bg-foreground/10 text-foreground/80">
            {readiness}%
          </span>
        </div>
        <div className="relative w-full h-2 bg-muted rounded-full">
          <div
            className="h-2 rounded-full bg-amber-500 transition-all"
            style={{ width: `${readiness}%` }}
          />
          {/* Passing threshold marker */}
          <div
            className="absolute top-0 h-2 w-0.5 bg-foreground/60"
            style={{ left: `${passingScore}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-xs text-muted-foreground">
            {demoMomentum.pointsNeeded} points to passing
          </span>
          <span className="text-xs text-muted-foreground">
            ~{demoMomentum.estimatedWeeksToPass} week to go
          </span>
        </div>
      </div>

      {/* Domain breakdown */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">
          Domain Breakdown
        </h3>
        {categoryScores.map((domain) => (
          <div key={domain.name} className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-44 shrink-0 truncate">
              {domain.name}
            </span>
            <div className="flex-1 h-1.5 bg-muted rounded-full">
              <div
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  domain.score >= 72
                    ? "bg-emerald-500"
                    : domain.score >= 60
                    ? "bg-amber-500"
                    : "bg-red-500"
                )}
                style={{ width: `${domain.score}%` }}
              />
            </div>
            <span className="text-xs font-mono font-medium px-1.5 py-0.5 rounded bg-foreground/10 text-foreground/70 w-12 text-center">
              {domain.score}%
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// --- Section 6: Momentum & Trend ---
function MomentumTrend() {
  const m = demoMomentum;
  const { performanceHistory } = demoReportData;

  return (
    <Card className="p-6 border-dashed">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <TrendingUp className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Momentum</h2>
          <p className="text-xs text-muted-foreground">
            Your trajectory over the last 5 attempts
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3 rounded-xl bg-muted/30 border border-border/40 text-center">
          <p className="text-xl font-mono font-bold text-foreground/80">
            +{m.weeklyImprovement}%
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">Per week</p>
        </div>
        <div className="p-3 rounded-xl bg-muted/30 border border-border/40 text-center">
          <p className="text-2xl font-bold">{m.streakDays}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Day streak</p>
        </div>
        <div className="p-3 rounded-xl bg-muted/30 border border-border/40 text-center">
          <p className="text-2xl font-bold">{m.totalStudyHours}h</p>
          <p className="text-xs text-muted-foreground mt-0.5">Study time</p>
        </div>
        <div className="p-3 rounded-xl bg-muted/30 border border-border/40 text-center">
          <p className="text-2xl font-bold">{m.attemptsUntilNextReport}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Until refresh
          </p>
        </div>
      </div>

      {/* Score progression */}
      <div className="p-4 rounded-xl bg-muted/30 border border-border/40">
        <h3 className="text-sm font-medium mb-3">Score Progression</h3>
        <div className="flex items-end gap-2 h-24">
          {performanceHistory.map((attempt, i) => {
            const isLatest = i === performanceHistory.length - 1;
            return (
              <div
                key={attempt.test}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <span
                  className={cn(
                    "text-[10px] font-mono font-medium px-1.5 py-0.5 rounded",
                    isLatest ? "bg-foreground/15 text-foreground/90" : "bg-foreground/5 text-foreground/50"
                  )}
                >
                  {attempt.score}%
                </span>
                <div
                  className={cn(
                    "w-full rounded-t-md transition-all",
                    isLatest ? "bg-primary" : "bg-muted-foreground/20"
                  )}
                  style={{ height: `${(attempt.score / 100) * 72}px` }}
                />
                <span className="text-[10px] text-muted-foreground">
                  #{i + 1}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <Flame className="h-3.5 w-3.5 text-amber-400" />
          <span>
            Your improvement rate is{" "}
            <span className="text-foreground font-medium">accelerating</span>{" "}
            — you're improving faster than your first 3 attempts
          </span>
        </div>
      </div>
    </Card>
  );
}

// --- Main Demo Report ---
export default function DemoAIReport() {
  return (
    <div className="mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold">AI Report</h1>
            <Badge
              variant="outline"
              className="text-xs bg-primary/10 text-primary border-primary/20"
            >
              Demo
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            AWS Solutions Architect Associate — refreshes every 3-5 attempts
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ArrowUpRight className="h-3.5 w-3.5 text-primary" />
          <span>
            Next refresh in{" "}
            <span className="text-foreground font-medium">2 attempts</span>
          </span>
        </div>
      </div>

      {/* Section 1: AI Coach Brief */}
      <CoachBrief />

      {/* Section 2 + 5: Weak Areas + Readiness side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeakAreaBreakdown />
        <CertificationReadiness />
      </div>

      {/* Section 3: Action Items */}
      <ActionItems />

      {/* Section 4 + 6: Resources + Momentum side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CuratedResources />
        <MomentumTrend />
      </div>
    </div>
  );
}
