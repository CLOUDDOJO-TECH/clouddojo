import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Clock, CheckCircle2, Lightbulb, ChevronDown } from "lucide-react";

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
    hints?: string[];
  };
  guidanceMode: string;
  onHintUsed?: () => void;
  onComplete?: () => void;
  onNext?: () => void;
  isCompleted?: boolean;
}

export function StepContent({
  step,
  guidanceMode,
  onHintUsed,
  onComplete,
  onNext,
  isCompleted,
}: StepContentProps) {
  const [revealedHints, setRevealedHints] = useState<number[]>([]);

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} mins`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const handleRevealHint = (index: number) => {
    if (!revealedHints.includes(index)) {
      setRevealedHints([...revealedHints, index]);
      onHintUsed?.();
    }
  };

  const shouldShowHints =
    guidanceMode === "SOME_GUIDANCE" || guidanceMode === "STEP_BY_STEP";
  const hints = step.hints || [];

  return (
    <div className="space-y-6">
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

      {/* Hints Section - Only show based on guidance mode */}
      {shouldShowHints && hints.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Hints Available ({hints.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {hints.map((hint, index) => (
              <Collapsible key={index}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => handleRevealHint(index)}
                  >
                    <span className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Hint {index + 1}
                      {revealedHints.includes(index) && (
                        <Badge variant="secondary" className="text-xs">
                          Revealed
                        </Badge>
                      )}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 p-4 rounded-lg bg-muted">
                  <p className="text-sm">{hint}</p>
                </CollapsibleContent>
              </Collapsible>
            ))}
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
    </div>
  );
}
