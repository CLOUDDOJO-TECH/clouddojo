"use client";

import { Cloud, Container, Server, Box } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Provider {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  popular?: boolean;
}

export const PROVIDERS: Provider[] = [
  {
    id: "AWS",
    name: "AWS",
    icon: <Cloud className="h-6 w-6" />,
    description: "Amazon Web Services certifications",
    popular: true,
  },
  {
    id: "Azure",
    name: "Azure",
    icon: <Cloud className="h-6 w-6" />,
    description: "Microsoft Azure certifications",
    popular: true,
  },
  {
    id: "GCP",
    name: "Google Cloud",
    icon: <Cloud className="h-6 w-6" />,
    description: "Google Cloud Platform certifications",
  },
  {
    id: "Kubernetes",
    name: "Kubernetes",
    icon: <Container className="h-6 w-6" />,
    description: "Kubernetes certifications (CKA, CKAD)",
  },
  {
    id: "Terraform",
    name: "Terraform",
    icon: <Box className="h-6 w-6" />,
    description: "HashiCorp Terraform Associate",
  },
  {
    id: "Docker",
    name: "Docker",
    icon: <Server className="h-6 w-6" />,
    description: "Docker Certified Associate",
  },
];

interface ProviderSelectorProps {
  selectedProvider: string;
  onProviderChange: (provider: string) => void;
  disabled?: boolean;
}

export function ProviderSelector({
  selectedProvider,
  onProviderChange,
  disabled = false,
}: ProviderSelectorProps) {
  return (
    <div className="w-full">
      <h2 className="mb-4 text-center text-2xl font-bold text-gray-900 dark:text-white">
        Choose Your Certification Path
      </h2>
      <p className="mb-6 text-center text-gray-600 dark:text-gray-400">
        Select a platform to try sample practice questions
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PROVIDERS.map((provider) => (
          <button
            key={provider.id}
            onClick={() => onProviderChange(provider.id)}
            disabled={disabled}
            className={cn(
              "relative flex flex-col items-start gap-3 rounded-xl border-2 p-6 text-left transition-all",
              "hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50",
              selectedProvider === provider.id
                ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950"
                : "border-gray-200 bg-white hover:border-blue-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600"
            )}
          >
            {provider.popular && (
              <span className="absolute -top-2 right-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-3 py-1 text-xs font-semibold text-white">
                Popular
              </span>
            )}

            <div
              className={cn(
                "rounded-lg p-3",
                selectedProvider === provider.id
                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
              )}
            >
              {provider.icon}
            </div>

            <div className="flex-1">
              <h3
                className={cn(
                  "text-lg font-semibold",
                  selectedProvider === provider.id
                    ? "text-blue-700 dark:text-blue-300"
                    : "text-gray-900 dark:text-white"
                )}
              >
                {provider.name}
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {provider.description}
              </p>
            </div>

            {selectedProvider === provider.id && (
              <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500">
                <svg
                  className="h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
