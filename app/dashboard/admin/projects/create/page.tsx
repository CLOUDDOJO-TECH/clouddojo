"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  FileText,
  ListChecks,
  Route,
  FolderTree,
  Eye,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Save,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Step1BasicInfo } from "./components/step-1-basic-info";
import { Step2Content } from "./components/step-2-content";
import { Step3Steps } from "./components/step-3-steps";
import { Step4Categories } from "./components/step-4-categories";
import { Step5Preview } from "./components/step-5-preview";
import {
  ProjectBasicInfo,
  ProjectContent,
  ProjectSteps,
  ProjectCategories,
  CompleteProject,
} from "./validators";
import { generateProjectMetadata } from "./actions";
import { toast } from "sonner";
import { draftManager } from "./draft-manager";

type Step = 1 | 2 | 3 | 4 | 5;

// SVG Icons for Stepper
const BasicInfoIcon = () => <FileText className="h-5 w-5" />;
const ContentIcon = () => <ListChecks className="h-5 w-5" />;
const StepsIcon = () => <Route className="h-5 w-5" />;
const CategoriesIcon = () => <FolderTree className="h-5 w-5" />;
const PreviewIcon = () => <Eye className="h-5 w-5" />;
const CheckIcon = () => <CheckCircle className="h-5 w-5" />;

export default function CreateProjectPage() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [basicInfo, setBasicInfo] = useState<ProjectBasicInfo | null>(null);
  const [content, setContent] = useState<ProjectContent | null>(null);
  const [steps, setSteps] = useState<ProjectSteps | null>(null);
  const [categories, setCategories] = useState<ProjectCategories | null>(null);
  const [showRestoreDraftDialog, setShowRestoreDraftDialog] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  // Check for existing draft on mount
  useEffect(() => {
    const checkDraft = async () => {
      const hasDraft = await draftManager.hasDraft();
      if (hasDraft) {
        setShowRestoreDraftDialog(true);
      }
    };
    checkDraft();
  }, []);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (basicInfo || content || steps || categories) {
        saveDraft();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [basicInfo, content, steps, categories, currentStep]);

  const saveDraft = async () => {
    const success = await draftManager.saveDraft({
      currentStep,
      basicInfo,
      content,
      steps,
      categories,
    });

    if (success) {
      setLastSavedAt(new Date().toISOString());
      toast.success("Draft saved successfully!");
    } else {
      toast.error("Failed to save draft");
    }
  };

  const loadDraft = async () => {
    const draft = await draftManager.loadDraft();
    if (draft) {
      setCurrentStep(draft.currentStep as Step);
      setBasicInfo(draft.basicInfo);
      setContent(draft.content);
      setSteps(draft.steps);
      setCategories(draft.categories);
      setLastSavedAt(draft.savedAt);
      toast.success("Draft restored!");
    }
    setShowRestoreDraftDialog(false);
  };

  const discardDraft = async () => {
    await draftManager.clearDraft();
    setShowRestoreDraftDialog(false);
  };

  const clearDraftAfterPublish = async () => {
    await draftManager.clearDraft();
    setLastSavedAt(null);
  };

  const handleStep1Complete = (data: ProjectBasicInfo) => {
    setBasicInfo(data);
    setCurrentStep(2);
  };

  const handleStep2Complete = (data: ProjectContent) => {
    setContent(data);
    setCurrentStep(3);
  };

  const handleStep3Complete = (data: ProjectSteps) => {
    setSteps(data);
    setCurrentStep(4);
  };

  const handleStep4Complete = (data: ProjectCategories) => {
    setCategories(data);
    setCurrentStep(5);
  };

  const handleBackToStep = (step: Step) => {
    setCurrentStep(step);
  };

  const handleEditFromPreview = (step: number) => {
    setCurrentStep(step as Step);
  };

  // AI Prefill handler for Step 1
  const handleAIPrefill = async (currentValues: {
    title?: string;
    description?: string;
  }): Promise<Partial<ProjectBasicInfo> | null> => {
    // Use current form values (what user is typing) instead of saved state
    const outline = currentValues.title || currentValues.description;
    if (!outline || outline.trim().length === 0) {
      toast.error("Please enter a title or description first");
      return null;
    }

    const result = await generateProjectMetadata(outline);
    if (result.success && result.metadata) {
      return result.metadata;
    }

    if (result.error) {
      toast.error(result.error);
    }
    return null;
  };

  const wizardSteps = [
    {
      number: 1,
      title: "Basic Info",
      icon: BasicInfoIcon,
      description: "Project details",
    },
    {
      number: 2,
      title: "Content",
      icon: ContentIcon,
      description: "Prerequisites & objectives",
    },
    {
      number: 3,
      title: "Steps",
      icon: StepsIcon,
      description: "Define project steps",
    },
    {
      number: 4,
      title: "Categories",
      icon: CategoriesIcon,
      description: "Assign categories",
    },
    {
      number: 5,
      title: "Preview",
      icon: PreviewIcon,
      description: "Review & publish",
    },
  ];

  // Build complete project data for preview
  const completeProjectData: CompleteProject | null =
    basicInfo && content && steps && categories
      ? {
          ...basicInfo,
          ...content,
          ...steps,
          ...categories,
        }
      : null;

  return (
    <>
      {/* Restore Draft Dialog */}
      <AlertDialog
        open={showRestoreDraftDialog}
        onOpenChange={setShowRestoreDraftDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Resume Draft?</AlertDialogTitle>
            <AlertDialogDescription>
              You have an unsaved draft from{" "}
              {draftManager.getDraftTimestamp() &&
                draftManager.getTimeAgo(draftManager.getDraftTimestamp()!)}
              . Would you like to continue where you left off?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={discardDraft}>
              Start Fresh
            </AlertDialogCancel>
            <AlertDialogAction onClick={loadDraft}>
              Resume Draft
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex h-screen w-full">
        {/* Sidebar Stepper - Sticky */}
        <div
          className={`
          shrink-0 border-r bg-muted/30 overflow-y-auto transition-all duration-300
          ${isSidebarCollapsed ? "w-20" : "w-80"}
        `}
        >
          <div className="p-6 sticky top-0 bg-muted/30 z-10 border-b">
            {!isSidebarCollapsed && (
              <>
                <Link href="/dashboard/admin">
                  <Button variant="ghost" size="sm" className="mb-6 -ml-2">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Admin
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    Create New Project
                  </h1>
                  <p className="text-sm text-muted-foreground mt-2">
                    Build a hands-on project for students to learn cloud
                    technologies
                  </p>

                  {/* Save Draft Button */}
                  <Button
                    onClick={saveDraft}
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save Draft
                  </Button>

                  {/* Last Saved Indicator */}
                  {lastSavedAt && (
                    <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>
                        Last saved {draftManager.getTimeAgo(lastSavedAt)}
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Collapse Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className={`
              absolute top-6 -right-4 h-8 w-8 rounded-full border bg-background shadow-sm
              ${isSidebarCollapsed ? "left-1/2 -translate-x-1/2 right-auto" : ""}
            `}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className={`pt-8 ${isSidebarCollapsed ? "px-3" : "p-6"}`}>
            <div>
              <div className="space-y-2 relative">
                {/* Vertical Progress Line */}
                {!isSidebarCollapsed && (
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-muted">
                    <div
                      className="w-full bg-emerald-600 transition-all duration-500"
                      style={{
                        height: `${((currentStep - 1) / (wizardSteps.length - 1)) * 100}%`,
                      }}
                    />
                  </div>
                )}

                {/* Steps */}
                {wizardSteps.map((step) => {
                  const StepIcon = step.icon;
                  const isActive = currentStep === step.number;
                  const isCompleted = currentStep > step.number;

                  return (
                    <div
                      key={step.number}
                      className={`
                      flex items-start gap-4 relative
                      ${isSidebarCollapsed ? "justify-center" : ""}
                    `}
                    >
                      {/* Step Icon */}
                      <div
                        className={`
                        flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all z-10 shrink-0
                        ${
                          isCompleted
                            ? "bg-emerald-600 border-emerald-600 text-white"
                            : isActive
                              ? "border-emerald-600 bg-background text-emerald-600"
                              : "border-muted bg-background text-muted-foreground"
                        }
                      `}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <StepIcon />
                        )}
                      </div>

                      {/* Step Info */}
                      {!isSidebarCollapsed && (
                        <div className="pt-2 pb-6">
                          <p
                            className={`text-sm font-semibold ${
                              isActive
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {step.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {step.description}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="py-8 px-6">
            {currentStep === 1 && (
              <Step1BasicInfo
                onComplete={handleStep1Complete}
                initialData={basicInfo || undefined}
                onAIPrefill={handleAIPrefill}
              />
            )}

            {currentStep === 2 && (
              <Step2Content
                onComplete={handleStep2Complete}
                onBack={() => handleBackToStep(1)}
                initialData={content || undefined}
              />
            )}

            {currentStep === 3 && (
              <Step3Steps
                onComplete={handleStep3Complete}
                onBack={() => handleBackToStep(2)}
                initialData={steps || undefined}
              />
            )}

            {currentStep === 4 && (
              <Step4Categories
                onComplete={handleStep4Complete}
                onBack={() => handleBackToStep(3)}
                initialData={categories || undefined}
              />
            )}

            {currentStep === 5 && completeProjectData && (
              <Step5Preview
                projectData={completeProjectData}
                onBack={() => handleBackToStep(4)}
                onEdit={handleEditFromPreview}
                onProjectCreated={clearDraftAfterPublish}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
