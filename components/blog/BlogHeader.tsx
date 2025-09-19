"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { BlogEyebrow } from "./blog-eyebrow";

interface BlogHeaderProps {
  title: string;
  subtitle: string;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const BlogHeader = ({
  title,
  subtitle,
  categories,
  selectedCategory,
  onCategoryChange,
}: BlogHeaderProps) => {
  return (
    <div className="flex flex-col items-center gap-8 text-center relative">
      <div className="space-y-6">
        <div className="space-y-4">
          <BlogEyebrow />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-center">
            {title}
          </h1>
          <p className="text-lg text-muted-foreground flex items-center justify-center leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={cn(
              "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border",
              selectedCategory === category
                ? "bg-foreground text-background border-transparent shadow-lg"
                : "bg-background hover:bg-muted text-muted-foreground hover:text-foreground border-border hover:border-foreground/30 hover:shadow-md",
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};
