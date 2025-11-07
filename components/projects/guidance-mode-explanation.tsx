"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Zap } from 'lucide-react';

interface GuidanceModeExplanationProps {
  mode: string;
}

export const GuidanceModeExplanation: React.FC<GuidanceModeExplanationProps> = ({ mode }) => {
  const getExplanation = () => {
    switch (mode) {
      case 'NO_GUIDANCE':
        return {
          title: "😱 No Guidance Project",
          subtitle: "Welcome to the hardest version of this project. We'll give you the overall objective of each step and the rest is up to you!",
          note: "To keep this No Guidance project truly hands-off, you won't find tasks or documentation here! If you'd like to generate documentation, please use the Some Guidance or Step-by-Step Guidance versions of this project.",
          tip: "💡 If you're EVER stuck - ask the NextWork community. Students like you are already asking questions about this project.",
          bgColor: "bg-red-50 border-red-200",
          noteIcon: "🚨"
        };
      
      case 'SOME_GUIDANCE':
        return {
          title: "😊 Some Guidance Project",
          subtitle: "Perfect balance of learning and support! We'll provide helpful hints, resources, and checkpoints along the way while still challenging you to think independently.",
          note: "You'll get curated resources, helpful tips, and validation criteria to keep you on track. This mode is ideal for building confidence while learning.",
          tip: "🎯 Pro tip: Try to solve each step first before looking at the hints - you'll learn more that way!",
          bgColor: "bg-blue-50 border-blue-200",
          noteIcon: "💡"
        };
      
      case 'STEP_BY_STEP':
        return {
          title: "🤗 Step-by-Step Guidance",
          subtitle: "Maximum support for maximum learning! Every step is broken down with detailed instructions, examples, and explanations.",
          note: "This mode includes detailed walkthroughs, code examples, troubleshooting tips, and comprehensive documentation. Perfect for beginners or complex topics.",
          tip: "📚 Take your time to understand each concept - the detailed explanations will help you master the fundamentals!",
          bgColor: "bg-green-50 border-green-200",
          noteIcon: "✨"
        };
      
      default:
        return null;
    }
  };

  const explanation = getExplanation();
  
  if (!explanation) return null;

  return (
    <div className="space-y-6 py-8">
      <Card className={`${explanation.bgColor} border-2`}>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">{explanation.title}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {explanation.subtitle}
              </p>
            </div>
            
            <Alert className="border-0 bg-white/60">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>{explanation.noteIcon} NOTE:</strong> {explanation.note}
              </AlertDescription>
            </Alert>
            
            <div className="flex items-start gap-3 p-4 bg-white/60 rounded-lg">
              <Zap className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">
                {explanation.tip}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};