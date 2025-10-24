// hooks handler for all things concerning leaderboard
import {
  LeaderboardEntry,
  TimeRangeOption,
} from "@/app/dashboard/leaderboard/types";
import { useQuery } from "@tanstack/react-query";

function useGetLeaderboardData(timeRange: TimeRangeOption) {
  const {
    data: leaderboardData,
    isLoading: isLoadingLeaderboardData,
    error: errorLeaderboardData,
    isError: isErrorLeaderboardData,
    isSuccess: isSuccessLeaderboardData,
  } = useQuery({
    queryKey: ["leaderboardData", timeRange],
    queryFn: async (): Promise<LeaderboardEntry[]> => {
      const response = await fetch(`/api/leaderboard?timeRange=${timeRange}`);
      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard data");
      }
      return await response.json();
    },
    enabled: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  return {
    leaderboardData,
    isLoadingLeaderboardData,
    errorLeaderboardData,
    isErrorLeaderboardData,
    isSuccessLeaderboardData,
  };
}

export default useGetLeaderboardData;
