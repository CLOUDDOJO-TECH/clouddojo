import React from "react";

export interface FeatureTab {
  id: string;
  label: string;
  icon: React.ElementType;
  iconColor: string; // Tailwind class for text/bg color
  iconBg: string;
}

export interface FeatureContent {
  id: string;
  title: string;
  description: string;
  description2?: string;
  buttonText: string;
  visualType: "tests" | "ai_feedback" | "projects" | "leaderboard"; // To toggle different visual mockups
}
