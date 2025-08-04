import React from "react";
import { LucideIcon } from "lucide-react";

interface StepIconProps {
  icon: LucideIcon;
}

export function StepIcon({ icon }: StepIconProps) {
  return (
    <div className="flex justify-center mb-6">
      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-2xl flex items-center justify-center text-emerald-400 shadow-lg">
        {React.createElement(icon, { className: "w-10 h-10" })}
      </div>
    </div>
  );
}
