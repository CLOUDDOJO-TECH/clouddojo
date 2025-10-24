"use client";

import { useTheme } from "next-themes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Monitor, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { ThemePreviewWrapper } from "./theme-previews";

const THEME_OPTIONS = [
  {
    value: "system" as const,
    label: "Auto",
    description: "Automatically match your device settings",
    icon: Monitor,
  },
  {
    value: "light" as const,
    label: "Light mode",
    description: "Clean and bright interface",
    icon: Sun,
  },
  {
    value: "dark" as const,
    label: "Dark mode",
    description: "Easy on the eyes in low light",
    icon: Moon,
  },
];

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Change how Untitled UI looks and feels in your browser.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Change how CloudDojo looks and feels in your browser.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-6 max-w-lg">
          {THEME_OPTIONS.map((option) => {
            const isSelected = theme === option.value;

            return (
              <div
                key={option.value}
                className="cursor-pointer group"
                onClick={() => setTheme(option.value)}
              >
                {/* Theme Preview */}
                <div
                  className={`
                  relative h-24 rounded-lg border-2 transition-all duration-200 overflow-hidden gap-6
                  ${
                    isSelected
                      ? "border-emerald-500"
                      : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                  }
                `}
                >
                  <ThemePreviewWrapper theme={option.value} />
                </div>

                {/* Theme Label */}
                <div className="mt-3 text-center">
                  <span
                    className={`
                    text-sm font-medium
                    ${isSelected ? "text-emerald-600 dark:text-emerald-400" : "text-gray-700 dark:text-gray-300"}
                  `}
                  >
                    {option.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            Your theme preference will be saved and applied across all your
            sessions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
