"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle2, Play } from 'lucide-react';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ProjectStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string | null;
  instructions: string;
  estimatedTime: number;
  expectedOutput: string | null;
  validationCriteria: string[];
  mediaUrls: string[];
  stepType: string;
  isOptional: boolean;
  isCompleted: boolean;
  isCurrent: boolean;
}

interface ProjectStepViewerProps {
  steps: ProjectStep[];
  projectTitle: string;
  onStepComplete?: (stepId: string, stepNumber: number) => void;
}

interface StepCardProps {
  step: ProjectStep;
  onComplete?: (stepId: string, stepNumber: number) => void;
}


const StepCard: React.FC<StepCardProps> = ({ step, onComplete }) => {
  const [isOpen, setIsOpen] = useState(step.isCurrent);

  const handleComplete = () => {
    if (onComplete) {
      onComplete(step.id, step.stepNumber);
    }
  };

  return (
    <div className="space-y-6 py-8">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="cursor-pointer space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {step.isCompleted ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : step.isCurrent ? (
                  <Play className="h-5 w-5 text-blue-500" />
                ) : (
                  <div className="h-6 w-6 rounded-full border-2 border-muted-foreground/30" />
                )}
                <h2 className="text-3xl font-bold">{step.title}</h2>
              </div>
              
              {step.isOptional && (
                <Badge variant="outline" className="text-xs">
                  Optional
                </Badge>
              )}
              
              {step.isCompleted && (
                <Badge className="bg-green-500 text-white">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Completed
                </Badge>
              )}
              
              {step.isCurrent && !step.isCompleted && (
                <Badge variant="secondary">
                  Current
                </Badge>
              )}
              
              <div className="ml-auto">
                {isOpen ? (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </div>

            {step.description && (
              <p className="text-lg text-muted-foreground">{step.description}</p>
            )}
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="space-y-6 mt-6">
            {/* Instructions */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🎯 What You Need to Do
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Here's your mission for this step. Take your time and read through everything carefully!
                </p>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <MarkdownRenderer content={step.instructions} />
                </div>
              </CardContent>
            </Card>


            {/* Media Resources */}
            {step.mediaUrls.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    📸 Visual Guides
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    Check out the following screenshots and videos to guide you through this step...
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    {step.mediaUrls.map((url, index) => (
                      <div key={index} className="relative w-full rounded-lg overflow-hidden border hover:shadow-md transition-shadow duration-200">
                        <img src={url} alt={`Step ${step.stepNumber} visual guide ${index + 1}`} className="w-full h-auto" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Button */}
            {!step.isCompleted && step.isCurrent && (
              <div className="flex items-center gap-3 pt-6 border-t border-gray-100">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-3">
                    🎉 Finished this step? Awesome! Mark it as complete to unlock the next challenge.
                  </p>
                  <Button 
                    onClick={handleComplete} 
                    size="lg"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    ✅ Mark as Complete
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

const StepDivider: React.FC<{ stepNumber: number }> = ({ stepNumber }) => (
  <div className="relative flex items-center my-12">
    <Separator className="flex-1" />
    <span className="px-4 text-sm font-medium text-muted-foreground bg-background">
      Step {stepNumber}
    </span>
    <Separator className="flex-1" />
  </div>
);

export const ProjectStepViewer: React.FC<ProjectStepViewerProps> = ({
  steps,
  projectTitle,
  onStepComplete,
}) => {
  return (
    <div className="space-y-0">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          {index > 0 && <StepDivider stepNumber={step.stepNumber} />}
          <StepCard 
            step={step} 
            onComplete={onStepComplete}
          />
        </React.Fragment>
      ))}
    </div>
  );
};