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
import { SmartArrayInput } from "@/components/ui/smart-array-input";
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
      !keyTechnologies.includes(tech),
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
      keyTechnologies.filter((t) => t !== tech),
    );
  };

  const handleCustomTechAdd = () => {
    if (
      techSearchQuery.trim() &&
      !keyTechnologies.includes(techSearchQuery.trim())
    ) {
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
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-orange-500/10 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24px"
                    height="24px"
                    viewBox="0 0 18 18"
                    className="text-orange-500"
                  >
                    <path
                      d="M14.25,5h-1.25v-.75c0-.965-.785-1.75-1.75-1.75H4v7.5h7.146c.223,0,.334,.27,.177,.427l-1.673,1.673c.302,.246,.681,.4,1.1,.4h3.5c.965,0,1.75-.785,1.75-1.75V6.75c0-.965-.785-1.75-1.75-1.75Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M3.75,17c-.414,0-.75-.336-.75-.75V1.75c0-.414,.336-.75,.75-.75s.75,.336,.75,.75v14.5c0,.414-.336,.75-.75,.75Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </div>
              </div>
              <SmartArrayInput
                label="Prerequisites"
                value={watch("prerequisites").filter(Boolean)}
                onChange={(value) => setValue("prerequisites", value)}
                placeholder="e.g., Basic knowledge of AWS services"
                required
                description="What students should know before starting. Paste an array or list to auto-parse!"
                maxItems={10}
              />
              {errors.prerequisites && (
                <p className="text-sm text-destructive">
                  {errors.prerequisites.message ||
                    errors.prerequisites.root?.message}
                </p>
              )}
            </div>

            {/* Learning Objectives */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-500/10 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24px"
                    height="24px"
                    viewBox="0 0 18 18"
                    className="text-blue-500"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M14.7115 0.762844C14.6293 0.51625 14.4253 0.329799 14.1723 0.270078C13.9194 0.210358 13.6535 0.285884 13.4697 0.469685L10.9697 2.96968C10.7688 3.17056 10.6987 3.46768 10.7885 3.73719L11.3919 5.54742L8.46967 8.46967C8.17678 8.76256 8.17678 9.23744 8.46967 9.53033C8.76256 9.82322 9.23744 9.82322 9.53033 9.53033L12.4526 6.6081L14.2628 7.21153C14.5324 7.30136 14.8295 7.23122 15.0304 7.03034L17.5304 4.53034C17.7142 4.34654 17.7897 4.08068 17.73 3.8277C17.6702 3.57472 17.4838 3.3707 17.2372 3.2885L15.3429 2.65709L14.7115 0.762844Z"
                      fill="currentColor"
                    ></path>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.50581 4.71453C9.52914 5.12809 9.21279 5.48225 8.79924 5.50558C6.96023 5.6093 5.5 7.13468 5.5 9C5.5 10.9327 7.06723 12.5 9 12.5C10.8652 12.5 12.3906 11.0398 12.4944 9.20095C12.5177 8.7874 12.8719 8.47107 13.2855 8.49442C13.699 8.51776 14.0154 8.87194 13.992 9.2855C13.8436 11.9141 11.6654 14 9 14C6.23878 14 4 11.7611 4 9C4 6.33451 6.08597 4.15623 8.71476 4.00796C9.12832 3.98463 9.48248 4.30097 9.50581 4.71453Z"
                      fill="currentColor"
                    ></path>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1 9C1 4.58189 4.58178 1 9 1C9.02381 1 9.04718 1.00012 9.0704 1.00034C9.48459 1.00427 9.81718 1.34322 9.81326 1.75742C9.80933 2.17161 9.47038 2.5042 9.05618 2.50028L9 2.5C5.41022 2.5 2.5 5.41031 2.5 9C2.5 12.5897 5.41022 15.5 9 15.5C12.5898 15.5 15.5 12.5897 15.5 9L15.4997 8.94359C15.4958 8.5294 15.8284 8.19046 16.2426 8.18655C16.6568 8.18265 16.9958 8.51525 16.9997 8.92944C16.9999 8.953 17 8.97644 17 9C17 13.4181 13.4182 17 9 17C4.58178 17 1 13.4181 1 9Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </div>
              </div>
              <SmartArrayInput
                label="Learning Objectives"
                value={watch("learningObjectives").filter(Boolean)}
                onChange={(value) => setValue("learningObjectives", value)}
                placeholder="e.g., Deploy a scalable serverless application using AWS Lambda"
                required
                description="What students will learn (minimum 3). Paste an array or list to auto-parse!"
                maxItems={10}
              />
              {errors.learningObjectives && (
                <p className="text-sm text-destructive">
                  {errors.learningObjectives.message ||
                    errors.learningObjectives.root?.message}
                </p>
              )}
            </div>

            {/* Key Technologies */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-500/10 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24px"
                    height="24px"
                    viewBox="0 0 18 18"
                    className="text-purple-500"
                  >
                    <path
                      d="M9 6.75C10.1046 6.75 11 5.855 11 4.75C11 3.645 10.1046 2.75 9 2.75C7.8954 2.75 7 3.645 7 4.75C7 5.855 7.8954 6.75 9 6.75Z"
                      fill="currentColor"
                      fillOpacity="0.3"
                    ></path>
                    <path
                      d="M9 1.5V2.75"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    ></path>
                    <path
                      d="M8.045 6.50702L2.75 16.25"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    ></path>
                    <path
                      d="M13.7777 13.5405L15.25 16.25"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    ></path>
                    <path
                      d="M9.95502 6.50702L12.343 10.901"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    ></path>
                    <path
                      d="M9 6.75C10.1046 6.75 11 5.855 11 4.75C11 3.645 10.1046 2.75 9 2.75C7.8954 2.75 7 3.645 7 4.75C7 5.855 7.8954 6.75 9 6.75Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    ></path>
                    <path
                      d="M14 9.64899C12.729 10.946 10.959 11.75 9 11.75C7.041 11.75 5.27 10.945 4 9.64899"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    ></path>
                  </svg>
                </div>
              </div>
              <SmartArrayInput
                label="Key Technologies"
                value={watch("keyTechnologies")}
                onChange={(value) => setValue("keyTechnologies", value)}
                placeholder="e.g., AWS Lambda, Docker, Kubernetes"
                required
                description="Technologies covered in this project. Type to search from 60+ suggestions or paste a list!"
                suggestions={AVAILABLE_TECHNOLOGIES}
              />
              {errors.keyTechnologies && (
                <p className="text-sm text-destructive">
                  {errors.keyTechnologies.message}
                </p>
              )}
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
