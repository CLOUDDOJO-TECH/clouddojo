import { Suspense } from "react";
import { CategoryCardSkeleton } from "./components/category-card";
import { CategoriesClient } from "./components/categories-client";
import { getProjectCategories } from "@/app/(actions)/project-categories/server-actions";

/**
 * Server Component - Fetches data on the server
 * Much more efficient than API routes for initial page load
 */
export default async function HandsOnLabsPage() {
  // Fetch categories directly on the server
  const categories = await getProjectCategories();

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <Suspense
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <CategoriesClient categories={categories} />
      </Suspense>
    </div>
  );
}
