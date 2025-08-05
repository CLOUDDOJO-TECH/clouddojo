"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Clock,
  FileQuestion,
  Check,
  LayoutGrid,
  List,
  BookmarkCheck,
  Zap,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
} from "@/components/ui/card";
import { ExitTestAlert } from "@/components/dashboard/exit-test-alert";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import FilterComponent from "@/components/dashboard/filter-component";
import SearchBar from "@/components/dashboard/search-bar";
import Link from "next/link";
import { GetPracticeTests } from "@/app/(actions)/quiz/get-quizes";
import prisma from "@/lib/prisma";
import { useQuery } from "@tanstack/react-query";
import { type DifficultyLevel, type Quiz } from "@prisma/client";
import { cn } from "@/lib/utils";
import PracticeTestsSkeleton from "./components/PracticeTestsSkeleton";
import { useRouter } from "next/navigation";
import { useSubscription } from "@/hooks/use-subscription";
import PracticeTestCard from "@/components/dashboard/test-card";
import UpgradeButton from "@/components/ui/upgrade-button";
import MainFilters from "./main-filters";

export default function PracticeTestsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    topics: [] as string[],
    level: "all",
  });
  const [sortBy, setSortBy] = useState<"newest" | "popular" | "duration">(
    "newest"
  );
  const [showExitAlert, setShowExitAlert] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null
  );
  const [view, setView] = useState<"grid" | "list">(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768 ? "list" : "grid";
    }
    return "grid";
  });

  // Check for ongoing test
  const hasOngoingTest = useMemo(() => {
    // You should implement this based on your actual test state management
    // For example, check localStorage or your state management solution
    if (typeof window !== "undefined") {
      return localStorage.getItem("ongoingTest") !== null;
    }
    return false;
  }, []);

  // Handle navigation with test in progress
  const handleNavigation = (testId: string) => {
    if (hasOngoingTest) {
      setPendingNavigation(testId);
      setShowExitAlert(true);
    } else {
      router.push(`/dashboard/practice/${testId}`);
    }
  };

  // Handle exit confirmation
  const handleExitConfirm = () => {
    if (pendingNavigation) {
      localStorage.removeItem("ongoingTest");
      router.push(`/dashboard/practice/${pendingNavigation}`);
      setPendingNavigation(null);
    }
    setShowExitAlert(false);
  };

  // Update view based on screen size
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const handleResize = (e: MediaQueryListEvent | MediaQueryList) => {
      setView(e.matches ? "grid" : "list");
    };

    handleResize(mediaQuery);
    mediaQuery.addListener(handleResize);
    return () => mediaQuery.removeListener(handleResize);
  }, []);

  const { data, isSuccess, isLoading, isError } = useQuery({
    queryKey: ["practiceTests"],
    queryFn: async () => await GetPracticeTests(),
  });

  // Filter and sort tests
  const processedTests = useMemo(() => {
    if (!data?.data) return [];

    // First filter
    let results = data.data.filter((test) => {
      // Level filtering
      const matchesLevel = filters.level === "all" || 
        (test.level && test.level.toString() === filters.level);
      
      // Topic filtering with expanded search
      // Check if any topic matches in category ID, title, description, or category name
      const matchesTopics = filters.topics.length === 0 || 
        filters.topics.some(topic => {
          const topicLower = topic.toLowerCase();
          return (
            (test.category && test.category.id.toLowerCase() === topicLower) ||
            (test.title && test.title.toLowerCase().includes(topicLower)) ||
            (test.description && test.description.toLowerCase().includes(topicLower)) ||
            (test.category && test.category.name && 
             test.category.name.toLowerCase().includes(topicLower))
          );
        });
      
      if (searchQuery === "") {
        return matchesLevel && matchesTopics;
      }

      const searchLower = searchQuery.toLowerCase().trim();
      const titleMatch = test.title?.toLowerCase().includes(searchLower) ?? false;
      const descriptionMatch = test.description?.toLowerCase().includes(searchLower) ?? false;
      const categoryMatch = test.category?.name?.toLowerCase().includes(searchLower) ?? false;
      
      return matchesLevel && 
             matchesTopics && 
             (titleMatch || descriptionMatch || categoryMatch);
    });

    // final sorting
    return results.sort((a, b) => {
      switch (sortBy) {
        case "duration":
          return (a.duration || 0) - (b.duration || 0);
        case "popular":
          // You might want to add a completions/attempts count to your test model
          return (b._count?.questions || 0) - (a._count?.questions || 0);
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        default:
          return -1; // For now, maintain original order
      }
    });
  }, [data?.data, searchQuery, filters, sortBy]);

  const handleFilter = (newFilters: { topics: string[]; level: string }) => {
    setFilters(newFilters);
  };

  // Show skeleton UI during loading
  if (isLoading) {
    return <PracticeTestsSkeleton view={view} />;
  }

  // Show error state
  if (isError) {
    return (
      <div className="container p-4 md:p-6 pt-16 md:pt-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="font-medium">Error loading practice tests</p>
          <p className="text-sm">Please try again later or refresh the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 flex  max-w-7xl mx-auto container">
      <ExitTestAlert
        isOpen={showExitAlert}
        onClose={() => setShowExitAlert(false)}
        onContinue={handleExitConfirm}
      />
      <div className="flex-1">
        <div className="px-8 md:px-12  pt-10 md:pt-12">
          <div className="flex flex-col gap-6">
            {/* Header Section */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl  font-semibold">Practice Tests</h1>
                  {/* {processedTests.length > 0 && ( */}
                    <p className="text-muted-foreground font-mono mt-1">
                      {processedTests.length}{" "}
                      {processedTests.length === 1 ? "test" : "tests"} available
                    </p>
                  {/* )} */}
                </div>
              </div>

              {/* Controls Section */}
              <div className="flex flex-col gap-4">
                
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center w-full">
                  <span className="flex space-x-3">
                    <SearchBar onSearch={(query) => setSearchQuery(query)} />
                    <MainFilters onFilter={handleFilter} />
                    <FilterComponent onFilter={handleFilter} />
                  </span>
                  <div className="flex gap-3 items-center">
                    <select
                      className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                      value={sortBy}
                      onChange={(e) =>
                        setSortBy(e.target.value as typeof sortBy)
                      }
                    >
                      <option value="newest">Newest</option>
                      <option value="popular">Most Popular</option>
                      <option value="duration">Duration</option>
                    </select>
                    <div className="hidden md:block">
                      <ToggleGroup
                        type="single"
                        value={view}
                        className="p-1"
                        onValueChange={(value) =>
                          value && setView(value as "grid" | "list")
                        }
                      >
                        <ToggleGroupItem value="grid" aria-label="Grid view">
                          <LayoutGrid className="h-3 w-3" />
                        </ToggleGroupItem>
                        <ToggleGroupItem value="list" aria-label="List view">
                          <List className="h-3 w-3" />
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="mt-2">
              {processedTests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/10 rounded-lg border border-dashed">
                  <FileQuestion className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No tests found</h3>
                  {searchQuery ||
                  filters.topics.length > 0 ||
                  filters.level !== "all" ? (
                    <div className="max-w-sm">
                      <p className="text-muted-foreground font-mono mt-2">
                        No tests match your current filters. Try adjusting your
                        search terms or clearing some filters.
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => {
                          setSearchQuery("");
                          setFilters({ topics: [], level: "all" });
                        }}
                      >
                        Clear all filters
                      </Button>
                    </div>
                  ) : (
                    <p className="text-muted-foreground mt-2">
                      Check back later for new practice tests
                    </p>
                  )}
                </div>
              ) : view === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {processedTests.map((test) => (
                    <TestCard
                      key={test.id}
                      test={test}
                      view="grid"
                      onStartTest={() => handleNavigation(test.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {processedTests.map((test) => (
                    <TestCard
                      key={test.id}
                      test={test}
                      view="list"
                      onStartTest={() => handleNavigation(test.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface TestCardProps {
  test: {
    id: string;
    title: string;
    description?: string | null;
    thumbnail?: string | null;
    level?: DifficultyLevel | null;
    duration?: number | null;
    free?: boolean | null;
    isNew?: boolean | null;
    _count?: {
      questions: number;
    };
    category?: {
      id: string;
      name: string;
    } | null;
  };
  view: "grid" | "list";
  onStartTest: () => void;
}

function TestCard({ test, view, onStartTest }: TestCardProps) {
  const {
    isPro,
    isPremium,
    planName,
    isLoading: planLoading,
    isError: planError,
  } = useSubscription();

  // check if the user has a Pro or Premium plan or even if the test if free in the firs place
  const hasAccess = test.free || isPro || isPremium;

  const getLevelColor = (level: string) => {
    switch (level) {
      case "BEGINER":
        return "bg-brand-beige-50 text-brand-beige-800 dark:bg-brand-beige-900 dark:text-brand-beige-300";
      case "INTERMEDIATE":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "ADVANCED":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "EXPERT":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  if (view === "grid") {
    return (
      <PracticeTestCard
        test={test}
        questionsCount={test._count?.questions as number}
        onStartTest={onStartTest}
      />
    );
  } else {
    return (
      <Card className="overflow-hidden transition-all hover:shadow-md group">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/4 lg:w-1/5 aspect-video md:aspect-square relative overflow-hidden">
            {test.free && (
              <span className="inline-flex absolute top-2 left-2 items-center rounded-md bg-yellow-400 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-yellow-600/40 ring-inset">
                <BookmarkCheck className="mr-1 h-4 w-4" />
                New
              </span>
            )}
            <img
              src={test.thumbnail ? test.thumbnail : "/aws-bg-image.jpg"}
              className="object-cover w-full h-full transition-transform group-hover:scale-105"
              alt={test.title}
            />
            {hasAccess ? (
              <Badge className="absolute top-2 right-2 bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">
                Free
              </Badge>
            ) : (
              <Badge className="absolute top-2 right-2 bg-gradient-to-b from-emerald-500 to-emerald-600 text-white dark:bg-emerald-900 dark:text-emerald-300 focus:ring-2 focus:ring-emerald-400 hover:shadow-xl transition duration-200">
                Upgrade
              </Badge>
            )}
          </div>
          <div className="flex-1 p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
              <div>
                {test.level && (
                  <Badge
                    variant="outline"
                    className={`mb-2 ${getLevelColor(test.level)}`}
                  >
                    {test.level.charAt(0).toUpperCase() +
                      test.level.slice(1).toLowerCase()}
                  </Badge>
                )}
                <h3 className="font-semibold text-lg">{test.title}</h3>
              </div>
              {hasAccess ? (
                <Button
                  onClick={onStartTest}
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                    className: "border-none rounded-lg",
                  })}
                >
                  Start Test
                </Button>
              ) : (
                <UpgradeButton className="mt-2" size="sm" variant="primary">
                  Upgrade plan
                </UpgradeButton>
              )}
            </div>
            <p className="text-muted-foreground font-mono text-sm mb-3">
              {test.description}
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <FileQuestion className="h-4 w-4 text-muted-foreground" />
                <span>{test._count?.questions} questions</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{test.duration} min</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }
}
