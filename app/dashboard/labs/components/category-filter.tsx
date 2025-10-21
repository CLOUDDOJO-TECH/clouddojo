"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Clock, Zap } from "lucide-react";

interface Category {
  id: string;
  name: string;
  description?: string;
  projectCount: number;
  userStats: {
    completed: number;
    inProgress: number;
    notStarted: number;
  };
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  isLoading: boolean;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  isLoading,
}: CategoryFilterProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Browse by Category</h2>
        {selectedCategory && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCategoryChange("")}
          >
            Clear Filter
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.name;
          const completionRate = category.projectCount > 0 
            ? Math.round((category.userStats.completed / category.projectCount) * 100) 
            : 0;

          return (
            <Card
              key={category.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected 
                  ? "ring-2 ring-primary bg-primary/5" 
                  : "hover:border-border/80"
              }`}
              onClick={() => onCategoryChange(isSelected ? "" : category.name)}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-base leading-tight">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {category.description}
                        </p>
                      )}
                    </div>
                    <Badge variant="outline" className="shrink-0 text-xs">
                      {category.projectCount} projects
                    </Badge>
                  </div>

                  {/* Progress Stats */}
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-muted-foreground">
                        {category.userStats.completed}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-blue-500" />
                      <span className="text-muted-foreground">
                        {category.userStats.inProgress}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Zap className="h-3 w-3 text-gray-400" />
                      <span className="text-muted-foreground">
                        {category.userStats.notStarted}
                      </span>
                    </div>
                  </div>

                  {/* Completion Rate */}
                  {completionRate > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Your progress</span>
                        <span className="font-medium">{completionRate}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div
                          className="bg-primary h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${completionRate}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}