"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Clock,
  Crown,
  DollarSign,
  Play,
  Pause,
  Signal,
  Users,
  Video,
  FileText,
  Target,
  Zap,
  Settings,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

export default function ProjectDetailPage() {
  const { getToken } = useAuth();
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const projectId = params.id as string;

  const [selectedGuidanceMode, setSelectedGuidanceMode] = useState<string>("SOME_GUIDANCE");
  const [isStarting, setIsStarting] = useState(false);

  // Fetch project details
  const { data: project, isLoading, error } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const token = await getToken();
      const response = await fetch(`/api/projects/${projectId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        const error = new Error(errorData.error || "Failed to fetch project details");
        (error as any).status = response.status;
        (error as any).statusText = response.statusText;
        throw error;
      }

      return response.json();
    },
  });

  // Start project mutation
  const startProjectMutation = useMutation({
    mutationFn: async (guidanceMode: string) => {
      const token = await getToken();
      const response = await fetch(`/api/projects/${projectId}/start`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ guidanceMode }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to start project");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Project started successfully!");
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      router.push(`/dashboard/labs/${projectId}/workspace`);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      setIsStarting(false);
    },
  });

  const handleStartProject = () => {
    setIsStarting(true);
    startProjectMutation.mutate(selectedGuidanceMode);
  };

  if (isLoading) {
    return <ProjectDetailSkeleton />;
  }

  if (error || !project) {
    const errorStatus = (error as any)?.status;
    const errorMessage = error?.message || "Unknown error occurred";

    // Handle specific error cases
    if (errorStatus === 403) {
      return (
        <div className="p-6 max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-12 text-center">
              <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Premium Project Access Required</h3>
              <p className="text-muted-foreground mb-6">
                This is a premium project that requires an active subscription to access.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild>
                  <Link href="/dashboard/settings">
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade to Premium
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/dashboard/labs">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Labs
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (errorStatus === 404) {
      return (
        <div className="p-6 max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Project Not Found</h3>
              <p className="text-muted-foreground mb-4">
                The project you're looking for doesn't exist or may have been removed.
              </p>
              <Button asChild variant="outline">
                <Link href="/dashboard/labs">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Labs
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Generic error fallback
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Unable to Load Project</h3>
            <p className="text-muted-foreground mb-4">
              {errorMessage}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard/labs">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Labs
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes === 0 ? `${hours}h` : `${hours}h ${remainingMinutes}m`;
  };

  const formatCost = (cents: number) => {
    if (cents === 0) return "Free";
    return `$${(cents / 100).toFixed(2)}`;
  };

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

  const getActionButton = () => {
    if (!project.userProgress) {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Choose your guidance level:</label>
            <Select value={selectedGuidanceMode} onValueChange={setSelectedGuidanceMode}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INDEPENDENT">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Independent</span>
                    <span className="text-xs text-muted-foreground">Minimal guidance, figure it out yourself</span>
                  </div>
                </SelectItem>
                <SelectItem value="SOME_GUIDANCE">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Some Guidance</span>
                    <span className="text-xs text-muted-foreground">Hints and tips along the way</span>
                  </div>
                </SelectItem>
                <SelectItem value="STEP_BY_STEP">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Step-by-Step</span>
                    <span className="text-xs text-muted-foreground">Detailed instructions for every step</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleStartProject}
            disabled={isStarting}
            className="w-full gap-2"
            size="lg"
          >
            <Play className="h-4 w-4" />
            {isStarting ? "Starting..." : "Start Project"}
          </Button>
        </div>
      );
    }

    if (project.userProgress.status === "COMPLETED") {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Project Completed!</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button asChild variant="outline">
              <Link href={`/dashboard/labs/${projectId}/workspace`}>
                <FileText className="h-4 w-4 mr-2" />
                Review
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/api/projects/${projectId}/documentation`}>
                <FileText className="h-4 w-4 mr-2" />
                Download Docs
              </Link>
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{project.userProgress.progressPercentage}%</span>
          </div>
          <Progress value={project.userProgress.progressPercentage} className="h-2" />
        </div>
        <Button asChild className="w-full gap-2" size="lg">
          <Link href={`/dashboard/labs/${projectId}/workspace`}>
            <Pause className="h-4 w-4" />
            Continue Project
          </Link>
        </Button>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/labs">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Labs
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{project.category.name}</Badge>
          {project.isPremium && (
            <Badge className="bg-yellow-500/90 text-yellow-50">
              <Crown className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Header */}
          <div className="space-y-4">
            <div className="aspect-video w-full bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center overflow-hidden">
              {project.thumbnailUrl ? (
                <Image
                  src={project.thumbnailUrl}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20">
                  <Zap className="h-12 w-12 text-primary/60" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold leading-tight">{project.title}</h1>
              <p className="text-lg text-muted-foreground">{project.description}</p>
            </div>
          </div>

          {/* Video Section */}
          {project.videoUrl && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Project Walkthrough
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <Button variant="outline">
                    <Play className="h-4 w-4 mr-2" />
                    Watch Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Learning Objectives */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Learning Objectives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {project.learningObjectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-sm">{objective}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Prerequisites */}
          {project.prerequisites.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Prerequisites
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {project.prerequisites.map((prerequisite, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 bg-muted-foreground rounded-full mt-2 shrink-0" />
                      <span className="text-sm">{prerequisite}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Technologies */}
          <Card>
            <CardHeader>
              <CardTitle>Technologies You'll Use</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.keyTechnologies.map((tech, index) => (
                  <Badge key={index} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Action Card */}
          <Card>
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
            </CardHeader>
            <CardContent>
              {getActionButton()}
            </CardContent>
          </Card>

          {/* Project Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Duration</span>
                  </div>
                  <p className="font-medium">{formatTime(project.estimatedTime)}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span>Cost</span>
                  </div>
                  <p className="font-medium">{formatCost(project.estimatedCost)}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Signal className="h-4 w-4" />
                    <span>Difficulty</span>
                  </div>
                  <Badge className={getDifficultyColor(project.difficulty)}>
                    {project.difficulty.toLowerCase()}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Completed</span>
                  </div>
                  <p className="font-medium">{project.completionCount} learners</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-sm font-medium">Project Structure</p>
                <p className="text-sm text-muted-foreground">
                  {project.totalSteps} steps • {project.projectType.toLowerCase()} format
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ProjectDetailSkeleton() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-9 w-32" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <Skeleton className="aspect-video w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
