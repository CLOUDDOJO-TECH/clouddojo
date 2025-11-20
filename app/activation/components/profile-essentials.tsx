"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Cloud } from "lucide-react";
import type { ProfileData, ExperienceLevel, CloudPlatform, UserRole } from "../types";
import { CERTIFICATIONS_BY_PLATFORM } from "../types";
import { cn } from "@/lib/utils";

interface ProfileEssentialsProps {
  onComplete: (profile: ProfileData) => void;
}

const EXPERIENCE_OPTIONS: { id: ExperienceLevel; title: string; desc: string }[] = [
  { id: "beginner", title: "Just Getting Started", desc: "New to cloud technologies" },
  { id: "intermediate", title: "Some Experience", desc: "Used cloud, want to certify" },
  { id: "advanced", title: "Experienced", desc: "Working with cloud daily" },
  { id: "expert", title: "Cloud Professional", desc: "Advanced certifications" },
];

const PLATFORM_OPTIONS: { id: CloudPlatform; name: string; color: string }[] = [
  { id: "AWS", name: "Amazon Web Services", color: "orange" },
  { id: "Azure", name: "Microsoft Azure", color: "blue" },
  { id: "GCP", name: "Google Cloud Platform", color: "green" },
  { id: "Kubernetes", name: "Kubernetes", color: "blue" },
  { id: "Terraform", name: "Terraform", color: "purple" },
  { id: "Docker", name: "Docker", color: "blue" },
];

const ROLE_OPTIONS: { id: UserRole; name: string }[] = [
  { id: "STUDENT", name: "Student" },
  { id: "DEVELOPER", name: "Developer" },
  { id: "DEVOPS", name: "DevOps Engineer" },
  { id: "CLOUD_ENGINEER", name: "Cloud Engineer" },
  { id: "ARCHITECT", name: "Solutions Architect" },
  { id: "OTHER", name: "Other" },
];

export function ProfileEssentials({ onComplete }: ProfileEssentialsProps) {
  const [experience, setExperience] = useState<ExperienceLevel | "">("");
  const [platform, setPlatform] = useState<CloudPlatform | "">("");
  const [certification, setCertification] = useState("");
  const [role, setRole] = useState<UserRole | "">("");

  const certifications = platform ? CERTIFICATIONS_BY_PLATFORM[platform] : [];

  const isValid = experience && platform && certification && role;

  const handleSubmit = () => {
    if (!isValid) return;

    onComplete({
      experience: experience as ExperienceLevel,
      platform: platform as CloudPlatform,
      certification,
      role: role as UserRole,
    });
  };

  return (
    <div className="space-y-8 rounded-2xl border border-border bg-background p-8">
      {/* Header */}
      <div className="space-y-2 text-center">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-emerald-500/10 p-3">
            <Cloud className="h-8 w-8 text-emerald-500" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground">Welcome to CloudDojo!</h1>
        <p className="text-lg text-foreground/60">Let's personalize your learning journey</p>
      </div>

      {/* Experience Level */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">What's your cloud experience?</label>
        <div className="grid gap-3">
          {EXPERIENCE_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => setExperience(option.id)}
              className={cn(
                "group relative flex items-start gap-3 rounded-lg border p-4 text-left transition-all",
                experience === option.id
                  ? "border-foreground bg-foreground/5"
                  : "border-border bg-background hover:border-foreground/40"
              )}
            >
              <div
                className={cn(
                  "mt-0.5 h-4 w-4 rounded-full border-2 transition-all",
                  experience === option.id
                    ? "border-foreground bg-foreground"
                    : "border-border group-hover:border-foreground/40"
                )}
              >
                {experience === option.id && (
                  <div className="h-full w-full rounded-full bg-background scale-[0.4]" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium text-foreground">{option.title}</div>
                <div className="text-sm text-foreground/60">{option.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Platform Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">
          Which platform are you focusing on?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {PLATFORM_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                setPlatform(option.id);
                setCertification(""); // Reset certification when platform changes
              }}
              className={cn(
                "rounded-lg border p-4 text-center transition-all",
                platform === option.id
                  ? "border-foreground bg-foreground/5"
                  : "border-border bg-background hover:border-foreground/40"
              )}
            >
              <div className="font-medium text-foreground">{option.id}</div>
              <div className="text-xs text-foreground/60 mt-1">{option.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Certification Selection */}
      {platform && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Which certification are you targeting?
          </label>
          <select
            value={certification}
            onChange={(e) => setCertification(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-foreground focus:outline-none"
          >
            <option value="">Select a certification...</option>
            {certifications.map((cert) => (
              <option key={cert.id} value={cert.id}>
                {cert.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Role Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">What's your current role?</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-foreground focus:outline-none"
        >
          <option value="">Select your role...</option>
          {ROLE_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>

      {/* Continue Button */}
      <Button
        onClick={handleSubmit}
        disabled={!isValid}
        className="w-full bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50"
        size="lg"
      >
        Continue to Diagnostic Quiz →
      </Button>
    </div>
  );
}
