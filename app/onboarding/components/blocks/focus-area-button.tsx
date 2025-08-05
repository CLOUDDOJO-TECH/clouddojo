"use client";

import { CheckCircle } from "lucide-react";
import { StepOption } from "../../types/onboarding";
import React from "react";

interface FocusAreaButtonProps {
  option: StepOption;
  isSelected: boolean;
  onClick: () => void;
}

export function FocusAreaButton({
  option,
  isSelected,
  onClick,
}: FocusAreaButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 group ${
        isSelected
          ? "bg-emerald-500/20 border border-emerald-500/30"
          : "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="text-emerald-400">
          {option.icon &&
            React.createElement(option.icon, { className: "w-10 h-10" })}
        </div>
        <div className="text-left">
          <h4 className="text-white font-medium">{option.title}</h4>
          <p className="text-gray-400 text-sm">{option.desc}</p>
        </div>
      </div>
      <div
        className={`w-4 h-4 rounded border-2 transition-all duration-300 ${
          isSelected ? "bg-emerald-500 border-emerald-500" : "border-white/30"
        }`}
      >
        {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
      </div>
    </button>
  );
}
