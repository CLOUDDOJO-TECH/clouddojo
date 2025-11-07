"use client";

import { useState } from "react";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { CompleteProject } from "../validators";
import { createProject } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Step5PreviewProps {
  projectData: CompleteProject;
  onBack: () => void;
  onEdit: (step: number) => void;
  onProjectCreated?: () => void;
}

export function Step5Preview({
  projectData,
  onBack,
  onEdit,
  onProjectCreated,
}: Step5PreviewProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSteps, setOpenSteps] = useState<number[]>([]);
  const router = useRouter();

  const toggleStep = (index: number) => {
    setOpenSteps((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    toast.loading("Creating project...", { id: "create-project" });

    try {
      const result = await createProject(projectData);

      if (result.success) {
        toast.success(result.message || "Project created successfully!", {
          id: "create-project",
        });

        // Clear draft after successful creation
        if (onProjectCreated) {
          await onProjectCreated();
        }

        // Redirect to manage projects page
        router.push("/dashboard/admin/projects/manage");
      } else {
        toast.error(result.error || "Failed to create project", {
          id: "create-project",
        });
      }
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("An unexpected error occurred", { id: "create-project" });
    } finally {
      setIsSubmitting(false);
    }
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

  const getStepTypeColor = (type: string) => {
    switch (type) {
      case "INSTRUCTION":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "QUIZ":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      case "VALIDATION":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "REFLECTION":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "CHECKPOINT":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
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

  return (
    <div className="space-y-6">
      <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
        <CheckCircle2 className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900 dark:text-blue-200">
          Review all project details before publishing. You can edit any section
          by clicking the "Edit" buttons.
        </AlertDescription>
      </Alert>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Basic Information</CardTitle>
            <Button variant="outline" size="sm" onClick={() => onEdit(1)}>
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-2xl font-bold">{projectData.title}</h3>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge className={getTypeColor(projectData.projectType)}>
                {projectData.projectType}
              </Badge>
              <Badge className={getDifficultyColor(projectData.difficulty)}>
                {projectData.difficulty}
              </Badge>
              {projectData.isPremium && (
                <Badge className="bg-yellow-500 text-yellow-50">Premium</Badge>
              )}
              {projectData.isPublished && (
                <Badge className="bg-green-500 text-green-50">Published</Badge>
              )}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Duration</p>
              <p className="font-semibold">
                {formatTime(projectData.estimatedTime)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Cost</p>
              <p className="font-semibold">
                {formatCost(projectData.estimatedCost)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Steps</p>
              <p className="font-semibold">{projectData.steps.length}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Categories</p>
              <p className="font-semibold">
                {projectData.categoryIds.length +
                  (projectData.newCategories?.length || 0)}
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-semibold mb-2">Description</p>
            <div className="prose prose-sm dark:prose-invert max-w-none bg-muted/30 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap font-sans">
                {projectData.description}
              </pre>
            </div>
          </div>

          {(projectData.thumbnailUrl || projectData.videoUrl) && (
            <>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projectData.thumbnailUrl && (
                  <div>
                    <p className="text-sm font-semibold mb-1">Thumbnail URL</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {projectData.thumbnailUrl}
                    </p>
                  </div>
                )}
                {projectData.videoUrl && (
                  <div>
                    <p className="text-sm font-semibold mb-1">Video URL</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {projectData.videoUrl}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Project Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Project Content</CardTitle>
            <Button variant="outline" size="sm" onClick={() => onEdit(2)}>
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-semibold mb-2">Prerequisites</p>
            <ul className="list-disc list-inside space-y-1">
              {projectData.prerequisites.map((prereq, index) => (
                <li key={index} className="text-sm">
                  {prereq}
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-semibold mb-2">Learning Objectives</p>
            <ul className="list-disc list-inside space-y-1">
              {projectData.learningObjectives.map((objective, index) => (
                <li key={index} className="text-sm">
                  {objective}
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-semibold mb-2">Key Technologies</p>
            <div className="flex flex-wrap gap-2">
              {projectData.keyTechnologies.map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Steps */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Project Steps ({projectData.steps.length})</CardTitle>
            <Button variant="outline" size="sm" onClick={() => onEdit(3)}>
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {projectData.steps.map((step, index) => {
            const isOpen = openSteps.includes(index);
            return (
              <Card key={index} className="border">
                <Collapsible
                  open={isOpen}
                  onOpenChange={() => toggleStep(index)}
                >
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="font-semibold text-sm">
                        Step {index + 1}
                      </span>
                      <Badge
                        className={getStepTypeColor(step.stepType)}
                        variant="secondary"
                      >
                        {step.stepType}
                      </Badge>
                      <span className="text-sm">{step.title}</span>
                      {step.isOptional && (
                        <Badge variant="outline" className="text-xs">
                          Optional
                        </Badge>
                      )}
                    </div>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="icon">
                        {isOpen ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </div>

                  <CollapsibleContent>
                    <div className="px-4 pb-4 space-y-3 border-t pt-4">
                      {step.description && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-1">
                            Description
                          </p>
                          <p className="text-sm">{step.description}</p>
                        </div>
                      )}

                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">
                          Instructions
                        </p>
                        <div className="text-sm bg-muted/30 p-3 rounded font-mono whitespace-pre-wrap">
                          {step.instructions.substring(0, 200)}
                          {step.instructions.length > 200 && "..."}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="text-muted-foreground">
                            Estimated Time
                          </p>
                          <p className="font-semibold">
                            {step.estimatedTime} minutes
                          </p>
                        </div>
                        {step.validationCriteria &&
                          step.validationCriteria.length > 0 && (
                            <div>
                              <p className="text-muted-foreground">
                                Validation Criteria
                              </p>
                              <p className="font-semibold">
                                {step.validationCriteria.length} items
                              </p>
                            </div>
                          )}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            );
          })}
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Categories</CardTitle>
            <Button variant="outline" size="sm" onClick={() => onEdit(4)}>
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold mb-2">Selected Categories</p>
              <p className="text-sm text-muted-foreground">
                {projectData.categoryIds.length} existing category(ies) selected
              </p>
            </div>

            {projectData.newCategories &&
              projectData.newCategories.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-2">
                    New Categories to Create
                  </p>
                  <div className="space-y-2">
                    {projectData.newCategories.map((cat, index) => (
                      <div
                        key={index}
                        className="p-3 border rounded-lg bg-primary/5"
                      >
                        <p className="font-medium text-sm">{cat.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Slug: {cat.slug}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating Project...
            </>
          ) : (
            <>
              Create Project
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
