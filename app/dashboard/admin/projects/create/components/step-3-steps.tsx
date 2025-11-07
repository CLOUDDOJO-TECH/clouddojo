"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { readStreamableValue } from "ai/rsc";
import {
  Loader2,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  GripVertical,
  FileText,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { MediaUpload } from "@/components/ui/media-upload";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import {
  projectStepsSchema,
  ProjectSteps,
  ProjectStep,
  PROJECT_STEP_TYPES,
} from "../validators";
import { enhanceMarkdownWithAI } from "../ai-actions";
import { SmartArrayInput } from "@/components/ui/smart-array-input";

interface Step3StepsProps {
  onComplete: (data: ProjectSteps) => void;
  onBack: () => void;
  initialData?: Partial<ProjectSteps>;
}

const OPEN_STEPS_KEY = "project-creation-open-steps";

export function Step3Steps({
  onComplete,
  onBack,
  initialData,
}: Step3StepsProps) {
  const [openSteps, setOpenSteps] = useState<number[]>(() => {
    // Try to restore from localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(OPEN_STEPS_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return [0];
        }
      }
    }
    return [0];
  });
  const [enhancingStep, setEnhancingStep] = useState<number | null>(null);

  // Save openSteps to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(OPEN_STEPS_KEY, JSON.stringify(openSteps));
    }
  }, [openSteps]);

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProjectSteps>({
    resolver: zodResolver(projectStepsSchema),
    defaultValues: {
      steps: initialData?.steps || [
        {
          stepNumber: 1,
          title: "",
          description: "",
          instructions: "",
          expectedOutput: "",
          validationCriteria: [],
          mediaUrls: [],
          estimatedTime: 30,
          stepType: "INSTRUCTION",
          isOptional: false,
        },
      ],
    },
  });

  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
    move: moveStep,
  } = useFieldArray({
    control,
    name: "steps",
  });

  const toggleStep = (index: number) => {
    setOpenSteps((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const handleAddStep = () => {
    const newStepNumber = stepFields.length + 1;
    appendStep({
      stepNumber: newStepNumber,
      title: "",
      description: "",
      instructions: "",
      expectedOutput: "",
      validationCriteria: [],
      mediaUrls: [],
      estimatedTime: 30,
      stepType: "INSTRUCTION",
      isOptional: false,
    });
    setOpenSteps([...openSteps, stepFields.length]);
  };

  const handleRemoveStep = (index: number) => {
    removeStep(index);
    setOpenSteps(
      openSteps.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)),
    );

    // Renumber all remaining steps after removal
    setTimeout(() => {
      const steps = watch("steps");
      steps.forEach((_, idx) => {
        setValue(`steps.${idx}.stepNumber`, idx + 1);
      });
    }, 0);
  };

  const handleMoveStep = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    moveStep(index, newIndex);

    // Update all step numbers to match array order
    setTimeout(() => {
      const steps = watch("steps");
      steps.forEach((_, idx) => {
        setValue(`steps.${idx}.stepNumber`, idx + 1);
      });
    }, 0);

    // Update open states
    setOpenSteps(
      openSteps.map((i) => {
        if (i === index) return newIndex;
        if (i === newIndex) return index;
        return i;
      }),
    );
  };

  const handleAddMediaUrl = (stepIndex: number) => {
    const currentUrls = watch(`steps.${stepIndex}.mediaUrls`) || [];
    setValue(`steps.${stepIndex}.mediaUrls`, [...currentUrls, ""]);
  };

  const handleRemoveMediaUrl = (stepIndex: number, urlIndex: number) => {
    const currentUrls = watch(`steps.${stepIndex}.mediaUrls`) || [];
    setValue(
      `steps.${stepIndex}.mediaUrls`,
      currentUrls.filter((_, idx) => idx !== urlIndex),
    );
  };

  const handleEnhanceWithAI = async (stepIndex: number) => {
    const currentContent = watch(`steps.${stepIndex}.instructions`);

    if (!currentContent || currentContent.trim() === "") {
      toast.error("Please enter some content first");
      return;
    }

    setEnhancingStep(stepIndex);
    toast.loading("Enhancing with AI...", { id: `enhance-${stepIndex}` });

    try {
      const result = await enhanceMarkdownWithAI(currentContent);

      if (result.success && result.stream) {
        let fullContent = "";

        for await (const delta of readStreamableValue(result.stream)) {
          if (delta) {
            fullContent += delta;
            setValue(`steps.${stepIndex}.instructions`, fullContent);
          }
        }

        toast.success("Content enhanced successfully!", {
          id: `enhance-${stepIndex}`,
        });
      } else {
        toast.error(result.error || "Failed to enhance content", {
          id: `enhance-${stepIndex}`,
        });
      }
    } catch (error) {
      console.error("Enhancement error:", error);
      toast.error("Failed to enhance content", { id: `enhance-${stepIndex}` });
    } finally {
      setEnhancingStep(null);
    }
  };

  const onSubmit = (data: ProjectSteps) => {
    // Ensure all step numbers are sequential before submitting
    const normalizedData = {
      ...data,
      steps: data.steps.map((step, index) => ({
        ...step,
        stepNumber: index + 1,
      })),
    };
    onComplete(normalizedData);
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Steps</CardTitle>
          <CardDescription>
            Define the step-by-step instructions for completing this project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Steps List */}
            <div className="space-y-3">
              {stepFields.map((field, index) => {
                const isOpen = openSteps.includes(index);
                const stepType = watch(`steps.${index}.stepType`);
                const stepTitle = watch(`steps.${index}.title`);
                const validationCriteria =
                  watch(`steps.${index}.validationCriteria`) || [];
                const mediaUrls = watch(`steps.${index}.mediaUrls`) || [];

                return (
                  <Card key={field.id} className="border-2">
                    <Collapsible
                      open={isOpen}
                      onOpenChange={() => toggleStep(index)}
                    >
                      <div className="flex items-center gap-2 p-4">
                        <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">
                              Step {index + 1}
                            </span>
                            <Badge className={getStepTypeColor(stepType)}>
                              {stepType}
                            </Badge>
                            {stepTitle && (
                              <span className="text-sm text-muted-foreground truncate">
                                - {stepTitle}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {index > 0 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveStep(index, "up");
                              }}
                            >
                              <ChevronUp className="h-4 w-4" />
                            </Button>
                          )}
                          {index < stepFields.length - 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveStep(index, "down");
                              }}
                            >
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          )}
                          {stepFields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveStep(index);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                          <CollapsibleTrigger asChild>
                            <Button type="button" variant="ghost" size="icon">
                              {isOpen ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                        </div>
                      </div>

                      <CollapsibleContent>
                        <div className="px-4 pb-4 space-y-4 border-t pt-4">
                          {/* Step Title */}
                          <div className="space-y-2">
                            <Label htmlFor={`steps.${index}.title`}>
                              Step Title{" "}
                              <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id={`steps.${index}.title`}
                              placeholder="e.g., Create a Lambda Function"
                              {...register(`steps.${index}.title`)}
                            />
                            {errors.steps?.[index]?.title && (
                              <p className="text-sm text-destructive">
                                {errors.steps[index]?.title?.message}
                              </p>
                            )}
                          </div>

                          {/* Step Description */}
                          <div className="space-y-2">
                            <Label htmlFor={`steps.${index}.description`}>
                              Short Description (optional)
                            </Label>
                            <Input
                              id={`steps.${index}.description`}
                              placeholder="Brief summary of this step"
                              {...register(`steps.${index}.description`)}
                            />
                          </div>

                          {/* Instructions (Markdown) */}
                          <MarkdownEditor
                            id={`steps.${index}.instructions`}
                            label="Instructions"
                            value={watch(`steps.${index}.instructions`)}
                            onChange={(value) =>
                              setValue(`steps.${index}.instructions`, value)
                            }
                            placeholder="# Step Instructions

Write detailed instructions using Markdown...

- Item 1
- Item 2"
                            rows={8}
                            required
                            error={errors.steps?.[index]?.instructions?.message}
                            onFixWithAI={() => handleEnhanceWithAI(index)}
                            isEnhancing={enhancingStep === index}
                          />

                          {/* Expected Output */}
                          <div className="space-y-2">
                            <Label htmlFor={`steps.${index}.expectedOutput`}>
                              Expected Output (optional)
                            </Label>
                            <Textarea
                              id={`steps.${index}.expectedOutput`}
                              placeholder="What should students see or achieve after this step?"
                              rows={3}
                              {...register(`steps.${index}.expectedOutput`)}
                            />
                          </div>

                          {/* Step Type and Estimated Time */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`steps.${index}.stepType`}>
                                Step Type
                              </Label>
                              <Select
                                value={watch(`steps.${index}.stepType`)}
                                onValueChange={(value) =>
                                  setValue(
                                    `steps.${index}.stepType`,
                                    value as any,
                                  )
                                }
                              >
                                <SelectTrigger id={`steps.${index}.stepType`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="INSTRUCTION">
                                    Instruction
                                  </SelectItem>
                                  <SelectItem value="QUIZ">Quiz</SelectItem>
                                  <SelectItem value="VALIDATION">
                                    Validation
                                  </SelectItem>
                                  <SelectItem value="REFLECTION">
                                    Reflection
                                  </SelectItem>
                                  <SelectItem value="CHECKPOINT">
                                    Checkpoint
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`steps.${index}.estimatedTime`}>
                                Estimated Time (minutes)
                              </Label>
                              <Input
                                id={`steps.${index}.estimatedTime`}
                                type="number"
                                min="1"
                                max="300"
                                {...register(`steps.${index}.estimatedTime`, {
                                  valueAsNumber: true,
                                })}
                              />
                            </div>
                          </div>

                          {/* Validation Criteria */}
                          <SmartArrayInput
                            label="Validation Criteria (optional)"
                            value={validationCriteria.filter(Boolean)}
                            onChange={(value) =>
                              setValue(
                                `steps.${index}.validationCriteria`,
                                value,
                              )
                            }
                            placeholder="e.g., Function returns 200 status code"
                            description="How to verify this step was completed correctly. Paste a list to auto-parse!"
                          />

                          {/* Media */}
                          <div className="space-y-2">
                            <Label>Media (optional)</Label>
                            <p className="text-xs text-muted-foreground">
                              Screenshots, diagrams, or reference images
                            </p>
                            {mediaUrls.map((_, urlIndex) => (
                              <div key={urlIndex} className="space-y-2">
                                <div className="flex items-start gap-2">
                                  <div className="flex-1">
                                    <MediaUpload
                                      label={`Media ${urlIndex + 1}`}
                                      value={mediaUrls[urlIndex]}
                                      onChange={(url) => {
                                        const updated = [...mediaUrls];
                                        updated[urlIndex] = url;
                                        setValue(
                                          `steps.${index}.mediaUrls`,
                                          updated,
                                        );
                                      }}
                                      accept="image/*,video/*"
                                      maxSizeMB={10}
                                      description="Upload or enter URL"
                                    />
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      handleRemoveMediaUrl(index, urlIndex)
                                    }
                                    className="mt-8"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddMediaUrl(index)}
                              className="gap-2"
                            >
                              <Plus className="h-4 w-4" />
                              Add Media
                            </Button>
                          </div>

                          {/* Is Optional Switch */}
                          <div className="flex items-center justify-between border rounded-lg p-3">
                            <div className="space-y-0.5">
                              <Label htmlFor={`steps.${index}.isOptional`}>
                                Optional Step
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                Students can skip this step
                              </p>
                            </div>
                            <Switch
                              id={`steps.${index}.isOptional`}
                              checked={watch(`steps.${index}.isOptional`)}
                              onCheckedChange={(checked) =>
                                setValue(`steps.${index}.isOptional`, checked)
                              }
                            />
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                );
              })}
            </div>

            {errors.steps && (
              <p className="text-sm text-destructive">{errors.steps.message}</p>
            )}

            {/* Add Step Button */}
            <Button
              type="button"
              variant="outline"
              onClick={handleAddStep}
              disabled={stepFields.length >= 50}
              className="w-full gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Another Step
            </Button>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={onBack}>
                Back
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Continue to Categories"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
