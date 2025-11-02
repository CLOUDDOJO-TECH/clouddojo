"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllProjects } from "./actions";

/**
 * initialData: optional object in the shape { projects: ProjectTableData[] }
 *
 * Behavior:
 * - If initialData is provided, the query will be pre-populated and no client fetch
 *   will be performed (enabled: false). This avoids calling server-only code from client.
 * - If no initialData is provided, the hook will be disabled by default (no fetch).
 *   You can later wire a queryFn that calls an API route if you want client refetching.
 */
export function useGetAllProjects(initialData?: { projects: any[] } | null) {
  return useQuery({
    queryKey: ["allProjects"],
    queryFn: async () => {
      getAllProjects();
      throw new Error(
        "No client-side fetch implemented for projects. Provide initialData or implement an API route.",
      );
    },
    initialData: initialData ? { projects: initialData } : undefined,
    // Disable automatic client fetch if we already have initialData:
    enabled: !initialData,
    staleTime: 1000 * 60 * 5, // 5 minutes (optional)
  });
}
