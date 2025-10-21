"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  Save,
  Settings,
  FileText,
  Lightbulb,
  Target,
  Trophy,
  Flag,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { StepNavigation } from "../components/step-navigation";
import { StepContent } from "../components/step-content";
import { AchievementToast } from "../components/achievement-toast";
import { DocumentationModal } from "../components/documentation-modal";

export default function ProjectWorkspacePage() {
  const { getToken } = useAuth();
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const projectId = params.id as string;

  const [currentStepResponse, setCurrentStepResponse] = useState("");
  const [timeSpent, setTimeSpent] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newAchievements, setNewAchievements] = useState<any[]>([]);

  // Timer for tracking time spent on current step
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 60000); // Increment every minute

    return () => clearInterval(interval);
  }, []);

  // Fetch project with progress
  const { data: project, isLoading } = useQuery({
    queryKey: ["project-workspace", projectId],
    queryFn: async () => {
      const token = await getToken();
      const response = await fetch(`/api/projects/${projectId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch project");
      }
      
      return response.json();
    },
  });

  // Complete step mutation
  const completeStepMutation = useMutation({
    mutationFn: async ({ stepId, response }: { stepId: string; response: string }) => {
      const token = await getToken();
      const res = await fetch(`/api/projects/${projectId}/steps/${stepId}/complete`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          response,
          timeSpent,
          hintsUsed,
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to complete step");
      }
      
      return res.json();
    },
    onSuccess: (data) => {
      toast.success("Step completed successfully!");
      
      // Show achievements if any
      if (data.achievements && data.achievements.length > 0) {
        setNewAchievements(data.achievements);
      }
      
      // Reset form
      setCurrentStepResponse("");
      setTimeSpent(0);
      setHintsUsed(0);
      
      // Refresh project data
      queryClient.invalidateQueries({ queryKey: ["project-workspace", projectId] });
      
      // If project is complete, redirect to completion page
      if (data.progress.isComplete) {
        toast.success("🎉 Project completed! Congratulations!");
        setTimeout(() => {
          router.push(`/dashboard/labs/${projectId}?completed=true`);
        }, 2000);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  // Update progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: async (data: { guidanceMode?: string; currentStep?: number }) => {
      const token = await getToken();
      const response = await fetch(`/api/projects/${projectId}/progress`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update progress");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-workspace", projectId] });
    },
  });

  // Get current step and existing response (computed values)
  const currentStep = project?.steps?.find(
    (step: any) => step.stepNumber === project?.userProgress?.currentStep
  );

  const existingResponse = project?.userProgress?.stepResponses?.[project?.userProgress?.currentStep];

  // Load existing response when step changes - MOVE THIS HOOK BEFORE CONDITIONAL RETURNS
  useEffect(() => {
    if (project?.userProgress?.currentStep) {
      if (existingResponse) {
        setCurrentStepResponse(existingResponse.response);
      } else {
        setCurrentStepResponse("");
      }
      setTimeSpent(0);
      setHintsUsed(0);
    }
  }, [project?.userProgress?.currentStep, existingResponse]);

  // Handler functions
  const handleCompleteStep = () => {
    if (!currentStep) return;
    if (!currentStepResponse.trim()) {
      toast.error("Please provide a response before completing this step.");
      return;
    }

    setIsSubmitting(true);
    completeStepMutation.mutate({
      stepId: currentStep.id,
      response: currentStepResponse,
    });
  };

  const handleNavigateToStep = (stepNumber: number) => {
    updateProgressMutation.mutate({ currentStep: stepNumber });
  };

  const handleGuidanceModeChange = (mode: string) => {
    updateProgressMutation.mutate({ guidanceMode: mode });
    toast.success("Guidance mode updated!");
  };

  if (isLoading) {
    return <WorkspaceSkeleton />;
  }

  if (!project || !project.userProgress) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-12 text-center">
            <Flag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Project not started</h3>
            <p className="text-muted-foreground mb-4">
              Please start this project first before accessing the workspace.
            </p>
            <Button asChild>
              <Link href={`/dashboard/labs/${projectId}`}>
                Start Project
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Achievement Toasts */}
      {newAchievements.map((achievement, index) => (
        <AchievementToast
          key={achievement.id}
          achievement={achievement}
          onClose={() => setNewAchievements(prev => prev.filter((_, i) => i !== index))}
        />
      ))}

      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/labs/${projectId}`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Project Details
                </Link>
              </Button>
              
              <div className="space-y-1">
                <h1 className="text-xl font-semibold">{project.title}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Step {project.userProgress.currentStep} of {project.totalSteps}</span>
                  <span>•</span>
                  <span>{project.userProgress.progressPercentage}% complete</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Guidance Mode Selector */}
              <Select
                value={project.userProgress.guidanceMode}
                onValueChange={handleGuidanceModeChange}
              >
                <SelectTrigger className="w-40">
                  <Settings className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INDEPENDENT">Independent</SelectItem>
                  <SelectItem value="SOME_GUIDANCE">Some Guidance</SelectItem>
                  <SelectItem value="STEP_BY_STEP">Step-by-Step</SelectItem>
                </SelectContent>
              </Select>

              {/* Documentation Button */}
              <DocumentationModal projectId={projectId}>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  View Docs
                </Button>
              </DocumentationModal>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <Progress value={project.userProgress.progressPercentage} className="h-2" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Step Navigation Sidebar */}
          <div className="lg:col-span-1">
            <StepNavigation
              steps={project.steps}
              currentStep={project.userProgress.currentStep}
              completedSteps={project.userProgress.completedSteps}
              onStepSelect={handleNavigateToStep}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Current Step Content */}
            {currentStep && (
              <StepContent
                step={currentStep}
                guidanceMode={project.userProgress.guidanceMode}
                onHintUsed={() => setHintsUsed(prev => prev + 1)}
              />
            )}

            {/* Response Area */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Your Response
                  {existingResponse && (
                    <Badge variant="outline" className="ml-2">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Share what you've learned, what you implemented, or document your approach..."
                  value={currentStepResponse}
                  onChange={(e) => setCurrentStepResponse(e.target.value)}
                  className="min-h-32"
                  disabled={isSubmitting}
                />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Time: {timeSpent}m</span>
                    </div>
                    {hintsUsed > 0 && (
                      <div className="flex items-center gap-1">
                        <Lightbulb className="h-4 w-4" />
                        <span>Hints: {hintsUsed}</span>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    onClick={handleCompleteStep}
                    disabled={isSubmitting || !currentStepResponse.trim()}
                    className="gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Save className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : existingResponse ? (
                      <>
                        <Save className="h-4 w-4" />
                        Update Step
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Complete Step
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Step Navigation Controls */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                disabled={project.userProgress.currentStep <= 1}
                onClick={() => handleNavigateToStep(project.userProgress.currentStep - 1)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous Step
              </Button>
              
              <Button
                variant="outline"
                disabled={project.userProgress.currentStep >= project.totalSteps}
                onClick={() => handleNavigateToStep(project.userProgress.currentStep + 1)}
              >
                Next Step
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkspaceSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-9 w-32" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-64" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-40" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>
          <Skeleton className="h-2 w-full mt-4" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Skeleton className="h-96 w-full" />
          </div>
          <div className="lg:col-span-3 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}