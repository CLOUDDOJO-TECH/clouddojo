import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { ProjectCategory } from "@/validations/project-types";

export interface ProjectCategoriesResponse {
  categories: ProjectCategory[];
}

/**
 * Hook to fetch all project categories with project counts
 */
export function useProjectCategories() {
  const { getToken } = useAuth();

  return useQuery<ProjectCategoriesResponse>({
    queryKey: ["projectCategories"],
    queryFn: async () => {
      const token = await getToken();
      const response = await fetch("/api/project-categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch project categories");
      }

      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
