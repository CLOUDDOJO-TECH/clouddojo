import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { ProjectsByCategoryResponse } from "@/validations/project-types";

/**
 * Hook to fetch projects for a specific category
 */
export function useProjectsByCategory(
  slug: string,
  options?: {
    search?: string;
    page?: number;
    limit?: number;
    enabled?: boolean;
  },
) {
  const { getToken } = useAuth();
  const { search, page = 1, limit = 20, enabled = true } = options || {};

  return useQuery<ProjectsByCategoryResponse>({
    queryKey: ["projectsByCategory", slug, search, page, limit],
    queryFn: async () => {
      const token = await getToken();
      const params = new URLSearchParams();

      if (search) params.append("search", search);
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      const response = await fetch(
        `/api/project-categories/${slug}/projects?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      return response.json();
    },
    enabled: enabled && !!slug,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
