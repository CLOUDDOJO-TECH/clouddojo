"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  Target,
  CheckCircle,
  HelpCircle,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Step {
  id: string;
  stepNumber: number;
  title: string;
  description?: string;
  instructions: string;
  expectedOutput?: string;
  validationCriteria: string[];
  mediaUrls: string[];
  estimatedTime: number;
  stepType: string;
  isOptional: boolean;
}

interface StepContentProps {
  step: Step;
  guidanceMode: string;
  onHintUsed?: () => void;
}

export function StepContent({ step, guidanceMode, onHintUsed }: StepContentProps) {
  const [showHints, setShowHints] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [showExpectedOutput, setShowExpectedOutput] = useState(false);

  const getStepTypeIcon = (type: string) => {
    switch (type) {
      case "REFLECTION":
        return <Target className="h-5 w-5 text-blue-500" />;
      case "INSTRUCTION":
        return <FileText className="h-5 w-5 text-green-500" />;
      case "VALIDATION":
        return <CheckCircle className="h-5 w-5 text-orange-500" />;
      case "QUIZ":
        return <HelpCircle className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStepTypeColor = (type: string) => {
    switch (type) {
      case "REFLECTION":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "INSTRUCTION":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "VALIDATION":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      case "QUIZ":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes === 0 ? `${hours}h` : `${hours}h ${remainingMinutes}m`;
  };

  // Filter content based on guidance mode
  const getFilteredInstructions = (instructions: string) => {
    switch (guidanceMode) {
      case "INDEPENDENT":
        // Remove detailed hints and step-by-step instructions
        return instructions
          .replace(/\[HINT\].*?\[\/HINT\]/gs, '')
          .replace(/\[DETAILED\].*?\[\/DETAILED\]/gs, '');
      case "SOME_GUIDANCE":
        // Keep hints but remove detailed instructions
        return instructions.replace(/\[DETAILED\].*?\[\/DETAILED\]/gs, '');
      case "STEP_BY_STEP":
        // Show everything
        return instructions;
      default:
        return instructions;
    }
  };

  const handleHintClick = () => {
    setShowHints(!showHints);
    if (!showHints && onHintUsed) {
      onHintUsed();
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                {getStepTypeIcon(step.stepType)}
                <div>
                  <h1 className="text-2xl font-bold">
                    Step {step.stepNumber}: {step.title}
                  </h1>
                  {step.description && (
                    <p className="text-muted-foreground mt-1">{step.description}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge className={getStepTypeColor(step.stepType)}>
                {step.stepType.toLowerCase()}
              </Badge>
              {step.isOptional && (
                <Badge variant="outline">Optional</Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Estimated time: {formatTime(step.estimatedTime)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              <span>Guidance: {guidanceMode.toLowerCase().replace('_', ' ')}</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {getFilteredInstructions(step.instructions)}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      {/* Media */}
      {step.mediaUrls.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Media Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {step.mediaUrls.map((url, index) => (
                <div key={index} className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Media Resource {index + 1}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Help Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Hints (only show for some guidance and step-by-step) */}
        {(guidanceMode === "SOME_GUIDANCE" || guidanceMode === "STEP_BY_STEP") && (
          <Card>
            <Collapsible open={showHints} onOpenChange={setShowHints}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-4 h-auto"
                  onClick={handleHintClick}
                >
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">Need a hint?</span>
                  </div>
                  {showHints ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-4 pb-4">
                  <Separator className="mb-4" />
                  <div className="text-sm text-muted-foreground">
                    <p>💡 Try breaking this step into smaller parts</p>
                    <p>💡 Check the documentation for the tools you're using</p>
                    <p>💡 Don't forget to save your work regularly</p>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        )}

        {/* Expected Output */}
        {step.expectedOutput && (
          <Card>
            <Collapsible open={showExpectedOutput} onOpenChange={setShowExpectedOutput}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-4 h-auto"
                >
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Expected Output</span>
                  </div>
                  {showExpectedOutput ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-4 pb-4">
                  <Separator className="mb-4" />
                  <div className="text-sm">
                    <p>{step.expectedOutput}</p>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        )}
      </div>

      {/* Validation Criteria */}
      {step.validationCriteria.length > 0 && (
        <Card>
          <Collapsible open={showValidation} onOpenChange={setShowValidation}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between p-4 h-auto"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Success Criteria</span>
                </div>
                {showValidation ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-4 pb-4">
                <Separator className="mb-4" />
                <ul className="space-y-2">
                  {step.validationCriteria.map((criteria, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>{criteria}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      )}
    </div>
  );
}