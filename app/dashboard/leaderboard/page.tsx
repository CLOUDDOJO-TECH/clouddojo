"use client";

import { useState, useEffect, useCallback } from "react";
import {
  LeaderboardHeader,
  TimeRangeSelector,
  Podium,
  LeaderboardTable,
  LoadingState,
  ErrorState,
  EmptyState,
} from "./components";
import { LeaderboardEntry, TimeRangeOption } from "./types";

/**
 * Main leaderboard page component
 */
export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [timeRange, setTimeRange] = useState<TimeRangeOption>("weekly");

  // Helper function for generating avatar fallback text
  const getAvatarFallback = useCallback(
    (firstName?: string, lastName?: string) => {
      return (
        `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "U"
      );
    },
    [],
  );

  // Fetch data when time range changes
  const fetchLeaderboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/leaderboard?timeRange=${timeRange}`);
      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard data");
      }
      const data = await response.json();
      setLeaderboardData(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  }, [timeRange]);

  // Retry handler for error state
  const handleRetry = () => {
    fetchLeaderboardData();
  };

  // Set default time range and fetch initial data
  useEffect(() => {
    fetchLeaderboardData();
  }, [fetchLeaderboardData]);

  // Handle time range change
  const handleTimeRangeChange = (range: TimeRangeOption) => {
    setTimeRange(range);
  };

  // Show appropriate state based on data loading status
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <ErrorState error={error} onRetry={handleRetry} />
      </div>
    );
  }

  if (leaderboardData.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <EmptyState />
      </div>
    );
  }

  // Extract top three performers
  const topThree = leaderboardData.slice(0, 3);

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <LeaderboardHeader />

      <TimeRangeSelector
        timeRange={timeRange}
        onTimeRangeChange={handleTimeRangeChange}
      />

      {topThree.length > 0 && <Podium topThree={topThree} />}

      {leaderboardData.length > 3 && (
        <LeaderboardTable
          leaderboardData={leaderboardData}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          getAvatarFallback={getAvatarFallback}
        />
      )}

      {/* Special case when we have 1-3 users and they're all on the podium */}
      {leaderboardData.length <= 3 &&
        leaderboardData.length > 0 &&
        topThree.length === leaderboardData.length && (
          <div className="text-center py-10 text-lg text-muted-foreground">
            All users are on the podium!
          </div>
        )}
    </div>
  );
}
