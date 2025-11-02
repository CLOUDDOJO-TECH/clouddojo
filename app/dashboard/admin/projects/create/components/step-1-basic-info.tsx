"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { MediaUpload } from "@/components/ui/media-upload";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import {
  projectBasicInfoSchema,
  ProjectBasicInfo,
  PROJECT_TYPES,
  DIFFICULTY_LEVELS,
} from "../validators";

interface Step1BasicInfoProps {
  onComplete: (data: ProjectBasicInfo) => void;
  initialData?: Partial<ProjectBasicInfo>;
  onAIPrefill?: (currentValues: {
    title?: string;
    description?: string;
  }) => Promise<Partial<ProjectBasicInfo> | null>;
}

export function Step1BasicInfo({
  onComplete,
  initialData,
  onAIPrefill,
}: Step1BasicInfoProps) {
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProjectBasicInfo>({
    resolver: zodResolver(projectBasicInfoSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      projectType: initialData?.projectType || "TUTORIAL",
      difficulty: initialData?.difficulty || "BEGINER",
      estimatedTime: initialData?.estimatedTime || 120,
      estimatedCost: initialData?.estimatedCost || 0,
      thumbnailUrl: initialData?.thumbnailUrl || "",
      videoUrl: initialData?.videoUrl || "",
      isPremium: initialData?.isPremium ?? false,
      isPublished: initialData?.isPublished ?? false,
    },
  });

  const description = watch("description");
  const estimatedCost = watch("estimatedCost");

  const handleAIPrefillClick = async () => {
    if (!onAIPrefill) return;

    // Get current form values
    const currentTitle = watch("title");
    const currentDescription = watch("description");

    setIsGeneratingAI(true);
    try {
      const aiData = await onAIPrefill({
        title: currentTitle,
        description: currentDescription,
      });
      if (aiData) {
        if (aiData.title) setValue("title", aiData.title);
        if (aiData.description) setValue("description", aiData.description);
        if (aiData.projectType) setValue("projectType", aiData.projectType);
        if (aiData.difficulty) setValue("difficulty", aiData.difficulty);
        if (aiData.estimatedTime)
          setValue("estimatedTime", aiData.estimatedTime);
        if (aiData.estimatedCost !== undefined)
          setValue("estimatedCost", aiData.estimatedCost);
      }
    } catch (error) {
      console.error("AI prefill error:", error);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const onSubmit = (data: ProjectBasicInfo) => {
    onComplete(data);
  };

  // Calculate word count
  const wordCount = description.trim().split(/\s+/).filter(Boolean).length;
  const wordCountColor =
    wordCount < 20
      ? "text-red-500"
      : wordCount > 500
        ? "text-red-500"
        : "text-green-500";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Basic Project Information</CardTitle>
              <CardDescription>
                Provide essential details about the project. All fields marked
                with * are required.
              </CardDescription>
            </div>
            {onAIPrefill && (
              <Button
                type="button"
                variant="outline"
                onClick={handleAIPrefillClick}
                disabled={isGeneratingAI}
                className="gap-2"
              >
                {isGeneratingAI ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    AI Prefill
                  </>
                )}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {onAIPrefill && (
            <Alert className="mb-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-900 dark:text-blue-200">
                <strong>Tip:</strong> Click AI Prefill to automatically generate
                project details from a brief outline!
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Project Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g., Build a Serverless API with AWS Lambda"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${wordCountColor}`}>
                    {wordCount} words {wordCount < 20 && "(min 20)"}{" "}
                    {wordCount > 500 && "(max 500)"}
                  </span>
                </div>
              </div>
              <MarkdownEditor
                id="description"
                label="Project Description"
                value={description}
                onChange={(value) => setValue("description", value)}
                placeholder="Write a comprehensive project description using Markdown formatting...

### Overview
Brief introduction to what students will build

### Key Features
- Feature 1
- Feature 2

### Target Audience
Who this project is designed for"
                rows={12}
                required
                error={errors.description?.message}
                description="Use Markdown formatting: **bold**, *italic*, ### headings, - lists"
              />
            </div>

            {/* Project Type and Difficulty - Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Project Type */}
              <div className="space-y-2">
                <Label htmlFor="projectType">
                  Project Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={watch("projectType")}
                  onValueChange={(value) =>
                    setValue("projectType", value as any)
                  }
                >
                  <SelectTrigger id="projectType">
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TUTORIAL">Tutorial</SelectItem>
                    <SelectItem value="CHALLENGE">Challenge</SelectItem>
                    <SelectItem value="ASSESSMENT">Assessment</SelectItem>
                    <SelectItem value="CAPSTONE">Capstone</SelectItem>
                  </SelectContent>
                </Select>
                {errors.projectType && (
                  <p className="text-sm text-destructive">
                    {errors.projectType.message}
                  </p>
                )}
              </div>

              {/* Difficulty Level */}
              <div className="space-y-2">
                <Label htmlFor="difficulty">
                  Difficulty Level <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={watch("difficulty")}
                  onValueChange={(value) =>
                    setValue("difficulty", value as any)
                  }
                >
                  <SelectTrigger id="difficulty">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BEGINER">Beginner</SelectItem>
                    <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                    <SelectItem value="ADVANCED">Advanced</SelectItem>
                    <SelectItem value="EXPERT">Expert</SelectItem>
                  </SelectContent>
                </Select>
                {errors.difficulty && (
                  <p className="text-sm text-destructive">
                    {errors.difficulty.message}
                  </p>
                )}
              </div>
            </div>

            {/* Estimated Time and Cost - Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Estimated Time */}
              <div className="space-y-2">
                <Label htmlFor="estimatedTime">
                  Estimated Time (minutes){" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="estimatedTime"
                  type="number"
                  min="15"
                  max="600"
                  placeholder="120"
                  {...register("estimatedTime", { valueAsNumber: true })}
                />
                {errors.estimatedTime && (
                  <p className="text-sm text-destructive">
                    {errors.estimatedTime.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  How long will this project take to complete?
                </p>
              </div>

              {/* Estimated Cost */}
              <div className="space-y-2">
                <Label htmlFor="estimatedCost">
                  Estimated Cost (cents){" "}
                  <span className="text-destructive">*</span>
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="estimatedCost"
                    type="number"
                    min="0"
                    max="10000"
                    placeholder="500"
                    {...register("estimatedCost", { valueAsNumber: true })}
                  />
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    ${(estimatedCost / 100).toFixed(2)}
                  </span>
                </div>
                {errors.estimatedCost && (
                  <p className="text-sm text-destructive">
                    {errors.estimatedCost.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  AWS/cloud costs in cents (0 for free projects)
                </p>
              </div>
            </div>

            {/* Separator */}
            <div className="border-t pt-6" />

            {/* Thumbnail and Video */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Thumbnail */}
              <div className="space-y-2">
                <MediaUpload
                  label="Thumbnail"
                  value={watch("thumbnailUrl")}
                  onChange={(url) => setValue("thumbnailUrl", url)}
                  accept="image/*"
                  maxSizeMB={5}
                  required
                  description="Upload an image or enter URL"
                />
                {errors.thumbnailUrl && (
                  <p className="text-sm text-destructive">
                    {errors.thumbnailUrl.message}
                  </p>
                )}
              </div>

              {/* Video (Optional) */}
              <div className="space-y-2">
                <MediaUpload
                  label="Video (Optional)"
                  value={watch("videoUrl")}
                  onChange={(url) => setValue("videoUrl", url)}
                  accept="video/*"
                  maxSizeMB={50}
                  description="Upload a video or enter URL (YouTube, etc.)"
                />
                {errors.videoUrl && (
                  <p className="text-sm text-destructive">
                    {errors.videoUrl.message}
                  </p>
                )}
              </div>
            </div>

            {/* Settings Switches */}
            <div className="space-y-4 border rounded-lg p-4">
              <h3 className="font-medium text-sm">Project Settings</h3>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="isPremium">Premium Project</Label>
                  <p className="text-xs text-muted-foreground">
                    Require premium subscription to access
                  </p>
                </div>
                <Switch
                  id="isPremium"
                  checked={watch("isPremium")}
                  onCheckedChange={(checked) => setValue("isPremium", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="isPublished">Published</Label>
                  <p className="text-xs text-muted-foreground">
                    Make this project visible to users
                  </p>
                </div>
                <Switch
                  id="isPublished"
                  checked={watch("isPublished")}
                  onCheckedChange={(checked) =>
                    setValue("isPublished", checked)
                  }
                />
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Continue to Content"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
