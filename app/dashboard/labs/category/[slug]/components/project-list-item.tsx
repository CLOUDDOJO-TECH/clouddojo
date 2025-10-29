"use client";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Minus, Clock, Crown } from "lucide-react";
import Link from "next/link";
import { Project } from "@/validations/project-types";
import { useState } from "react";
import { toast } from "sonner";

interface ProjectListItemProps {
  project: Project;
}

/**
 * Project list item component - displays project as a row
 * Matches the design from the reference image
 */
export function ProjectListItem({ project }: ProjectListItemProps) {
  // Get primary category
  const primaryCategory = project.category || project.categories?.[0];

  // Generate avatar placeholders (for demonstration)
  const avatarColors = ["bg-blue-500", "bg-purple-500", "bg-pink-500"];
  const completionCount = project.completionCount || 0;

  // Calculate progress percentage
  const progressPercentage = project.userProgress?.progressPercentage || 0;

  // State for add to projects
  const [isAdded, setIsAdded] = useState(false);

  // Format estimated time
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h`;
  };

  // Handle add/remove to projects
  const handleToggleProject = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Stop event bubbling

    const newState = !isAdded;
    setIsAdded(newState);

    // Show toast notification
    if (newState) {
      toast.success("Project Added! 🎉", {
        description: `"${project.title}" has been added to your projects.`,
      });

      // TODO: Add API call to add project to user's projects
    } else {
      toast.info("Project Removed", {
        description: `"${project.title}" has been removed from your projects.`,
      });

      // TODO: Add API call to remove project from user's projects
    }
  };

  return (
    <Link
      href={`/dashboard/labs/${project.id}`}
      className="flex items-center justify-between py-5 px-2 hover:bg-muted/50 rounded-lg transition-colors group"
    >
      {/* Left side: Progress Circle + Category/Title + Metadata + Avatars + Completion */}
      <div className="flex items-center gap-4 flex-1">
        {/* Progress Circle Indicator */}
        <div className="relative w-5 h-5 flex-shrink-0">
          {/* Background circle */}
          <div className="absolute inset-0 rounded-full border-2 border-muted-foreground/30" />

          {/* Progress arc */}
          {progressPercentage > 0 && (
            <svg className="absolute inset-0 w-5 h-5 -rotate-90">
              <circle
                cx="10"
                cy="10"
                r="8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={`${(progressPercentage / 100) * 50.24} 50.24`}
                className="text-primary"
              />
            </svg>
          )}

          {/* Filled circle for 100% completion */}
          {progressPercentage === 100 && (
            <div className="absolute inset-0 rounded-full bg-primary" />
          )}
        </div>

        {/* Title and Metadata */}
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <h3 className="text-base font-medium group-hover:text-primary transition-colors truncate">
            {project.title}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Category Badge */}
            {primaryCategory && (
              <Badge variant="secondary" className="text-xs">
                {primaryCategory.name}
              </Badge>
            )}

            {/* Project Type Indicator (e.g., Part 2) */}
            {project.description && project.description.includes("Part") && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                {project.description.match(/Part \d+/)?.[0] || ""}
              </span>
            )}

            {/* Pro Badge */}
            {project.isPremium && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                <Crown className="w-3 h-3" />
                <span>Pro</span>
              </span>
            )}

            {/* Estimated Time */}
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-muted-foreground" />
              <Clock className="w-3 h-3" />
              <span>{formatTime(project.estimatedTime)}</span>
            </span>
          </div>
        </div>

        {/* Avatars showing who completed */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex -space-x-2">
            {Array.from({
              length: Math.min(3, Math.max(1, completionCount)),
            }).map((_, i) => (
              <Avatar key={i} className="w-6 h-6 border-2 border-background">
                <AvatarFallback
                  className={avatarColors[i % avatarColors.length]}
                >
                  {String.fromCharCode(65 + i)}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {completionCount}+ completed
          </span>
        </div>
      </div>

      {/* Right side: Add/Remove Projects button */}
      <div className="flex-shrink-0 ml-4">
        <button
          onClick={handleToggleProject}
          className="w-8 h-8 rounded-full border border-border hover:border-primary hover:bg-primary/10 flex items-center justify-center transition-all"
          aria-label={
            isAdded ? "Remove from my projects" : "Add to my projects"
          }
        >
          {isAdded ? (
            <Minus className="h-4 w-4 text-primary transition-colors" />
          ) : (
            <Plus className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          )}
        </button>
      </div>
    </Link>
  );
}
