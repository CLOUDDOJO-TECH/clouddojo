import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, Circle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  stepNumber: number;
  title: string;
  stepType: string;
  isOptional: boolean;
  estimatedTime: number;
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
  const isStepCompleted = (stepNumber: number) => {
    return completedSteps.includes(stepNumber);
  };

  const isStepAccessible = (stepNumber: number) => {
    // First step is always accessible
    if (stepNumber === 1) return true;

    // A step is accessible if the previous step is completed or if it's the current step
    return isStepCompleted(stepNumber - 1) || stepNumber === currentStep;
  };

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="text-lg">Project Steps</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-1 p-4">
            {steps.map((step) => {
              const isCompleted = isStepCompleted(step.stepNumber);
              const isCurrent = step.stepNumber === currentStep;
              const isAccessible = isStepAccessible(step.stepNumber);

              return (
                <Button
                  key={step.id}
                  variant={isCurrent ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start text-left h-auto py-3 px-3",
                    !isAccessible && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={() => isAccessible && onStepSelect(step.stepNumber)}
                  disabled={!isAccessible}
                >
                  <div className="flex items-start gap-3 w-full">
                    <div className="flex-shrink-0 mt-0.5">
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : isAccessible ? (
                        <Circle className={cn(
                          "h-5 w-5",
                          isCurrent ? "text-primary" : "text-muted-foreground"
                        )} />
                      ) : (
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">
                          {step.stepNumber}. {step.title}
                        </span>
                        {step.isOptional && (
                          <Badge variant="outline" className="text-xs">
                            Optional
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {step.estimatedTime} mins
                      </div>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
