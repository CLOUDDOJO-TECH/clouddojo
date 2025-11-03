"use client";

import { useState } from "react";
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
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Step1BasicInfo } from "../../create/components/step-1-basic-info";
import { Step2Content } from "../../create/components/step-2-content";
import { Step3Steps } from "../../create/components/step-3-steps";
import { Step4Categories } from "../../create/components/step-4-categories";
import { Step5Preview } from "./step-5-preview-edit";
import {
  ProjectBasicInfo,
  ProjectContent,
  ProjectSteps,
  ProjectCategories,
  CompleteProject,
} from "../../create/validators";
import { toast } from "sonner";

type Step = 1 | 2 | 3 | 4 | 5;

// SVG Icons for Stepper
const BasicInfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="24px"
    height="24px"
    viewBox="0 0 18 18"
  >
    <path
      d="M14.3662 9.80569L8.57321 4.0127C8.24311 3.6821 7.80371 3.5 7.33591 3.5H2.75C1.7852 3.5 1 4.2852 1 5.25V9.83591C1 10.3032 1.1816 10.7426 1.5127 11.0732L7.30569 16.8662C7.84179 17.4023 8.5459 17.6699 9.25 17.6699C9.9541 17.6699 10.6582 17.4018 11.1943 16.8662L14.3662 13.6943C14.8857 13.1753 15.1719 12.4848 15.1719 11.75C15.1719 11.0152 14.8858 10.3247 14.3662 9.80569Z"
      fill="currentColor"
      fillOpacity="0.4"
    />
    <path
      d="M10.0732 1.0127L15.8662 6.80569C16.3858 7.32469 16.6718 8.0152 16.6718 8.75C16.6718 9.4848 16.3856 10.1753 15.8661 10.6943L15.1511 11.4093C15.0768 10.8036 14.8046 10.2436 14.3662 9.80569L8.57321 4.0127C8.24311 3.6821 7.80371 3.5 7.33591 3.5H2.75C2.66514 3.5 2.58167 3.50607 2.5 3.51781V2.25C2.5 1.2852 3.2852 0.5 4.25 0.5H8.83591C9.30371 0.5 9.74311 0.682095 10.0732 1.0127Z"
      fill="currentColor"
    />
    <path
      d="M4 7.75C4 8.4404 4.5596 9 5.25 9C5.9404 9 6.5 8.4404 6.5 7.75C6.5 7.0596 5.9404 6.5 5.25 6.5C4.5596 6.5 4 7.0596 4 7.75Z"
      fill="currentColor"
    />
  </svg>
);

const ContentIcon = () => (
  <svg
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="none">
      <path
        d="M13.5033 4.10546C13.9972 3.8588 14.5972 4.05905 14.8441 4.55272C15.091 5.04677 14.8909 5.64767 14.3969 5.89452C9.24346 8.46948 6.54931 13.3573 5.67226 15.3955C4.5161 18.0824 4.09554 20.3858 4.00429 21.1426C3.93821 21.6909 3.43932 22.0827 2.89101 22.0166C2.34291 21.9503 1.9519 21.4515 2.01796 20.9033C2.12901 19.9821 2.59392 17.4894 3.83534 14.6045C4.79115 12.3833 7.7347 6.98775 13.5033 4.10546Z"
        fill="currentColor"
      />
      <path
        d="M21.996 2.97831C21.9443 2.38904 21.4169 1.95015 20.8353 2.00456C10.3866 2.9187 5.66294 10.0172 3.57739 15.2239C3.38207 15.7115 3.61863 16.2586 4.09897 16.4711L5.18087 16.9499C6.32808 17.459 7.45527 17.6848 7.52185 17.6962C8.74173 17.919 9.86938 18.031 10.9036 18.031C13.0562 18.031 14.8029 17.5472 16.1171 16.5872C16.6465 16.2 17.5038 15.4252 18.1023 14.1039C14.0582 14.8651 13.0046 11.9807 13.0046 11.9807C16.1248 12.7703 19.6729 13.0131 20.6233 9.36491C20.8218 8.49059 20.9483 7.64435 21.0697 6.82729L21.0738 6.79966C21.2651 5.52313 21.4453 4.32071 21.8551 3.6047C21.961 3.42108 22.0159 3.20542 21.996 2.97831Z"
        fill="currentColor"
        opacity="0.3"
      />
    </g>
  </svg>
);

const StepsIcon = () => (
  <svg
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="none">
      <path
        d="M1.65652 10.323C1.07671 8.15917 0.786803 7.07723 0.986463 6.1379C1.16209 5.31164 1.59478 4.56219 2.22253 3.99697C2.93618 3.35439 4.01812 3.06449 6.182 2.48468L9.27296 1.65646C11.4368 1.07665 12.5188 0.786742 13.4581 0.986402C14.2844 1.16203 15.0338 1.59472 15.599 2.22247C16.2416 2.93612 16.5315 4.01806 17.1113 6.18194L17.9396 9.2729C18.5194 11.4368 18.8093 12.5187 18.6096 13.458C18.434 14.2843 18.0013 15.0338 17.3735 15.599C16.6599 16.2416 15.5779 16.5315 13.4141 17.1113L10.3231 17.9395C8.15923 18.5193 7.07729 18.8092 6.13796 18.6095C5.3117 18.4339 4.56225 18.0012 3.99703 17.3735C3.35445 16.6598 3.06455 15.5779 2.48474 13.414L1.65652 10.323Z"
        fill="currentColor"
      />
      <path
        d="M6.5 12.9C6.5 10.6598 6.5 9.53969 6.93597 8.68404C7.31947 7.93139 7.93139 7.31947 8.68404 6.93597C9.53969 6.5 10.6598 6.5 12.9 6.5H16.1C18.3402 6.5 19.4603 6.5 20.316 6.93597C21.0686 7.31947 21.6805 7.93139 22.064 8.68404C22.5 9.53969 22.5 10.6598 22.5 12.9V16.1C22.5 18.3402 22.5 19.4603 22.064 20.316C21.6805 21.0686 21.0686 21.6805 20.316 22.064C19.4603 22.5 18.3402 22.5 16.1 22.5H12.9C10.6598 22.5 9.53969 22.5 8.68404 22.064C7.93139 21.6805 7.31947 21.0686 6.93597 20.316C6.5 19.4603 6.5 18.3402 6.5 16.1V12.9Z"
        fill="currentColor"
        opacity="0.3"
      />
    </g>
  </svg>
);

const CategoriesIcon = () => (
  <svg
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="none">
      <path
        d="M6 13C8.20914 13 10 14.7909 10 17C10 19.2091 8.20914 21 6 21C3.79086 21 2 19.2091 2 17C2 14.7909 3.79086 13 6 13ZM6 3C8.20914 3 10 4.79086 10 7C10 9.20914 8.20914 11 6 11C3.79086 11 2 9.20914 2 7C2 4.79086 3.79086 3 6 3ZM6 5.5C5.17157 5.5 4.5 6.17157 4.5 7C4.5 7.82843 5.17157 8.5 6 8.5C6.82843 8.5 7.5 7.82843 7.5 7C7.5 6.17157 6.82843 5.5 6 5.5Z"
        fill="currentColor"
        opacity="0.3"
      />
      <path
        d="M21 16C21.5523 16 22 16.4477 22 17C22 17.5523 21.5523 18 21 18H13C12.4477 18 12 17.5523 12 17C12 16.4477 12.4477 16 13 16H21ZM6 5C7.10457 5 8 5.89543 8 7C8 8.10457 7.10457 9 6 9C4.89543 9 4 8.10457 4 7C4 5.89543 4.89543 5 6 5ZM21 6C21.5523 6 22 6.44772 22 7C22 7.55228 21.5523 8 21 8H13C12.4477 8 12 7.55228 12 7C12 6.44772 12.4477 6 13 6H21Z"
        fill="currentColor"
      />
    </g>
  </svg>
);

const PreviewIcon = () => (
  <svg
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="none">
      <path
        d="M12.0002 2C12.5523 2.00023 13.0002 2.44786 13.0002 3V6.5918C14.0225 6.77965 14.9463 7.24883 15.6868 7.91797C15.7029 7.89542 15.7202 7.87308 15.7385 7.85156L18.6038 4.48438C18.9617 4.06395 19.5934 4.01325 20.0139 4.37109C20.4341 4.72898 20.4848 5.35977 20.1272 5.78027L17.262 9.14844C17.1507 9.27911 17.0121 9.37262 16.8625 9.43066C17.2687 10.1977 17.5002 11.0716 17.5002 12C17.5002 15.0375 15.0377 17.4999 12.0002 17.5C8.96268 17.5 6.50024 15.0376 6.50024 12C6.50024 11.0719 6.73006 10.1975 7.13599 9.43066C6.98683 9.3725 6.84954 9.27798 6.73853 9.14746L3.87622 5.78027L4.63794 5.13281L5.39966 4.48438L8.26196 7.85254L8.31274 7.91895C9.0534 7.24933 9.97745 6.77967 11.0002 6.5918V3C11.0002 2.44778 11.448 2.0001 12.0002 2ZM3.99048 4.37012C4.41115 4.01308 5.04208 4.06412 5.39966 4.48438L3.87622 5.78027C3.51852 5.35948 3.56968 4.72782 3.99048 4.37012Z"
        fill="currentColor"
      />
      <path
        d="M12 5C17.6086 5.00005 21.293 9.15621 22.6885 11.0635C23.1038 11.6311 23.1038 12.3689 22.6885 12.9365C21.293 14.8438 17.6086 18.9999 12 19C6.39144 19 2.70698 14.8438 1.31152 12.9365C0.896209 12.3689 0.896209 11.6311 1.31152 11.0635C2.70698 9.15618 6.39144 5.00002 12 5ZM12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 9.79089 14.2091 8.00004 12 8Z"
        fill="currentColor"
        opacity="0.3"
      />
    </g>
  </svg>
);

const CheckIconCustom = () => (
  <svg
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="none" className="nc-icon-wrapper">
      <path
        d="M16.586 7.08579C17.367 6.30474 18.6331 6.30474 19.4141 7.08579C20.1951 7.86684 20.1951 9.13289 19.4141 9.91391L11.9141 17.4139C11.1331 18.1949 9.86705 18.1949 9.086 17.4139L5.086 13.4139C4.30495 12.6329 4.30495 11.3668 5.086 10.5858C5.86705 9.80474 7.13308 9.80474 7.91412 10.5858L10.5001 13.1717L16.586 7.08579Z"
        fill="currentColor"
      />
      <path
        d="M12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1ZM12 1.75C6.33908 1.75 1.75 6.33908 1.75 12C1.75 17.6609 6.33908 22.25 12 22.25C17.6609 22.25 22.25 17.6609 22.25 12C22.25 6.33908 17.6609 1.75 12 1.75Z"
        fill="currentColor"
        opacity="0.3"
      />
    </g>
  </svg>
);

interface EditProjectClientProps {
  project: any; // We'll type this properly based on the Prisma schema
}

export default function EditProjectClient({ project }: EditProjectClientProps) {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  // Initialize state with existing project data
  const [basicInfo, setBasicInfo] = useState<ProjectBasicInfo>({
    title: project.title,
    description: project.description,
    projectType: project.projectType,
    difficulty: project.difficulty,
    estimatedTime: project.estimatedTime,
    estimatedCost: project.estimatedCost,
    isPremium: project.isPremium,
  });

  const [content, setContent] = useState<ProjectContent>({
    prerequisites: project.prerequisites || [],
    learningObjectives: project.learningObjectives || [],
  });

  const [steps, setSteps] = useState<ProjectSteps>({
    steps: project.steps.map((step: any) => ({
      title: step.title,
      description: step.description,
      order: step.order,
    })),
  });

  const [categories, setCategories] = useState<ProjectCategories>({
    categoryIds: project.projectCategoryAssignments.map(
      (assignment: any) => assignment.categoryId,
    ),
  });

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
      description: "Review & update",
    },
  ];

  // Build complete project data for preview
  const completeProjectData: CompleteProject = {
    ...basicInfo,
    ...content,
    ...steps,
    ...categories,
  };

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar Stepper - Sticky */}
      <div
        className={`
          shrink-0 overflow-y-auto transition-all duration-300
          ${isSidebarCollapsed ? "w-20" : ""}
        `}
      >
        <div className="p-6 sticky top-0 z-10 flex items-center justify-start">
          {/* Collapse Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="h-8 w-8"
          >
            {isSidebarCollapsed ? (
              <svg
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="rotate-180"
              >
                <g fill="none">
                  <path
                    d="M22 12.0002C22 12.5525 21.5523 13.0002 21 13.0002H16V15.6389C16 17.8639 13.4953 19.1674 11.6728 17.8919L6.4746 14.2532C4.91109 13.1584 4.91094 10.8421 6.4746 9.74732L11.6728 6.10865C13.4952 4.83324 15.9999 6.13666 16 8.36158V11.0002H21C21.5523 11.0002 22 11.448 22 12.0002Z"
                    fill="currentColor"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12ZM15 15.6387C15 17.0545 13.406 17.8842 12.2461 17.0723L7.04785 13.4336C6.05282 12.7369 6.05286 11.2631 7.04785 10.5664L12.2461 6.92773C13.406 6.11583 15 6.94554 15 8.36133V15.6387Z"
                    fill="currentColor"
                    opacity="0.3"
                  />
                </g>
              </svg>
            ) : (
              <svg
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g fill="none">
                  <path
                    d="M22 12.0002C22 12.5525 21.5523 13.0002 21 13.0002H16V15.6389C16 17.8639 13.4953 19.1674 11.6728 17.8919L6.4746 14.2532C4.91109 13.1584 4.91094 10.8421 6.4746 9.74732L11.6728 6.10865C13.4952 4.83324 15.9999 6.13666 16 8.36158V11.0002H21C21.5523 11.0002 22 11.448 22 12.0002Z"
                    fill="currentColor"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12ZM15 15.6387C15 17.0545 13.406 17.8842 12.2461 17.0723L7.04785 13.4336C6.05282 12.7369 6.05286 11.2631 7.04785 10.5664L12.2461 6.92773C13.406 6.11583 15 6.94554 15 8.36133V15.6387Z"
                    fill="currentColor"
                    opacity="0.3"
                  />
                </g>
              </svg>
            )}
          </Button>
        </div>

        <div className={`pt-8 ${isSidebarCollapsed ? "px-3" : "p-6"}`}>
          <div className="w-full">
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
                        flex items-center justify-center w-12 h-12 rounded-lg transition-all z-10 shrink-0
                        ${
                          isCompleted
                            ? "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400"
                            : isActive
                              ? "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400"
                              : "bg-muted/50 text-muted-foreground"
                        }
                      `}
                    >
                      <StepIcon />
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
              initialData={basicInfo}
            />
          )}

          {currentStep === 2 && (
            <Step2Content
              onComplete={handleStep2Complete}
              onBack={() => handleBackToStep(1)}
              initialData={content}
            />
          )}

          {currentStep === 3 && (
            <Step3Steps
              onComplete={handleStep3Complete}
              onBack={() => handleBackToStep(2)}
              initialData={steps}
            />
          )}

          {currentStep === 4 && (
            <Step4Categories
              onComplete={handleStep4Complete}
              onBack={() => handleBackToStep(3)}
              initialData={categories}
            />
          )}

          {currentStep === 5 && (
            <Step5Preview
              projectData={completeProjectData}
              projectId={project.id}
              onBack={() => handleBackToStep(4)}
              onEdit={handleEditFromPreview}
            />
          )}
        </div>
      </div>
    </div>
  );
}
