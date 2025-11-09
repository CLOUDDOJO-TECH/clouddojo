"use client";

import { ChevronRight } from "lucide-react";
import { StepOption } from "../../types/onboarding";

interface SelectionButtonProps {
  option: StepOption;
  isSelected: boolean;
  onClick: () => void;
}

export function SelectionButton({
  option,
  isSelected,
  onClick,
}: SelectionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 group ${
        isSelected
          ? "bg-emerald-500/20 border-2 border-emerald-500/50 dark:border-emerald-500/30 shadow-sm"
          : "bg-gray-50/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20"
      }`}
    >
      <div className="text-left">
        <h4 className="text-gray-900 dark:text-white font-medium">
          {option.title}
        </h4>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {option.desc}
        </p>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-white transition-colors duration-300" />
    </button>
  );
}
