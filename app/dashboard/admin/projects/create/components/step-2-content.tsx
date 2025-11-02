"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, X, Lightbulb, Target, Wrench } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import {
  projectContentSchema,
  ProjectContent,
  AVAILABLE_TECHNOLOGIES,
} from "../validators";

interface Step2ContentProps {
  onComplete: (data: ProjectContent) => void;
  onBack: () => void;
  initialData?: Partial<ProjectContent>;
}

export function Step2Content({
  onComplete,
  onBack,
  initialData,
}: Step2ContentProps) {
  const [techSearchQuery, setTechSearchQuery] = useState("");
  const [showTechSuggestions, setShowTechSuggestions] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProjectContent>({
    resolver: zodResolver(projectContentSchema),
    defaultValues: {
      prerequisites: initialData?.prerequisites || [""],
      learningObjectives: initialData?.learningObjectives || ["", "", ""],
      keyTechnologies: initialData?.keyTechnologies || [],
    },
  });

  const {
    fields: prerequisiteFields,
    append: appendPrerequisite,
    remove: removePrerequisite,
  } = useFieldArray({
    control,
    name: "prerequisites",
  });

  const {
    fields: objectiveFields,
    append: appendObjective,
    remove: removeObjective,
  } = useFieldArray({
    control,
    name: "learningObjectives",
  });

  const keyTechnologies = watch("keyTechnologies");

  const filteredTechSuggestions = AVAILABLE_TECHNOLOGIES.filter(
    (tech) =>
      tech.toLowerCase().includes(techSearchQuery.toLowerCase()) &&
      !keyTechnologies.includes(tech)
  ).slice(0, 10);

  const handleAddTechnology = (tech: string) => {
    if (!keyTechnologies.includes(tech)) {
      setValue("keyTechnologies", [...keyTechnologies, tech]);
    }
    setTechSearchQuery("");
    setShowTechSuggestions(false);
  };

  const handleRemoveTechnology = (tech: string) => {
    setValue(
      "keyTechnologies",
      keyTechnologies.filter((t) => t !== tech)
    );
  };

  const handleCustomTechAdd = () => {
    if (techSearchQuery.trim() && !keyTechnologies.includes(techSearchQuery.trim())) {
      setValue("keyTechnologies", [...keyTechnologies, techSearchQuery.trim()]);
      setTechSearchQuery("");
      setShowTechSuggestions(false);
    }
  };

  const onSubmit = (data: ProjectContent) => {
    onComplete(data);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Content</CardTitle>
          <CardDescription>
            Define what students need to know and what they will learn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Prerequisites */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-orange-500" />
                <Label className="text-base font-semibold">
                  Prerequisites <span className="text-destructive">*</span>
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">
                What students should know or have before starting this project
              </p>

              <div className="space-y-2">
                {prerequisiteFields.map((field, index) => (
                  <div key={field.id} className="flex items-start gap-2">
                    <div className="flex-1">
                      <Input
                        placeholder="e.g., Basic knowledge of AWS services"
                        {...register(`prerequisites.${index}` as const)}
                      />
                    </div>
                    {prerequisiteFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removePrerequisite(index)}
                        className="shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {errors.prerequisites && (
                <p className="text-sm text-destructive">
                  {errors.prerequisites.message || errors.prerequisites.root?.message}
                </p>
              )}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendPrerequisite("")}
                disabled={prerequisiteFields.length >= 10}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Prerequisite
              </Button>
            </div>

            {/* Learning Objectives */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                <Label className="text-base font-semibold">
                  Learning Objectives <span className="text-destructive">*</span>
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">
                What students will be able to do after completing this project (minimum 3)
              </p>

              <div className="space-y-2">
                {objectiveFields.map((field, index) => (
                  <div key={field.id} className="flex items-start gap-2">
                    <div className="flex-1">
                      <Input
                        placeholder="e.g., Deploy a scalable serverless application using AWS Lambda"
                        {...register(`learningObjectives.${index}` as const)}
                      />
                    </div>
                    {objectiveFields.length > 3 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeObjective(index)}
                        className="shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {errors.learningObjectives && (
                <p className="text-sm text-destructive">
                  {errors.learningObjectives.message || errors.learningObjectives.root?.message}
                </p>
              )}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendObjective("")}
                disabled={objectiveFields.length >= 10}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Learning Objective
              </Button>
            </div>

            {/* Key Technologies */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-purple-500" />
                <Label className="text-base font-semibold">
                  Key Technologies <span className="text-destructive">*</span>
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Technologies and services covered in this project
              </p>

              {/* Selected Technologies */}
              {keyTechnologies.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-muted/30">
                  {keyTechnologies.map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="gap-1 py-1.5 px-3"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => handleRemoveTechnology(tech)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Technology Search Input */}
              <div className="relative">
                <Input
                  placeholder="Search or add technologies..."
                  value={techSearchQuery}
                  onChange={(e) => {
                    setTechSearchQuery(e.target.value);
                    setShowTechSuggestions(true);
                  }}
                  onFocus={() => setShowTechSuggestions(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (filteredTechSuggestions.length > 0) {
                        handleAddTechnology(filteredTechSuggestions[0]);
                      } else {
                        handleCustomTechAdd();
                      }
                    }
                  }}
                />

                {/* Suggestions Dropdown */}
                {showTechSuggestions && techSearchQuery && (
                  <div className="absolute z-10 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-60 overflow-auto">
                    {filteredTechSuggestions.length > 0 ? (
                      <div className="py-1">
                        {filteredTechSuggestions.map((tech) => (
                          <button
                            key={tech}
                            type="button"
                            onClick={() => handleAddTechnology(tech)}
                            className="w-full px-3 py-2 text-left hover:bg-muted text-sm transition-colors"
                          >
                            {tech}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="py-2 px-3">
                        <button
                          type="button"
                          onClick={handleCustomTechAdd}
                          className="w-full text-left text-sm text-muted-foreground hover:text-foreground"
                        >
                          Add "{techSearchQuery}"
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {errors.keyTechnologies && (
                <p className="text-sm text-destructive">
                  {errors.keyTechnologies.message}
                </p>
              )}

              <p className="text-xs text-muted-foreground">
                Start typing to search from common technologies or add your own
              </p>
            </div>

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
                  "Continue to Steps"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
