"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Link as LinkIcon } from "lucide-react";
import Image from "next/image";

interface CategoryHeroProps {
  name: string;
  description: string | null;
  imageUrl: string | null;
  projectCount: number;
}

/**
 * Hero banner component for category pages
 * Displays category image, title, description, and actions
 */
export function CategoryHero({
  name,
  description,
  imageUrl,
  projectCount,
}: CategoryHeroProps) {
  return (
    <div className="relative w-full mb-8 rounded-2xl overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="relative w-full h-[280px] md:h-[320px]">
        {/* Image */}
        <div className="absolute inset-0">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/30 via-primary/20 to-secondary/30" />
          )}
        </div>

        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />

        {/* Content */}
        <div className="relative h-full flex flex-col justify-end p-6 md:p-8">
          {/* Bottom Content */}
          <div className="space-y-4">
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              {name}
            </h1>

            {/* Project Count Badge and Actions */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Project Count Badge */}
              <Badge
                variant="secondary"
                className="bg-primary/90 text-primary-foreground backdrop-blur-sm hover:bg-primary px-3 py-1.5 text-sm font-medium"
              >
                {projectCount} {projectCount === 1 ? "Project" : "Projects"}
              </Badge>

              {/* Action Buttons */}
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border-white/30"
              >
                <Check className="h-4 w-4 mr-2" />
                Mark Complete
              </Button>

              <Button
                size="sm"
                variant="secondary"
                className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border-white/30"
              >
                <LinkIcon className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>

            {/* Description */}
            {description && (
              <p className="text-white/90 text-base md:text-lg max-w-3xl">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
