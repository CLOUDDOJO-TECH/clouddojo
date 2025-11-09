"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ProjectStepViewer } from "@/components/projects/project-step-viewer";
import { GuidanceModeExplanation } from "@/components/projects/guidance-mode-explanation";
import { useProjectSteps } from "@/hooks/use-project-steps";
import {
  ProjectTitle,
  StatsRowSimple,
  KeyConceptsSimple,
  GuidanceSelector,
} from "./components";

export default function ProjectDetailMultiStep() {
  const { getToken } = useAuth();
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const projectId = params.id as string;

  const [isStarting, setIsStarting] = useState(false);
  const [projectStarted, setProjectStarted] = useState(false);
  const [selectedGuidanceMode, setSelectedGuidanceMode] = useState<
    string | null
  >(null);

  // Fetch project details
  const {
    data: project,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const token = await getToken();
      const response = await fetch(`/api/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        const error = new Error(
          errorData.error || "Failed to fetch project details",
        );
        (error as any).status = response.status;
        throw error;
      }

      return response.json();
    },
  });

  // Fetch all project steps (only after project has started)
  const {
    data: stepsData,
    loading: isLoadingSteps,
    error: stepsError,
    refetch: refetchSteps,
  } = useProjectSteps(projectStarted ? projectId : "");

  // Start project mutation
  const startProjectMutation = useMutation({
    mutationFn: async (guidanceMode: string) => {
      const token = await getToken();
      const response = await fetch(`/api/projects/${projectId}/start`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
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
      setProjectStarted(true);
      setIsStarting(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
      setIsStarting(false);
    },
  });

  // Complete step mutation
  const completeStepMutation = useMutation({
    mutationFn: async ({
      stepId,
      stepNumber,
      response,
    }: {
      stepId: string;
      stepNumber: number;
      response: string;
    }) => {
      const token = await getToken();
      const apiResponse = await fetch(
        `/api/projects/${projectId}/steps/${stepNumber}/complete`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            response: response || "Step completed via multi-step viewer",
            timeSpent: 0,
            hintsUsed: 0,
          }),
        },
      );

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.error || "Failed to complete step");
      }

      return apiResponse.json();
    },
    onSuccess: () => {
      toast.success("Step completed successfully!");
      refetchSteps();
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleStartProject = (guidanceMode: string) => {
    setSelectedGuidanceMode(guidanceMode);
    setIsStarting(true);
    startProjectMutation.mutate(guidanceMode);
  };

  const handleStepComplete = (stepId: string, stepNumber: number) => {
    completeStepMutation.mutate({
      stepId,
      stepNumber,
      response: "Step completed via multi-step viewer",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading project...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-destructive">Error loading project</p>
      </div>
    );
  }

  if (stepsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-destructive">
          Error loading project steps: {stepsError}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">
        {/* Project Title */}
        <ProjectTitle title={project.title} />

        {/* Separator */}
        <Separator className="mb-8" />

        {/* Stats Row */}
        <StatsRowSimple
          difficulty={project.difficulty}
          estimatedTime={project.estimatedTime}
          totalSteps={project.totalSteps}
        />

        {/* Separator */}
        <Separator className="mb-8" />

        {/* Key Concepts */}
        <KeyConceptsSimple technologies={project.keyTechnologies} />

        {/* Separator */}
        <Separator className="mb-8" />

        {/* Guidance Selector - Only show if project hasn't started */}
        {!projectStarted && (
          <GuidanceSelector
            onSelect={handleStartProject}
            isStarting={isStarting}
          />
        )}

        {/* Guidance Mode Explanation - Show after mode is selected but before steps load */}
        {selectedGuidanceMode && projectStarted && (
          <GuidanceModeExplanation mode={selectedGuidanceMode} />
        )}

        {/* Multi-Step Viewer - Show after project starts */}
        {projectStarted && (
          <>
            {isLoadingSteps ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">
                  Loading project steps...
                </p>
              </div>
            ) : stepsData ? (
              <ProjectStepViewer
                steps={stepsData.steps}
                projectTitle={stepsData.project.title}
                onStepComplete={handleStepComplete}
              />
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
