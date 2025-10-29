"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { CategoryCard } from "./category-card";
import { ProjectCategory } from "@/validations/project-types";

interface CategoriesClientProps {
  categories: ProjectCategory[];
}

/**
 * Client component for interactive category filtering
 * Handles search and filter state
 */
export function CategoriesClient({ categories }: CategoriesClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Filter categories based on selected filter and search
  const filteredCategories = categories.filter((category) => {
    // Apply filter tabs
    if (selectedFilter !== "all" && category.slug !== selectedFilter) {
      return false;
    }

    // Apply search
    if (searchQuery) {
      return (
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return true;
  });

  return (
    <>
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="I want to learn..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 text-base rounded-full bg-muted/50"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        <Button
          variant={selectedFilter === "all" ? "default" : "outline"}
          onClick={() => setSelectedFilter("all")}
          className="rounded-full"
        >
          All
        </Button>
        <Button
          variant={selectedFilter === "roadmaps" ? "default" : "outline"}
          onClick={() => setSelectedFilter("roadmaps")}
          className="rounded-full"
        >
          Roadmaps
        </Button>
        <Button
          variant={selectedFilter === "specialty" ? "default" : "outline"}
          onClick={() => setSelectedFilter("specialty")}
          className="rounded-full"
        >
          Specialty
        </Button>
        <Button
          variant={selectedFilter === "tools" ? "default" : "outline"}
          onClick={() => setSelectedFilter("tools")}
          className="rounded-full"
        >
          Tools
        </Button>
      </div>

      {/* Categories Grid */}
      {filteredCategories.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No categories found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category.id}
              id={category.id}
              name={category.name}
              slug={category.slug}
              imageUrl={category.imageUrl}
              projectCount={category.projectCount}
              description={category.description}
            />
          ))}
        </div>
      )}
    </>
  );
}
