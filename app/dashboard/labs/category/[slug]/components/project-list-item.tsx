"use client";

import { Badge } from "@/components/ui/badge";
import { Plus, Minus } from "lucide-react";
import Link from "next/link";
import { Project } from "@/validations/project-types";
import { useState } from "react";
import { toast } from "sonner";
import { UserAvatarsGroup } from "./user-avatars-group";

const ProIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="18px"
    height="18px"
    viewBox="0 0 18 18"
  >
    <path
      d="M12.25,9c-.414,0-.75-.336-.75-.75v-3.25c0-1.378-1.122-2.5-2.5-2.5s-2.5,1.122-2.5,2.5v3.25c0,.414-.336,.75-.75,.75s-.75-.336-.75-.75v-3.25c0-2.206,1.794-4,4-4s4,1.794,4,4v3.25c0,.414-.336,.75-.75,.75Z"
      fill="currentColor"
    />
    <path
      d="M12.75,7.5H5.25c-1.517,0-2.75,1.233-2.75,2.75v4c0,1.517,1.233,2.75,2.75,2.75h7.5c1.517,0,2.75-1.233,2.75-2.75v-4c0-1.517-1.233-2.75-2.75-2.75Zm-3,5.25c0,.414-.336,.75-.75,.75s-.75-.336-.75-.75v-1c0-.414,.336-.75,.75-.75s.75,.336,.75,.75v1Z"
      fill="currentColor"
    />
  </svg>
);

const ClockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="18px"
    height="18px"
    viewBox="0 0 18 18"
  >
    <path
      d="M9.75,3.042v-1.042h1.5c.414,0,.75-.336,.75-.75s-.336-.75-.75-.75H6.75c-.414,0-.75,.336-.75,.75s.336,.75,.75,.75h1.5v1.042c-3.508,.376-6.25,3.352-6.25,6.958,0,3.86,3.14,7,7,7s7-3.14,7-7c0-3.606-2.742-6.583-6.25-6.958Zm-.22,7.489c-.146,.146-.338,.22-.53,.22s-.384-.073-.53-.22l-2.298-2.298c-.293-.293-.293-.768,0-1.061s.768-.293,1.061,0l2.298,2.298c.293,.293,.293,.768,0,1.061Z"
      fill="currentColor"
    />
    <path
      d="M16.25,5.5c-.192,0-.384-.073-.53-.22l-2-2c-.293-.293-.293-.768,0-1.061s.768-.293,1.061,0l2,2c.293,.293,.293,.768,0,1.061-.146,.146-.338,.22-.53,.22Z"
      fill="currentColor"
    />
  </svg>
);

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
      className="flex items-center justify-between py-5 px-2 hover:bg-muted/50 rounded-lg transition-colors group bg-muted"
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
                <ProIcon />
                <span>Pro</span>
              </span>
            )}

            {/* Estimated Time */}
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-muted-foreground" />
              <ClockIcon />
              <span>{formatTime(project.estimatedTime)}</span>
            </span>
          </div>
        </div>

        {/* Avatars showing who completed */}
        <UserAvatarsGroup count={completionCount} />
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
