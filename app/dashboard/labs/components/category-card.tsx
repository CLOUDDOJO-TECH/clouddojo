"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface CategoryCardProps {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  projectCount: number;
  description?: string | null;
}

/**
 * CategoryCard component displays a beautiful card with category image and project count
 * Matches the design inspiration provided
 */
export function CategoryCard({
  id,
  name,
  slug,
  imageUrl,
  projectCount,
  description,
}: CategoryCardProps) {
  return (
    <Link href={`/dashboard/labs/category/${slug}`} className="group">
      <Card className="relative overflow-hidden rounded-2xl border-none shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer h-[280px] md:h-[320px]">
        {/* Background Image */}
        <div className="absolute inset-0">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            // Fallback gradient if no image
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500" />
          )}

          {/* Dark overlay gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-end p-6">
          {/* Category Name */}
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-3 drop-shadow-lg">
            {name}
          </h3>

          {/* Project Count Badge */}
          <Badge className="w-fit bg-white text-black hover:bg-white/90 font-semibold px-3 py-1 rounded-full">
            {projectCount} {projectCount === 1 ? "Project" : "Projects"}
          </Badge>

          {/* Optional Description (hidden by default, shown on hover) */}
          {description && (
            <p className="text-white/80 text-sm mt-2 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {description}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}

/**
 * Skeleton loading state for CategoryCard
 */
export function CategoryCardSkeleton() {
  return (
    <Card className="relative overflow-hidden rounded-2xl border-none shadow-lg h-[280px] md:h-[320px]">
      <div className="absolute inset-0 bg-gray-200 dark:bg-muted animate-pulse" />
      <div className="relative h-full flex flex-col justify-end p-6">
        <div className="h-10 w-32 bg-gray-300 dark:bg-muted rounded mb-3" />
        <div className="h-6 w-24 bg-gray-300 dark:bg-muted rounded-full" />
      </div>
    </Card>
  );
}
