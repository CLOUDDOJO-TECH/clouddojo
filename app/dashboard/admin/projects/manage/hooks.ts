"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllProjects, ProjectTableData } from "./actions";

export function useGetAllProjects(initialData?: ProjectTableData[]) {
  return useQuery({
    queryKey: ["allProjects"],
    queryFn: async () => {
      const result = await getAllProjects();
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch projects");
      }
      return result.projects;
    },
    initialData: initialData,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: false,
  });
}
