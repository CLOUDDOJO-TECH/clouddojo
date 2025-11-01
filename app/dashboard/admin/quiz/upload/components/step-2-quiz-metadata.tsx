"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { quizMetadataSchema, QuizMetadata, ValidationResult, AVAILABLE_PROVIDERS } from "../validators";
import { getCategories, generateQuizMetadata } from "../actions";
import { toast } from "sonner";
import { MarkdownPreview } from "./markdown-preview";

interface Category {
  id: string;
  name: string;
  description: string | null;
}

interface Step2QuizMetadataProps {
  onComplete: (metadata: QuizMetadata) => void;
  onBack: () => void;
  initialData?: Partial<QuizMetadata>;
  validationResult?: ValidationResult;
}

export function Step2QuizMetadata({ onComplete, onBack, initialData, validationResult }: Step2QuizMetadataProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<QuizMetadata>({
    resolver: zodResolver(quizMetadataSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      providers: initialData?.providers || [],
      duration: initialData?.duration || 60,
      level: initialData?.level || "BEGINER",
      free: initialData?.free ?? true,
      isPublic: initialData?.isPublic ?? true,
      isNew: initialData?.isNew ?? true,
      thumbnail: initialData?.thumbnail || "",
      categoryId: initialData?.categoryId || "",
      categoryName: initialData?.categoryName || "",
    },
  });

  const selectedCategoryId = watch("categoryId");
  const selectedProviders = watch("providers");
  const description = watch("description");

  useEffect(() => {
    async function loadCategories() {
      setIsLoadingCategories(true);
      const cats = await getCategories();
      setCategories(cats);
      setIsLoadingCategories(false);
    }
    loadCategories();
  }, []);

  const handleAIPrefill = async () => {
    if (!validationResult || validationResult.validQuestions.length === 0) {
      toast.error("No questions available for AI analysis");
      return;
    }

    setIsGeneratingAI(true);
    toast.loading("AI is generating quiz details...", { id: "ai-prefill" });

    try {
      const result = await generateQuizMetadata(validationResult.validQuestions);

      if (result.success && result.metadata) {
        // Prefill form fields
        if (result.metadata.title) setValue("title", result.metadata.title);
        if (result.metadata.description) setValue("description", result.metadata.description);
        if (result.metadata.providers) setValue("providers", result.metadata.providers);
        if (result.metadata.duration) setValue("duration", result.metadata.duration);
        if (result.metadata.level) setValue("level", result.metadata.level);
        if (result.metadata.free !== undefined) setValue("free", result.metadata.free);
        if (result.metadata.isPublic !== undefined) setValue("isPublic", result.metadata.isPublic);
        if (result.metadata.isNew !== undefined) setValue("isNew", result.metadata.isNew);

        // Handle category
        if (result.metadata.categoryName) {
          setShowNewCategory(true);
          setValue("categoryName", result.metadata.categoryName);
        }

        toast.success("AI has prefilled the quiz details!", { id: "ai-prefill" });
      } else {
        toast.error(result.error || "Failed to generate metadata", { id: "ai-prefill" });
      }
    } catch (error) {
      toast.error("An error occurred while generating metadata", { id: "ai-prefill" });
      console.error("AI prefill error:", error);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleProviderToggle = (provider: string) => {
    const current = selectedProviders || [];
    const updated = current.includes(provider)
      ? current.filter((p) => p !== provider)
      : [...current, provider];
    setValue("providers", updated);
  };

  const onSubmit = (data: QuizMetadata) => {
    // If creating new category, clear categoryId
    if (showNewCategory) {
      data.categoryId = undefined;
    } else {
      // If using existing category, clear categoryName
      data.categoryName = undefined;
    }

    onComplete(data);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Quiz Information</CardTitle>
              <CardDescription>
                Provide details about the quiz. All fields marked with * are required.
              </CardDescription>
            </div>
            {validationResult && validationResult.validQuestions.length > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleAIPrefill}
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
          {validationResult && validationResult.validQuestions.length > 0 && (
            <Alert className="mb-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-900 dark:text-blue-200">
                <strong>Tip:</strong> Click AI Prefill to let AI automatically generate quiz details based on your questions!
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Quiz Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g., AWS Cloud Practitioner Practice Test"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            {/* Description with Markdown Preview */}
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <MarkdownPreview
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.description?.message}
                  placeholder="Write a comprehensive description using Markdown formatting..."
                />
              )}
            />

            {/* Providers/Platforms */}
            <div className="space-y-2">
              <Label>
                Providers/Platforms <span className="text-destructive">*</span>
              </Label>
              <p className="text-xs text-muted-foreground mb-3">
                Select all cloud providers or platforms covered in this quiz
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {AVAILABLE_PROVIDERS.map((provider) => (
                  <div key={provider} className="flex items-center space-x-2">
                    <Checkbox
                      id={provider}
                      checked={selectedProviders?.includes(provider)}
                      onCheckedChange={() => handleProviderToggle(provider)}
                    />
                    <label
                      htmlFor={provider}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {provider}
                    </label>
                  </div>
                ))}
              </div>
              {errors.providers && (
                <p className="text-sm text-destructive">{errors.providers.message}</p>
              )}
            </div>

            {/* Duration and Level - Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration">
                  Duration (minutes) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  max="300"
                  placeholder="60"
                  {...register("duration", { valueAsNumber: true })}
                />
                {errors.duration && (
                  <p className="text-sm text-destructive">{errors.duration.message}</p>
                )}
              </div>

              {/* Difficulty Level */}
              <div className="space-y-2">
                <Label htmlFor="level">
                  Difficulty Level <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={watch("level")}
                  onValueChange={(value) => setValue("level", value as any)}
                >
                  <SelectTrigger id="level">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BEGINER">Beginner</SelectItem>
                    <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                    <SelectItem value="ADVANCED">Advanced</SelectItem>
                    <SelectItem value="EXPERT">Expert</SelectItem>
                  </SelectContent>
                </Select>
                {errors.level && (
                  <p className="text-sm text-destructive">{errors.level.message}</p>
                )}
              </div>
            </div>

            {/* Category Selection */}
            <div className="space-y-2">
              <Label>Category</Label>
              <div className="flex items-center gap-2 mb-2">
                <Button
                  type="button"
                  variant={!showNewCategory ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowNewCategory(false)}
                >
                  Select Existing
                </Button>
                <Button
                  type="button"
                  variant={showNewCategory ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowNewCategory(true)}
                >
                  Create New
                </Button>
              </div>

              {!showNewCategory ? (
                <Select
                  value={selectedCategoryId || ""}
                  onValueChange={(value) => setValue("categoryId", value)}
                  disabled={isLoadingCategories}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingCategories ? "Loading categories..." : "Select a category"} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  placeholder="Enter new category name"
                  {...register("categoryName")}
                />
              )}
            </div>

            {/* Thumbnail URL */}
            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail URL (optional)</Label>
              <Input
                id="thumbnail"
                type="url"
                placeholder="https://example.com/thumbnail.jpg"
                {...register("thumbnail")}
              />
              {errors.thumbnail && (
                <p className="text-sm text-destructive">{errors.thumbnail.message}</p>
              )}
            </div>

            {/* Switches */}
            <div className="space-y-4 border rounded-lg p-4">
              <h3 className="font-medium text-sm">Quiz Settings</h3>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="free">Free Access</Label>
                  <p className="text-xs text-muted-foreground">
                    Allow all users to access this quiz without subscription
                  </p>
                </div>
                <Switch
                  id="free"
                  checked={watch("free")}
                  onCheckedChange={(checked) => setValue("free", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="isPublic">Public</Label>
                  <p className="text-xs text-muted-foreground">
                    Make this quiz visible in the quiz library
                  </p>
                </div>
                <Switch
                  id="isPublic"
                  checked={watch("isPublic")}
                  onCheckedChange={(checked) => setValue("isPublic", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="isNew">Mark as New</Label>
                  <p className="text-xs text-muted-foreground">
                    Display a "New" badge on this quiz
                  </p>
                </div>
                <Switch
                  id="isNew"
                  checked={watch("isNew")}
                  onCheckedChange={(checked) => setValue("isNew", checked)}
                />
              </div>
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
                  "Continue to Preview"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
