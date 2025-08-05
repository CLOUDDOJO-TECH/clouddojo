import { MovingBorderComponent } from "@/components/ui/moving-border";
import type React from "react";
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({ children, className = "" }: GlassCardProps) {
  return (
    <MovingBorderComponent>
      <div className="relative  w-full">
        <div
          className={`relative  bg-gradient-to-br from-white/5 via-white/2 to-transparent border border-primary/20 rounded-3xl p-8 shadow-2xl ${className}`}
        >
          {/* Glass Reflection Effect */}
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/2 to-transparent rounded-t-3xl opacity-60" />
          <div className="absolute top-4 left-4 w-16 h-8 bg-white/30 rounded-full blur-xl opacity-40" />
          {children}
        </div>

        {/* Enhanced Ambient Glow Effect */}
        {/*<div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-cyan-500/5 rounded-3xl blur-3xl -z-10 scale-110" />
        <div className="absolute inset-0 bg-white/5 rounded-3xl blur-2xl -z-10 scale-105" />*/}
      </div>
    </MovingBorderComponent>
  );
}
