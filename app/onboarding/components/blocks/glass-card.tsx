import { MovingBorderComponent } from "@/components/ui/moving-border";
import type React from "react";
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({ children, className = "" }: GlassCardProps) {
  return (
    <div className="relative w-full">
      <div
        className={`relative bg-white/90 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-2xl p-8 shadow-2xl ${className}`}
      >
        {/* Glass Reflection Effect - Subtle shine */}
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/40 dark:from-white/5 to-transparent rounded-t-2xl opacity-50" />
        <div className="absolute top-4 left-4 w-16 h-8 bg-white/60 dark:bg-white/20 rounded-full blur-xl opacity-30" />

        {/* Content */}
        <div className="relative z-10">{children}</div>
      </div>

      {/* Ambient Glow Effect - Softer in light mode */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-blue-500/5 to-purple-500/5 dark:from-emerald-500/10 dark:via-blue-500/5 dark:to-purple-500/5 rounded-2xl blur-3xl -z-10 scale-110" />
    </div>
  );
}
