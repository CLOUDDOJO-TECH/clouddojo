"use client";

import { useEffect, useRef } from "react";
import UpgradeButton from "@/components/ui/upgrade-button";
import { Lock } from "lucide-react";

interface ReportBlurGateProps {
  children: React.ReactNode;
}

export default function ReportBlurGate({ children }: ReportBlurGateProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Prevent copy, drag, and context menu on the gated content
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const prevent = (e: Event) => e.preventDefault();

    el.addEventListener("copy", prevent);
    el.addEventListener("cut", prevent);
    el.addEventListener("dragstart", prevent);
    el.addEventListener("contextmenu", prevent);
    el.addEventListener("selectstart", prevent);

    return () => {
      el.removeEventListener("copy", prevent);
      el.removeEventListener("cut", prevent);
      el.removeEventListener("dragstart", prevent);
      el.removeEventListener("contextmenu", prevent);
      el.removeEventListener("selectstart", prevent);
    };
  }, []);

  return (
    <div className="relative">
      {/* Content layer — blurred, uninteractable, uncopyable */}
      <div
        ref={contentRef}
        aria-hidden="true"
        className="select-none pointer-events-none"
        style={{
          WebkitUserSelect: "none",
          userSelect: "none",
          // Apply blur directly to content so removing overlay doesn't help
          maskImage:
            "linear-gradient(to bottom, black 0%, black 25%, black 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 25%, black 100%)",
        }}
      >
        {/* Inner wrapper that gets progressively blurred via CSS */}
        <div
          className="[&>*]:pointer-events-none"
          style={{
            filter: "blur(0px)",
          }}
        >
          {children}
        </div>
      </div>

      {/* Gradient blur overlay — transparent at top, fully blurred at bottom */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, transparent 15%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.7) 45%, black 60%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, transparent 15%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.7) 45%, black 60%)",
        }}
      />

      {/* Secondary solid overlay for the bottom half to fully obscure */}
      <div
        className="absolute inset-0 pointer-events-none bg-background/80"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, transparent 35%, rgba(0,0,0,0.5) 55%, black 75%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, transparent 35%, rgba(0,0,0,0.5) 55%, black 75%)",
        }}
      />

      {/* CTA overlay — positioned in the blur zone, fully interactive */}
      <div className="absolute inset-x-0 bottom-0 top-[40%] flex items-center justify-center pointer-events-auto">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="h-12 w-12 rounded-full bg-foreground/5 border border-border/60 flex items-center justify-center">
            <Lock className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-1">
              Unlock Your Full AI Report
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Upgrade to see your complete analysis, action items, and
              personalized study resources.
            </p>
          </div>
          <UpgradeButton size="lg" variant="primary">
            Upgrade to Premium
          </UpgradeButton>
        </div>
      </div>
    </div>
  );
}
