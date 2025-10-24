"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Circle, Play, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  stepNumber: number;
  title: string;
  description?: string;
  stepType: string;
  estimatedTime: number;
  isOptional: boolean;
}

interface StepNavigationProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
  onStepSelect: (stepNumber: number) => void;
}

export function StepNavigation({
  steps,
  currentStep,
  completedSteps,
  onStepSelect,
}: StepNavigationProps) {
  const getStepIcon = (step: Step) => {
    const isCompleted = completedSteps.includes(step.stepNumber);
    const isCurrent = step.stepNumber === currentStep;
    const isAccessible = step.stepNumber <= currentStep || isCompleted;

    if (isCompleted) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    
    if (isCurrent) {
      return <Play className="h-4 w-4 text-primary" />;
    }
    
    if (!isAccessible) {
      return <Lock className="h-4 w-4 text-muted-foreground" />;
    }
    
    return <Circle className="h-4 w-4 text-muted-foreground" />;
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

  return (
    <Card className="h-fit sticky top-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Project Steps</CardTitle>
        <div className="text-sm text-muted-foreground">
          {completedSteps.length} of {steps.length} completed
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="p-4 space-y-1">
            {steps.map((step, index) => {
              const isCompleted = completedSteps.includes(step.stepNumber);
              const isCurrent = step.stepNumber === currentStep;
              const isAccessible = step.stepNumber <= currentStep || isCompleted;
              const isPrevious = step.stepNumber < currentStep;

              return (
                <div key={step.id}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start p-3 h-auto text-left relative",
                      isCurrent && "bg-primary/10 text-primary hover:bg-primary/15",
                      isCompleted && !isCurrent && "text-muted-foreground hover:text-foreground",
                      !isAccessible && "opacity-50 cursor-not-allowed"
                    )}
                    onClick={() => isAccessible && onStepSelect(step.stepNumber)}
                    disabled={!isAccessible}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <div className="shrink-0 mt-0.5">
                        {getStepIcon(step)}
                      </div>
                      
                      <div className="flex-1 space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">
                            Step {step.stepNumber}
                          </span>
                          {step.isOptional && (
                            <Badge variant="outline" className="text-xs py-0 px-1">
                              Optional
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm font-medium line-clamp-2">
                          {step.title}
                        </p>
                        
                        {step.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {step.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-2 pt-1">
                          <Badge className={`${getStepTypeColor(step.stepType)} text-xs`}>
                            {step.stepType.toLowerCase()}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(step.estimatedTime)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Button>
                  
                  {index < steps.length - 1 && (
                    <div className="flex justify-center py-1">
                      <div 
                        className={cn(
                          "w-px h-4",
                          isPrevious || isCompleted 
                            ? "bg-green-300 dark:bg-green-700" 
                            : "bg-border"
                        )}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}