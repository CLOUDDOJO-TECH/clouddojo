import { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { z } from "zod";

export const onboardingDataSchema = z.object({
  experience: z.string(),
  platforms: z.array(z.string()).optional().default([]),
  certifications: z.array(z.string()).optional().default([]),
  role: z.string(),
  focusArea: z.array(z.string()).optional().default([]),
});

export type OnboardingData = z.infer<typeof onboardingDataSchema>;

export interface StepOption {
  id: string;
  title: string;
  desc: string;
  color?: string;
  icon?: LucideIcon;
}

export interface OnboardingStep {
  id: number;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  type: "single" | "multiple";
  category: keyof OnboardingData;
  options: StepOption[];
}
