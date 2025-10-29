/**
 * Type definitions for Projects and related entities
 */

export interface Project {
  id: string;
  title: string;
  description: string;
  categories: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
  }[];
  difficulty: "BEGINER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
  estimatedTime: number;
  estimatedCost: number;
  thumbnailUrl: string | null;
  videoUrl: string | null;
  prerequisites: string[];
  learningObjectives: string[];
  keyTechnologies: string[];
  isPremium: boolean;
  projectType: "TUTORIAL" | "CHALLENGE" | "ASSESSMENT" | "CAPSTONE";
  createdAt: Date;
  updatedAt: Date;
  totalSteps: number;
  completionCount: number;
  userProgress: {
    status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "ABANDONED";
    currentStep: number;
    completedSteps: number[];
    progressPercentage: number;
    startedAt: Date;
    completedAt: Date | null;
    timeSpent: number;
  } | null;
}

export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  projectCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProjectsByCategoryResponse {
  category: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
  };
  projects: Project[];
  pagination: Pagination;
}
