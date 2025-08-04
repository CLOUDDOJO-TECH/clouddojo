"use client";

import { ArrowRight } from "lucide-react";
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
      className={` w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 group ${
        isSelected
          ? "bg-emerald-500/20 border border-emerald-500/30"
          : "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20"
      }`}
    >
      <div className="text-left">
        <h4 className="text-white font-medium">{option.title}</h4>
        <p className="text-gray-400 text-sm">{option.desc}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-300" />
    </button>
  );
}
