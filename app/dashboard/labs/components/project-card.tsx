"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  DollarSign,
  Play,
  Pause,
  CheckCircle,
  Crown,
  Signal,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Project {
  id: string;
  title: string;
  description: string;
  category: {
    id: string;
    name: string;
  };
  difficulty: string;
  estimatedTime: number;
  estimatedCost: number;
  thumbnailUrl?: string;
  isPremium: boolean;
  projectType: string;
  totalSteps: number;
  completionCount: number;
  userProgress?: {
    status: string;
    progressPercentage: number;
    currentStep: number;
    startedAt: string;
    completedAt?: string;
  } | null;
}

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "BEGINER":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "INTERMEDIATE":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "ADVANCED":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      case "EXPERT":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "TUTORIAL":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "CHALLENGE":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      case "ASSESSMENT":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400";
      case "CAPSTONE":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes === 0
      ? `${hours}h`
      : `${hours}h ${remainingMinutes}m`;
  };

  const formatCost = (cents: number) => {
    if (cents === 0) return "Free";
    return `$${(cents / 100).toFixed(2)}`;
  };

  const getStatusButton = () => {
    if (!project.userProgress) {
      return (
        <Button asChild className="w-full gap-2">
          <Link href={`/dashboard/labs/${project.id}`}>
            <Play className="h-4 w-4" />
            Start Project
          </Link>
        </Button>
      );
    }

    if (project.userProgress.status === "COMPLETED") {
      return (
        <Button asChild variant="outline" className="w-full gap-2">
          <Link href={`/dashboard/labs/${project.id}`}>
            <CheckCircle className="h-4 w-4" />
            View Project
          </Link>
        </Button>
      );
    }

    return (
      <Button asChild variant="default" className="w-full gap-2">
        <Link href={`/dashboard/labs/${project.id}/workspace`}>
          <Pause className="h-4 w-4" />
          Continue ({project.userProgress.progressPercentage}%)
        </Link>
      </Button>
    );
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-border overflow-hidden">
      <CardHeader className="pb-3">
        {/* Thumbnail and Premium Badge */}
        <div className="relative mb-3">
          <div className="aspect-video w-full bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center overflow-hidden">
            {project.thumbnailUrl ? (
              <Image
                src={project.thumbnailUrl}
                alt={project.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20">
                <Zap className="h-8 w-8 text-primary/60" />
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-2">
            {project.isPremium && (
              <Badge className="bg-yellow-500/90 text-yellow-50 backdrop-blur-sm">
                <Crown className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            )}
            <Badge
              className={`${getTypeColor(project.projectType)} backdrop-blur-sm`}
            >
              {project.projectType.toLowerCase()}
            </Badge>
          </div>
        </div>

        {/* Title and Category */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <Badge variant="outline" className="shrink-0 text-xs">
              {project.category.name}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        {/* Progress Bar (if started) */}
        {project.userProgress &&
          project.userProgress.status !== "COMPLETED" && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>Progress</span>
                <span>{project.userProgress.progressPercentage}%</span>
              </div>
              <Progress
                value={project.userProgress.progressPercentage}
                className="h-2"
              />
            </div>
          )}

        {/* Project Stats */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {formatTime(project.estimatedTime)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {formatCost(project.estimatedCost)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Signal className="h-4 w-4 text-muted-foreground" />
            <Badge
              className={`${getDifficultyColor(project.difficulty)} text-xs`}
            >
              {project.difficulty.toLowerCase()}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground text-xs">
              {project.completionCount} completed
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">{getStatusButton()}</CardFooter>
    </Card>
  );
}
