"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Step1FileUpload } from "./components/step-1-file-upload";
import { Step2QuizMetadata } from "./components/step-2-quiz-metadata";
import { Step3Preview } from "./components/step-3-preview";
import { ValidationResult, QuizMetadata } from "./validators";

type Step = 1 | 2 | 3;

// SVG Icons
const UploadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24px"
    height="24px"
    viewBox="0 0 18 18"
  >
    <path
      d="M15.75,8.5c-.414,0-.75-.336-.75-.75v-1.5c0-.689-.561-1.25-1.25-1.25h-5.386c-.228,0-.443-.104-.585-.281l-.603-.752c-.238-.297-.594-.467-.975-.467h-1.951c-.689,0-1.25,.561-1.25,1.25v3c0,.414-.336,.75-.75,.75s-.75-.336-.75-.75v-3c0-1.517,1.233-2.75,2.75-2.75h1.951c.838,0,1.62,.375,2.145,1.029l.378,.471h5.026c1.517,0,2.75,1.233,2.75,2.75v1.5c0,.414-.336,.75-.75,.75Z"
      fill="currentColor"
    />
    <path
      d="M17.082,7.879c-.43-.559-1.08-.879-1.785-.879H2.703c-.705,0-1.355,.32-1.785,.879-.429,.559-.571,1.27-.39,1.951l1.101,4.128c.32,1.202,1.413,2.042,2.657,2.042H13.713c1.244,0,2.337-.839,2.657-2.042l1.101-4.128c.182-.681,.04-1.392-.39-1.951Z"
      fill="currentColor"
    />
  </svg>
);

const MetadataIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24px"
    height="24px"
    viewBox="0 0 18 18"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.75 1.83956C10.6212 1.78103 10.4801 1.75 10.336 1.75H4.75C3.645 1.75 2.75 2.645 2.75 3.75V14.25C2.75 15.355 3.645 16.25 4.75 16.25H13.25C14.355 16.25 15.25 15.355 15.25 14.25V6.664C15.25 6.51978 15.2189 6.37883 15.1603 6.24999H11.75C11.198 6.24999 10.75 5.80199 10.75 5.24999V1.83956Z"
      fill="currentColor"
      fillOpacity="0.3"
    />
    <path
      d="M5.75 6.75H7.75"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M5.75 9.75H12.25"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M5.75 12.75H12.25"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M2.75 14.25V3.75C2.75 2.645 3.645 1.75 4.75 1.75H10.336C10.601 1.75 10.856 1.855 11.043 2.043L14.957 5.957C15.145 6.145 15.25 6.399 15.25 6.664V14.25C15.25 15.355 14.355 16.25 13.25 16.25H4.75C3.645 16.25 2.75 15.355 2.75 14.25Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M15.16 6.24999H11.75C11.198 6.24999 10.75 5.80199 10.75 5.24999V1.85199"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const PreviewIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24px"
    height="24px"
    viewBox="0 0 18 18"
  >
    <path
      d="M15.008,6.083l.881-1.441c.216-.354,.105-.815-.248-1.031-.354-.215-.815-.105-1.031,.248l-.907,1.482c-.678-.331-1.388-.588-2.124-.769l.333-1.655c.082-.406-.182-.802-.587-.883-.405-.078-.802,.181-.883,.587l-.339,1.685c-.364-.037-.732-.057-1.103-.057s-.739,.02-1.103,.057l-.339-1.685c-.082-.406-.48-.666-.883-.587-.406,.082-.669,.477-.587,.883l.333,1.655c-.736,.181-1.446,.438-2.124,.769l-.907-1.482c-.215-.353-.677-.463-1.031-.248-.353,.216-.464,.678-.248,1.031l.881,1.441c-.594,.402-1.154,.867-1.668,1.392-.29,.295-.285,.771,.011,1.061,.295,.29,.77,.285,1.061-.011,1.754-1.789,4.1-2.774,6.605-2.774s4.851,.985,6.605,2.774c.147,.15,.341,.225,.536,.225,.189,0,.379-.071,.525-.214,.296-.29,.301-.765,.011-1.061-.515-.525-1.074-.99-1.668-1.392Z"
      fill="currentColor"
    />
    <circle cx="9" cy="10.5" r="3.5" fill="currentColor" />
  </svg>
);

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24px"
    height="24px"
    viewBox="0 0 18 18"
  >
    <path
      d="M13.75 4.5H7.25C5.7334 4.5 4.5 5.7334 4.5 7.25V13.75C4.5 15.2666 5.7334 16.5 7.25 16.5H13.75C15.2666 16.5 16.5 15.2666 16.5 13.75V7.25C16.5 5.7334 15.2666 4.5 13.75 4.5ZM13.6016 8.70166L10.2051 13.2017C10.0772 13.3716 9.88281 13.4786 9.67191 13.4971C9.64941 13.4991 9.62801 13.5 9.60651 13.5C9.41701 13.5 9.23439 13.4287 9.09479 13.2988L7.48541 11.7988C7.18271 11.5161 7.1661 11.0414 7.4483 10.7386C7.7305 10.4339 8.20609 10.4198 8.50879 10.701L9.50879 11.6337L12.4043 7.79834C12.6533 7.46724 13.1221 7.40075 13.4551 7.65125C13.7852 7.90075 13.8516 8.37106 13.6016 8.70166Z"
      fill="currentColor"
    />
    <path
      d="M3.5664 3.5439L10.4902 2.5146C10.998 2.4399 11.4931 2.6786 11.7529 3.1263C11.9609 3.4847 12.4218 3.60638 12.7773 3.39888C13.1357 3.19088 13.2578 2.73189 13.0498 2.37349C12.4805 1.39109 11.3896 0.863703 10.2695 1.0312L3.3466 2.0605C2.62 2.1679 1.97839 2.55212 1.54089 3.14192C1.10439 3.73222 0.922694 4.4573 1.03019 5.1844L2.0077 11.7651C2.0634 12.1372 2.3837 12.4046 2.7489 12.4046C2.786 12.4046 2.8231 12.4022 2.8602 12.3963C3.2694 12.3358 3.5526 11.954 3.492 11.5443L2.51449 4.96419C2.46469 4.63309 2.5477 4.30358 2.7469 4.03548C2.9451 3.76738 3.2364 3.5927 3.5664 3.5439Z"
      fill="currentColor"
    />
  </svg>
);

export default function QuizUploadPage() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [quizMetadata, setQuizMetadata] = useState<QuizMetadata | null>(null);

  const handleFileValidationComplete = (
    result: ValidationResult,
    file: string,
  ) => {
    setValidationResult(result);
    setFileName(file);
    setCurrentStep(2);
  };

  const handleMetadataComplete = (metadata: QuizMetadata) => {
    setQuizMetadata(metadata);
    setCurrentStep(3);
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
  };

  const handleBackToStep2 = () => {
    setCurrentStep(2);
  };

  const steps = [
    {
      number: 1,
      title: "Upload File",
      icon: UploadIcon,
      description: "Upload JSON file",
    },
    {
      number: 2,
      title: "Quiz Details",
      icon: MetadataIcon,
      description: "Enter quiz information",
    },
    {
      number: 3,
      title: "Preview",
      icon: PreviewIcon,
      description: "Review and confirm",
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard/admin">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Upload Quiz</h1>
          <p className="text-muted-foreground mt-2">
            Upload a JSON file to create a new quiz with questions
          </p>
        </div>
      </div>

      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted -z-10">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
              }}
            />
          </div>

          {/* Steps */}
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;

            return (
              <div
                key={step.number}
                className="flex flex-col items-center flex-1"
              >
                <div
                  className={`
                    flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all
                    ${
                      isCompleted
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : isActive
                          ? "border-emerald-600 bg-background text-emerald-600"
                          : "border-muted bg-background text-muted-foreground"
                    }
                  `}
                >
                  {isCompleted ? <CheckIcon /> : <StepIcon />}
                </div>
                <div className="mt-2 text-center">
                  <p
                    className={`text-sm font-medium ${
                      isActive ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground hidden md:block">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div>
        {currentStep === 1 && (
          <Step1FileUpload
            onValidationComplete={handleFileValidationComplete}
          />
        )}

        {currentStep === 2 && (
          <Step2QuizMetadata
            onComplete={handleMetadataComplete}
            onBack={handleBackToStep1}
            initialData={quizMetadata || undefined}
            validationResult={validationResult || undefined}
          />
        )}

        {currentStep === 3 && validationResult && quizMetadata && (
          <Step3Preview
            metadata={quizMetadata}
            validationResult={validationResult}
            fileName={fileName}
            onBack={handleBackToStep2}
          />
        )}
      </div>
    </div>
  );
}
