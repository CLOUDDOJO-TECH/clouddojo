import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Achievement {
  id: string;
  title: string;
  description: string;
  type: string;
  icon?: string;
}

interface AchievementToastProps {
  achievement: Achievement;
  onClose: () => void;
  duration?: number;
}

export function AchievementToast({
  achievement,
  onClose,
  duration = 5000,
}: AchievementToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in animation
    setTimeout(() => setIsVisible(true), 100);

    // Auto-close after duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 transition-all duration-300 transform",
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}
    >
      <Card className="w-96 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950 border-amber-200 dark:border-amber-800 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-amber-500 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-white" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-amber-900 dark:text-amber-100">
                  Achievement Unlocked!
                </h4>
                <Badge
                  variant="outline"
                  className="text-xs bg-amber-100 dark:bg-amber-900 border-amber-300 dark:border-amber-700"
                >
                  {achievement.type}
                </Badge>
              </div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                {achievement.title}
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                {achievement.description}
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-amber-700 hover:text-amber-900 dark:text-amber-300 dark:hover:text-amber-100"
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
