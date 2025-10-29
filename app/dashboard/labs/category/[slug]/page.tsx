import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectsClient } from "./components/projects-client";
import { CategoryHero } from "./components/category-hero";
import { getProjectsByCategory } from "@/app/(actions)/project-categories/server-actions";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}

/**
 * Server Component - Fetches project data on the server
 * More efficient than client-side fetching
 */
export default async function CategoryProjectsPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const searchParamsResolved = await searchParams;
  const search = searchParamsResolved.search;
  const page = searchParamsResolved.page
    ? parseInt(searchParamsResolved.page)
    : 1;

  let data;

  try {
    // Fetch projects directly on the server
    data = await getProjectsByCategory(slug, {
      search,
      page,
      limit: 12,
    });
  } catch (error) {
    // If category not found, show 404
    notFound();
  }

  const { category, projects, pagination } = data;

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Projects List with Search, Filters, and Hero */}
      <Suspense
        fallback={
          <div className="space-y-6">
            <Skeleton className="h-12 w-full max-w-2xl rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-80 w-full rounded-lg bg-gray-200 dark:bg-muted"
                />
              ))}
            </div>
          </div>
        }
      >
        <ProjectsClient
          initialProjects={projects}
          initialPagination={pagination}
          categorySlug={slug}
          category={category}
        />
      </Suspense>
    </div>
  );
}
