"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ProjectListItem } from "./project-list-item";
import { CategoryHero } from "./category-hero";
import { Project, Pagination } from "@/validations/project-types";

interface ProjectsClientProps {
  initialProjects: Project[];
  initialPagination: Pagination;
  categorySlug: string;
  category: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
  };
}

/**
 * Client component for interactive project filtering and pagination
 */
export function ProjectsClient({
  initialProjects,
  initialPagination,
  categorySlug,
  category,
}: ProjectsClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handlePageChange = (newPage: number) => {
    startTransition(() => {
      const params = new URLSearchParams();
      params.set("page", newPage.toString());
      router.push(
        `/dashboard/labs/category/${categorySlug}?${params.toString()}`,
      );
    });
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <Link href="/dashboard/labs">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      {/* Category Hero Banner */}
      <CategoryHero
        name={category.name}
        description={category.description}
        imageUrl={category.imageUrl}
        projectCount={initialPagination.totalCount}
      />

      {/* Projects List */}
      {initialProjects.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No projects found</h3>
          <p className="text-muted-foreground mb-4">
            No projects available in this category yet
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {initialProjects.map((project) => (
              <ProjectListItem key={project.id} project={project} />
            ))}
          </div>

          {/* Pagination */}
          {initialPagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <Button
                variant="outline"
                onClick={() =>
                  handlePageChange(Math.max(1, initialPagination.page - 1))
                }
                disabled={!initialPagination.hasPreviousPage || isPending}
              >
                Previous
              </Button>

              <span className="text-sm text-muted-foreground">
                Page {initialPagination.page} of {initialPagination.totalPages}
              </span>

              <Button
                variant="outline"
                onClick={() => handlePageChange(initialPagination.page + 1)}
                disabled={!initialPagination.hasNextPage || isPending}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
