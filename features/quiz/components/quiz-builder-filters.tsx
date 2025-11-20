"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/src/lib/trpc/react";
import { Loader2, Filter, X } from "lucide-react";

interface QuizBuilderFiltersProps {
  onFiltersChange: (filters: QuizFilters) => void;
}

export interface QuizFilters {
  provider: "AWS" | "Azure" | "GCP" | "Kubernetes" | "Terraform" | "Docker";
  limit: number;
  categoryId?: string;
  difficulty?: "BEGINER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
  service?: string;
  isMultiSelect?: boolean;
  mode: "practice" | "timed" | "exam";
  timeLimit?: number; // minutes for timed mode
}

const PROVIDERS = [
  { value: "AWS", label: "AWS", icon: "☁️" },
  { value: "Azure", label: "Azure", icon: "🔷" },
  { value: "GCP", label: "GCP", icon: "🌩️" },
  { value: "Kubernetes", label: "Kubernetes", icon: "⎈" },
  { value: "Terraform", label: "Terraform", icon: "🏗️" },
  { value: "Docker", label: "Docker", icon: "🐳" },
] as const;

const DIFFICULTIES = [
  { value: "BEGINER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
  { value: "EXPERT", label: "Expert" },
] as const;

const QUESTION_COUNTS = [5, 10, 20, 50];

const MODES = [
  { value: "practice", label: "Practice", description: "Untimed with instant feedback" },
  { value: "timed", label: "Timed", description: "Race against the clock" },
  { value: "exam", label: "Exam", description: "Simulate real exam conditions" },
] as const;

export function QuizBuilderFilters({ onFiltersChange }: QuizBuilderFiltersProps) {
  const [provider, setProvider] = useState<QuizFilters["provider"]>("AWS");
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [difficulty, setDifficulty] = useState<QuizFilters["difficulty"] | undefined>();
  const [service, setService] = useState<string | undefined>();
  const [isMultiSelect, setIsMultiSelect] = useState<boolean | undefined>();
  const [limit, setLimit] = useState(10);
  const [mode, setMode] = useState<QuizFilters["mode"]>("practice");
  const [timeLimit, setTimeLimit] = useState(30);

  // Fetch available topics for selected provider
  const { data: topics, isLoading: topicsLoading } = trpc.quiz.getTopics.useQuery(
    { provider },
    { refetchOnWindowFocus: false }
  );

  // Fetch available services for selected provider
  const { data: services, isLoading: servicesLoading } = trpc.quiz.getServices.useQuery(
    { provider },
    { refetchOnWindowFocus: false }
  );

  // Emit filter changes to parent
  useEffect(() => {
    const filters: QuizFilters = {
      provider,
      limit,
      mode,
      ...(categoryId && { categoryId }),
      ...(difficulty && { difficulty }),
      ...(service && { service }),
      ...(isMultiSelect !== undefined && { isMultiSelect }),
      ...(mode === "timed" && { timeLimit }),
    };
    onFiltersChange(filters);
  }, [provider, categoryId, difficulty, service, isMultiSelect, limit, mode, timeLimit, onFiltersChange]);

  const clearFilters = () => {
    setCategoryId(undefined);
    setDifficulty(undefined);
    setService(undefined);
    setIsMultiSelect(undefined);
  };

  const activeFilterCount = [categoryId, difficulty, service, isMultiSelect !== undefined].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Provider Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-foreground">
          Cloud Provider
        </label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {PROVIDERS.map((p) => (
            <button
              key={p.value}
              onClick={() => {
                setProvider(p.value);
                // Reset dependent filters when provider changes
                setCategoryId(undefined);
                setService(undefined);
              }}
              className={`flex flex-col items-center gap-2 rounded-lg border p-4 transition-all ${
                provider === p.value
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-border bg-background hover:border-foreground/20 hover:bg-foreground/5"
              }`}
            >
              <span className="text-2xl">{p.icon}</span>
              <span className="text-sm font-medium">{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quiz Mode */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-foreground">
          Quiz Mode
        </label>
        <div className="grid gap-3 sm:grid-cols-3">
          {MODES.map((m) => (
            <button
              key={m.value}
              onClick={() => setMode(m.value)}
              className={`rounded-lg border p-4 text-left transition-all ${
                mode === m.value
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-border bg-background hover:border-foreground/20 hover:bg-foreground/5"
              }`}
            >
              <div className="font-semibold text-foreground">{m.label}</div>
              <div className="text-sm text-foreground/60">{m.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Time Limit for Timed Mode */}
      {mode === "timed" && (
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-foreground">
            Time Limit (minutes)
          </label>
          <div className="flex gap-2">
            {[15, 30, 45, 60].map((minutes) => (
              <button
                key={minutes}
                onClick={() => setTimeLimit(minutes)}
                className={`flex-1 rounded-lg border p-3 text-sm font-medium transition-all ${
                  timeLimit === minutes
                    ? "border-emerald-500 bg-emerald-500/10 text-foreground"
                    : "border-border bg-background text-foreground/60 hover:border-foreground/20"
                }`}
              >
                {minutes}m
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Question Count */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-foreground">
          Number of Questions
        </label>
        <div className="grid grid-cols-4 gap-3">
          {QUESTION_COUNTS.map((count) => (
            <button
              key={count}
              onClick={() => setLimit(count)}
              className={`rounded-lg border p-3 text-sm font-medium transition-all ${
                limit === count
                  ? "border-emerald-500 bg-emerald-500/10 text-foreground"
                  : "border-border bg-background text-foreground/60 hover:border-foreground/20"
              }`}
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="rounded-lg border border-border bg-background/50 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-foreground/60" />
            <h3 className="font-semibold text-foreground">Advanced Filters</h3>
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                {activeFilterCount} active
              </span>
            )}
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm text-foreground/60 hover:text-foreground"
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Category/Topic Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Topic
            </label>
            <select
              value={categoryId || ""}
              onChange={(e) => setCategoryId(e.target.value || undefined)}
              disabled={topicsLoading}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors hover:border-foreground/20 focus:border-emerald-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">All Topics</option>
              {topicsLoading && (
                <option disabled>Loading topics...</option>
              )}
              {topics?.map((topic: { id: string; name: string; description: string | null }) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Difficulty
            </label>
            <select
              value={difficulty || ""}
              onChange={(e) => setDifficulty((e.target.value || undefined) as QuizFilters["difficulty"])}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors hover:border-foreground/20 focus:border-emerald-500 focus:outline-none"
            >
              <option value="">All Levels</option>
              {DIFFICULTIES.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          {/* Service Filter (AWS only for now) */}
          {provider === "AWS" && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                AWS Service
              </label>
              <select
                value={service || ""}
                onChange={(e) => setService(e.target.value || undefined)}
                disabled={servicesLoading}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors hover:border-foreground/20 focus:border-emerald-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">All Services</option>
                {servicesLoading && (
                  <option disabled>Loading services...</option>
                )}
                {services?.map((svc: string) => (
                  <option key={svc} value={svc}>
                    {svc}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Question Type Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Question Type
            </label>
            <select
              value={isMultiSelect === undefined ? "" : isMultiSelect ? "multi" : "single"}
              onChange={(e) => {
                const val = e.target.value;
                setIsMultiSelect(val === "" ? undefined : val === "multi");
              }}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors hover:border-foreground/20 focus:border-emerald-500 focus:outline-none"
            >
              <option value="">All Types</option>
              <option value="single">Single Choice</option>
              <option value="multi">Multiple Choice</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
