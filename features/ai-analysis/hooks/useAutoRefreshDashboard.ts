import { useEffect } from "react";
import { trpc } from "@/src/lib/trpc/react";

const STALE_THRESHOLD_MS = 24 * 60 * 60 * 1000; // 24 hours

export function useAutoRefreshDashboard() {
  const { data: dashboard } = trpc.analysis.getDashboardAnalysis.useQuery();
  const utils = trpc.useUtils();

  useEffect(() => {
    if (!dashboard?.lastUpdatedAt) return;

    const lastUpdate = new Date(dashboard.lastUpdatedAt);
    const now = new Date();
    const age = now.getTime() - lastUpdate.getTime();

    // If data is stale (>24 hours old), trigger refresh
    if (age > STALE_THRESHOLD_MS) {
      fetch("/api/analysis/refresh", { method: "POST" })
        .then(() => {
          // Invalidate cache after refresh triggered
          setTimeout(() => {
            utils.analysis.getDashboardAnalysis.invalidate();
          }, 2000);
        })
        .catch((err) => console.error("Failed to refresh dashboard:", err));
    }
  }, [dashboard?.lastUpdatedAt, utils]);

  return {
    isStale: dashboard?.lastUpdatedAt
      ? new Date().getTime() - new Date(dashboard.lastUpdatedAt).getTime() >
        STALE_THRESHOLD_MS
      : false,
  };
}
