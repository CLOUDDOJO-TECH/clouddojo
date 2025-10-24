"use client";

import { useState, useCallback } from "react";
import {
  LeaderboardHeader,
  Podium,
  LeaderboardTable,
  LoadingState,
  ErrorState,
  EmptyState,
} from "./components";
import useGetLeaderboardData from "@/app/(actions)/leaderboard";

/**
 * Main leaderboard page component
 */
export default function LeaderboardPage() {
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

  const {
    leaderboardData = [], // Provide default empty array
    isLoadingLeaderboardData,
    errorLeaderboardData: error,
    isErrorLeaderboardData: isError,
  } = useGetLeaderboardData(timeRange);

  // Handle time range change
  const handleTimeRangeChange = (range: TimeRangeOption) => {
    setTimeRange(range);
  };

  // Show loading state
  if (isLoadingLeaderboardData) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <LoadingState />
      </div>
    );
  }

  // Show error state
  if (isError && error) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <ErrorState
          error={
            error instanceof Error ? error.message : "An unknown error occurred"
          }
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  // Show empty state if no data
  const isEmpty = leaderboardData.length === 0;

  // Extract top three performers
  const topThree = leaderboardData.slice(0, 3);

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <LeaderboardHeader
        handleTimeRangeChange={handleTimeRangeChange}
        timeRange={timeRange}
      />

      {isEmpty ? (
        <div className="flex justify-center items-center py-20">
          <EmptyState />
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
