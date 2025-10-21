"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, X, Star, Zap, Target, Clock, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface Achievement {
  id: string;
  type: string;
  title: string;
  description: string;
  iconUrl?: string;
  earnedAt: string;
}

interface AchievementToastProps {
  achievement: Achievement;
  onClose: () => void;
}

export function AchievementToast({ achievement, onClose }: AchievementToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRemove, setShouldRemove] = useState(false);

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 100);
    
    // Auto close after 5 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setShouldRemove(true);
      onClose();
    }, 300);
  };

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case "FIRST_PROJECT":
        return <Star className="h-6 w-6 text-yellow-500" />;
      case "SPEED_COMPLETION":
        return <Zap className="h-6 w-6 text-blue-500" />;
      case "PERFECT_SCORE":
        return <Trophy className="h-6 w-6 text-gold-500" />;
      case "DOCUMENTATION_MASTER":
        return <Target className="h-6 w-6 text-green-500" />;
      case "STREAK":
        return <Clock className="h-6 w-6 text-orange-500" />;
      default:
        return <Award className="h-6 w-6 text-purple-500" />;
    }
  };

  const getAchievementColor = (type: string) => {
    switch (type) {
      case "FIRST_PROJECT":
        return "from-yellow-500/20 to-yellow-600/20 border-yellow-500/30";
      case "SPEED_COMPLETION":
        return "from-blue-500/20 to-blue-600/20 border-blue-500/30";
      case "PERFECT_SCORE":
        return "from-amber-500/20 to-amber-600/20 border-amber-500/30";
      case "DOCUMENTATION_MASTER":
        return "from-green-500/20 to-green-600/20 border-green-500/30";
      case "STREAK":
        return "from-orange-500/20 to-orange-600/20 border-orange-500/30";
      default:
        return "from-purple-500/20 to-purple-600/20 border-purple-500/30";
    }
  };

  if (shouldRemove) return null;

  return (
    <div
      className={cn(
        "fixed top-20 right-6 z-50 transition-all duration-300 ease-out",
        isVisible 
          ? "translate-x-0 opacity-100 scale-100" 
          : "translate-x-full opacity-0 scale-95"
      )}
    >
      <Card className={cn(
        "w-80 bg-gradient-to-r border shadow-xl animate-pulse-glow",
        getAchievementColor(achievement.type)
      )}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-background/80 rounded-full">
              {getAchievementIcon(achievement.type)}
            </div>
            
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs font-medium">
                  🎉 Achievement Unlocked!
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-background/20"
                  onClick={handleClose}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              
              <h4 className="font-semibold text-sm leading-tight">
                {achievement.title}
              </h4>
              
              <p className="text-xs text-muted-foreground">
                {achievement.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}