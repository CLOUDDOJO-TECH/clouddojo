import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2 } from "lucide-react";

interface StepContentProps {
  step: {
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
  };
  onComplete?: () => void;
  onNext?: () => void;
  isCompleted?: boolean;
}

export function StepContent({
  step,
  onComplete,
  onNext,
  isCompleted,
}: StepContentProps) {
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} mins`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className="space-y-6 py-8">
      {/* Step Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-bold">{step.title}</h2>
          {step.isOptional && (
            <Badge variant="outline" className="text-xs">
              Optional
            </Badge>
          )}
          {isCompleted && (
            <Badge className="bg-emerald-500 text-white">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Completed
            </Badge>
          )}
        </div>

        {step.description && (
          <p className="text-md text-muted-foreground">{step.description}</p>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{formatTime(step.estimatedTime)}</span>
        </div>
      </div>

      {/* Instructions Card */}
      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap">{step.instructions}</p>
          </div>
        </CardContent>
      </Card>

      {/* Expected Output */}
      {step.expectedOutput && (
        <Card>
          <CardHeader>
            <CardTitle>Expected Output</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap">{step.expectedOutput}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Criteria */}
      {step.validationCriteria.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Validation Criteria</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {step.validationCriteria.map((criteria, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <span className="text-sm">{criteria}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Media */}
      {step.mediaUrls.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              {step.mediaUrls.map((url, index) => (
                <div
                  key={index}
                  className="relative w-full rounded-lg overflow-hidden border"
                >
                  <img
                    src={url}
                    alt={`Step ${step.stepNumber} resource ${index + 1}`}
                    className="w-full h-auto"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-4">
        {!isCompleted && onComplete && (
          <Button onClick={onComplete} size="lg">
            Mark as Complete
          </Button>
        )}
        {isCompleted && onNext && (
          <Button onClick={onNext} size="lg">
            Next Step
          </Button>
        )}
      </div>
    </div>
  );
}
