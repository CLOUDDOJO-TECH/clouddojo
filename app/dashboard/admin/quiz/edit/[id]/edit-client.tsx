"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save, Loader2, Eye, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle } from "lucide-react";
import {
  quizMetadataSchema,
  AVAILABLE_PROVIDERS,
  ParsedQuestion,
} from "../../upload/validators";
import { z } from "zod";

// Edit form schema - same as quizMetadataSchema but without isNew field
const editQuizSchema = quizMetadataSchema.omit({ isNew: true });
import { MarkdownPreview } from "../../upload/components/markdown-preview";
import { useUpdateQuiz } from "../../hooks/useQuizQueries";
import { generateQuizMetadata } from "../../upload/actions";
import { getProviderLogo } from "../../upload/lib/provider-logos";
import { ProviderIcon } from "../../upload/components/provider-icon";

interface QuizWithQuestions {
  id: string;
  title: string;
  description: string | null;
  providers: string[];
  isPublic: boolean;
  free: boolean | null;
  level: string | null;
  duration: number | null;
  thumbnail: string | null;
  questions: Array<{
    id: string;
    content: string;
    isMultiSelect: boolean;
    correctAnswer: string[];
    explanation: string | null;
    options: Array<{
      id: string;
      content: string;
      isCorrect: boolean;
    }>;
  }>;
}

interface EditClientProps {
  quiz: QuizWithQuestions;
}

export default function EditClient({ quiz }: EditClientProps) {
  const updateQuizMutation = useUpdateQuiz();
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editQuizSchema),
    defaultValues: {
      title: quiz.title,
      description: quiz.description || "",
      providers: quiz.providers || [],
      duration: quiz.duration || 30,
      level: (quiz.level as any) || "INTERMEDIATE",
      free: quiz.free ?? true,
      isPublic: quiz.isPublic,
      thumbnail: quiz.thumbnail || "",
    },
  });

  const selectedProviders = watch("providers");
  const thumbnailUrl = watch("thumbnail");

  const handleImageError = (provider: string) => {
    setImageErrors((prev) => ({ ...prev, [provider]: true }));
  };

  const handleProviderToggle = (provider: string) => {
    const current = selectedProviders || [];
    if (current.includes(provider)) {
      setValue(
        "providers",
        current.filter((p) => p !== provider),
      );
    } else {
      setValue("providers", [...current, provider]);
    }
  };

  // Convert quiz questions to ParsedQuestion format for AI
  const convertToParsedQuestions = (): ParsedQuestion[] => {
    return quiz.questions.map((q, index) => ({
      content: q.content,
      options: q.options.map((opt) => ({
        content: opt.content,
        isCorrect: opt.isCorrect,
      })),
      isMultiSelect: q.isMultiSelect,
      correctAnswers: q.correctAnswer,
      explanation: q.explanation || "",
      questionNumber: `${index + 1}`,
    }));
  };

  const handleAIPrefill = async () => {
    if (!quiz.questions || quiz.questions.length === 0) {
      toast.error("No questions available for AI analysis");
      return;
    }

    setIsGeneratingAI(true);
    toast.loading("AI is analyzing your quiz and generating metadata...", {
      id: "ai-prefill",
    });

    try {
      const parsedQuestions = convertToParsedQuestions();
      const result = await generateQuizMetadata(parsedQuestions);

      if (result.success && result.metadata) {
        // Prefill form fields
        if (result.metadata.title) setValue("title", result.metadata.title);
        if (result.metadata.description)
          setValue("description", result.metadata.description);
        if (result.metadata.providers)
          setValue("providers", result.metadata.providers);
        if (result.metadata.duration)
          setValue("duration", result.metadata.duration);
        if (result.metadata.level) setValue("level", result.metadata.level);
        if (result.metadata.free !== undefined)
          setValue("free", result.metadata.free);
        if (result.metadata.isPublic !== undefined)
          setValue("isPublic", result.metadata.isPublic);

        toast.success("AI has prefilled the quiz details!", {
          id: "ai-prefill",
        });
      } else {
        toast.error(result.error || "Failed to generate metadata", {
          id: "ai-prefill",
        });
      }
    } catch (error) {
      toast.error("An error occurred while generating metadata", {
        id: "ai-prefill",
      });
      console.error("AI prefill error:", error);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const onSubmit = (data: any) => {
    // Prepare quiz data with existing questions
    const quizData = {
      title: data.title,
      description: data.description,
      providers: data.providers,
      isPublic: data.isPublic,
      free: data.free,
      level: data.level,
      duration: data.duration,
      thumbnail: data.thumbnail || undefined,
      questions: quiz.questions.map((question) => ({
        content: question.content,
        isMultiSelect: question.isMultiSelect,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        options: question.options.map((option) => ({
          content: option.content,
          isCorrect: option.isCorrect,
        })),
      })),
    };

    updateQuizMutation.mutate({ quizId: quiz.id, data: quizData });
  };

  const onError = (errors: any) => {
    console.error("Form validation errors:", errors);
    toast.error("Please fix the form errors before saving");
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard/admin/quiz/manage">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Manage Quizzes
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Quiz</h1>
            <p className="text-muted-foreground mt-2">
              Update quiz metadata and settings
            </p>
          </div>
          <Link href={`/dashboard/admin/quiz/preview/${quiz.id}`}>
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </Link>
        </div>
      </div>

      {/* Save Result */}
      {updateQuizMutation.isError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {updateQuizMutation.error?.message || "Failed to update quiz"}
          </AlertDescription>
        </Alert>
      )}
      {updateQuizMutation.isSuccess && (
        <Alert className="mb-6">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription>
            Quiz updated successfully! Redirecting...
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
        {/* Quiz Metadata */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Quiz Metadata</CardTitle>
                <CardDescription>
                  Update the basic information about this quiz
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleAIPrefill}
                disabled={isGeneratingAI || updateQuizMutation.isPending}
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
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title */}
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input id="title" {...register("title")} />
              {errors.title && (
                <p className="text-sm text-destructive mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description with Markdown Preview */}
            <div>
              <Label htmlFor="description">Description *</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <MarkdownPreview
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.description?.message}
                  />
                )}
              />
            </div>

            {/* Duration and Level */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Duration (minutes) *</Label>
                <Input
                  id="duration"
                  type="number"
                  {...register("duration", { valueAsNumber: true })}
                />
                {errors.duration && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.duration.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="level">Difficulty Level *</Label>
                <Controller
                  name="level"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BEGINER">Beginner</SelectItem>
                        <SelectItem value="INTERMEDIATE">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="ADVANCED">Advanced</SelectItem>
                        <SelectItem value="EXPERT">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.level && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.level.message}
                  </p>
                )}
              </div>
            </div>

            {/* Providers */}
            <div>
              <Label>Providers/Platforms *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
                {AVAILABLE_PROVIDERS.map((provider) => {
                  const logoUrl = getProviderLogo(provider);
                  const hasError = imageErrors[provider];
                  return (
                    <div key={provider} className="flex items-center gap-2">
                      <Checkbox
                        id={`provider-${provider}`}
                        checked={selectedProviders?.includes(provider)}
                        onCheckedChange={() => handleProviderToggle(provider)}
                      />
                      <label
                        htmlFor={`provider-${provider}`}
                        className="text-sm font-medium leading-tight cursor-pointer flex items-center gap-2 select-none"
                      >
                        {!hasError && (
                          <ProviderIcon
                            provider={provider}
                            logoUrl={logoUrl}
                            onError={() => handleImageError(provider)}
                          />
                        )}
                        <span>{provider}</span>
                      </label>
                    </div>
                  );
                })}
              </div>
              {errors.providers && (
                <p className="text-sm text-destructive mt-1">
                  {errors.providers.message}
                </p>
              )}
            </div>

            {/* Access and Visibility */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="free">Access Type *</Label>
                <Controller
                  name="free"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value ? "free" : "premium"}
                      onValueChange={(value) =>
                        field.onChange(value === "free")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <Label htmlFor="isPublic">Visibility *</Label>
                <Controller
                  name="isPublic"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value ? "public" : "private"}
                      onValueChange={(value) =>
                        field.onChange(value === "public")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            {/* Thumbnail */}
            <div>
              <Label htmlFor="thumbnail">Thumbnail URL (optional)</Label>
              <Input
                id="thumbnail"
                {...register("thumbnail")}
                placeholder="https://example.com/image.jpg"
              />
              {thumbnailUrl && thumbnailUrl.trim() !== "" && (
                <div className="mt-3 relative">
                  <div className="rounded-lg border overflow-hidden bg-muted/50">
                    <div className="flex items-center justify-between p-2 bg-background border-b">
                      <span className="text-xs font-medium text-muted-foreground">
                        Thumbnail Preview
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => setValue("thumbnail", "")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="p-4 flex items-center justify-center bg-muted/30">
                      <img
                        src={thumbnailUrl}
                        alt="Thumbnail preview"
                        className="max-w-full max-h-48 rounded object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const errorMsg =
                            target.parentElement?.querySelector(".error-msg");
                          if (errorMsg) {
                            (errorMsg as HTMLElement).style.display = "block";
                          } else {
                            const div = document.createElement("div");
                            div.className =
                              "error-msg text-sm text-destructive text-center";
                            div.textContent =
                              "Failed to load image. Please check the URL.";
                            target.parentElement?.appendChild(div);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Questions Info */}
        <Card>
          <CardHeader>
            <CardTitle>Questions ({quiz.questions.length})</CardTitle>
            <CardDescription>
              Question editing is not available in this interface. To edit
              questions, please re-upload the quiz JSON file.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              This quiz contains {quiz.questions.length} question(s). Only
              metadata can be edited here.
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-between pt-4">
          <Link href="/dashboard/admin/quiz/manage">
            <Button
              variant="outline"
              type="button"
              disabled={updateQuizMutation.isPending}
            >
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={updateQuizMutation.isPending}
            size="lg"
          >
            {updateQuizMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving Changes...
              </>
            ) : updateQuizMutation.isSuccess ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Saved!
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
