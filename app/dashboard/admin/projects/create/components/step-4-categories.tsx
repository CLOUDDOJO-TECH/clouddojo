"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, X, FolderTree } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  projectCategoriesSchema,
  ProjectCategories,
  generateSlug,
} from "../validators";
import { getProjectCategories } from "../actions";

interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
}

interface Step4CategoriesProps {
  onComplete: (data: ProjectCategories) => void;
  onBack: () => void;
  initialData?: Partial<ProjectCategories>;
}

export function Step4Categories({
  onComplete,
  onBack,
  initialData,
}: Step4CategoriesProps) {
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategorySlug, setNewCategorySlug] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [newCategoryImageUrl, setNewCategoryImageUrl] = useState("");
  const [pendingNewCategories, setPendingNewCategories] = useState<
    Array<{
      name: string;
      slug: string;
      description?: string;
      imageUrl?: string;
      sortOrder: number;
    }>
  >(initialData?.newCategories || []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProjectCategories>({
    resolver: zodResolver(projectCategoriesSchema),
    defaultValues: {
      categoryIds: initialData?.categoryIds || [],
      newCategories: initialData?.newCategories || [],
    },
  });

  const selectedCategoryIds = watch("categoryIds");

  useEffect(() => {
    async function loadCategories() {
      setIsLoadingCategories(true);
      const result = await getProjectCategories();
      if (result.success && result.categories) {
        setCategories(result.categories);
      }
      setIsLoadingCategories(false);
    }
    loadCategories();
  }, []);

  const handleCategoryToggle = (categoryId: string) => {
    const current = selectedCategoryIds || [];
    const updated = current.includes(categoryId)
      ? current.filter((id) => id !== categoryId)
      : [...current, categoryId];
    setValue("categoryIds", updated);
  };

  const handleNewCategoryNameChange = (name: string) => {
    setNewCategoryName(name);
    setNewCategorySlug(generateSlug(name));
  };

  const handleAddNewCategory = () => {
    if (!newCategoryName.trim()) return;

    const newCategory = {
      name: newCategoryName.trim(),
      slug: newCategorySlug.trim() || generateSlug(newCategoryName),
      description: newCategoryDescription.trim() || undefined,
      imageUrl: newCategoryImageUrl.trim() || undefined,
      sortOrder: categories.length + pendingNewCategories.length,
    };

    setPendingNewCategories([...pendingNewCategories, newCategory]);
    setValue("newCategories", [...pendingNewCategories, newCategory]);

    // Reset form
    setNewCategoryName("");
    setNewCategorySlug("");
    setNewCategoryDescription("");
    setNewCategoryImageUrl("");
    setShowNewCategoryForm(false);
  };

  const handleRemoveNewCategory = (index: number) => {
    const updated = pendingNewCategories.filter((_, idx) => idx !== index);
    setPendingNewCategories(updated);
    setValue("newCategories", updated);
  };

  const onSubmit = (data: ProjectCategories) => {
    onComplete(data);
  };

  const totalSelected =
    selectedCategoryIds.length + pendingNewCategories.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Categories</CardTitle>
          <CardDescription>
            Select categories for this project. Projects can belong to multiple
            categories.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Selection Summary */}
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <div className="p-2.5 bg-indigo-500/10 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20px"
                    height="20px"
                    viewBox="0 0 18 18"
                    className="text-indigo-500"
                  >
                    <path
                      d="M15.5,12h-1.75v-1.75c0-.414-.336-.75-.75-.75s-.75,.336-.75,.75v1.75h-1.75c-.414,0-.75,.336-.75,.75s.336,.75,.75,.75h1.75v1.75c0,.414,.336,.75,.75,.75s.75-.336,.75-.75v-1.75h1.75c.414,0,.75-.336,.75-.75s-.336-.75-.75-.75Z"
                      fill="currentColor"
                    ></path>
                    <circle cx="5" cy="5" r="3.25" fill="currentColor"></circle>
                    <circle
                      cx="13"
                      cy="5"
                      r="3.25"
                      fill="currentColor"
                    ></circle>
                    <circle
                      cx="5"
                      cy="13"
                      r="3.25"
                      fill="currentColor"
                    ></circle>
                  </svg>
                </div>
                <span className="text-sm font-medium">
                  {totalSelected}{" "}
                  {totalSelected === 1 ? "category" : "categories"} selected
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowNewCategoryForm(!showNewCategoryForm)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                New Category
              </Button>
            </div>

            {/* New Category Form */}
            {showNewCategoryForm && (
              <Card className="border-2 border-primary/50">
                <CardHeader>
                  <CardTitle className="text-base">
                    Create New Category
                  </CardTitle>
                  <CardDescription>
                    Add a new category if the existing ones don't fit
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newCategoryName">
                      Category Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="newCategoryName"
                      placeholder="e.g., AWS Solutions Architect"
                      value={newCategoryName}
                      onChange={(e) =>
                        handleNewCategoryNameChange(e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newCategorySlug">
                      Slug <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="newCategorySlug"
                      placeholder="aws-solutions-architect"
                      value={newCategorySlug}
                      onChange={(e) => setNewCategorySlug(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Auto-generated from name. Use lowercase letters, numbers,
                      and hyphens only.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newCategoryDescription">
                      Description (optional)
                    </Label>
                    <Input
                      id="newCategoryDescription"
                      placeholder="Brief description of this category"
                      value={newCategoryDescription}
                      onChange={(e) =>
                        setNewCategoryDescription(e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newCategoryImageUrl">
                      Image URL (optional)
                    </Label>
                    <Input
                      id="newCategoryImageUrl"
                      type="url"
                      placeholder="https://example.com/category-image.jpg"
                      value={newCategoryImageUrl}
                      onChange={(e) => setNewCategoryImageUrl(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={handleAddNewCategory}
                      disabled={!newCategoryName.trim()}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Category
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowNewCategoryForm(false);
                        setNewCategoryName("");
                        setNewCategorySlug("");
                        setNewCategoryDescription("");
                        setNewCategoryImageUrl("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pending New Categories */}
            {pendingNewCategories.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  New Categories to Create
                </Label>
                <div className="space-y-2">
                  {pendingNewCategories.map((cat, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg bg-primary/5"
                    >
                      <div>
                        <div className="font-medium">{cat.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Slug: {cat.slug}
                        </div>
                        {cat.description && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {cat.description}
                          </div>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveNewCategory(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Existing Categories */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Select Existing Categories
              </Label>
              {isLoadingCategories ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center p-8 border rounded-lg bg-muted/30">
                  <p className="text-sm text-muted-foreground">
                    No categories available. Create a new one above.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {categories.map((category) => {
                    const isSelected = selectedCategoryIds?.includes(
                      category.id,
                    );
                    return (
                      <div
                        key={category.id}
                        className={`flex items-start gap-3 p-3 border rounded-lg transition-colors ${
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "hover:bg-muted/50"
                        }`}
                      >
                        <Checkbox
                          id={`category-${category.id}`}
                          checked={isSelected}
                          onCheckedChange={() =>
                            handleCategoryToggle(category.id)
                          }
                        />
                        <div className="flex-1">
                          <label
                            htmlFor={`category-${category.id}`}
                            className="text-sm font-medium cursor-pointer"
                          >
                            {category.name}
                          </label>
                          {category.description && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {category.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {errors.categoryIds && (
              <p className="text-sm text-destructive">
                {errors.categoryIds.message}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={onBack}>
                Back
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || totalSelected === 0}
              >
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
