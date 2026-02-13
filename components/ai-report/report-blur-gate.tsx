"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import IconLockOutlineDuo18 from "@/components/icons/lock-outline-duo";
import IconLockOpen2OutlineDuo18 from "@/components/icons/lock-open-outline-duo";
import { useRouter } from "next/navigation";

interface ReportBlurGateProps {
  children: React.ReactNode;
}

export default function ReportBlurGate({ children }: ReportBlurGateProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

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
    <div className="relative overflow-hidden" style={{ height: "calc(100vh - 80px)" }}>
      {/* Content layer — static, uninteractable, uncopyable */}
      <div
        ref={contentRef}
        aria-hidden="true"
        className="absolute inset-0 select-none pointer-events-none overflow-hidden"
        style={{
          WebkitUserSelect: "none",
          userSelect: "none",
        }}
      >
        <div className="[&>*]:pointer-events-none">
          {children}
        </div>
      </div>

      {/* Gradient blur overlay — transparent at top, fully blurred quickly */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, transparent 22%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.7) 38%, black 48%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, transparent 22%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.7) 38%, black 48%)",
        }}
      />

      {/* Secondary stronger blur overlay for the lower portion */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, transparent 30%, rgba(0,0,0,0.5) 40%, black 55%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, transparent 30%, rgba(0,0,0,0.5) 40%, black 55%)",
        }}
      />

      {/* Edge fades — bottom and sides blend into background */}
      <div className="absolute inset-x-0 bottom-0 h-24 pointer-events-none bg-gradient-to-t from-background to-transparent" />
      <div className="absolute left-0 bottom-0 w-16 pointer-events-none bg-gradient-to-r from-background to-transparent" style={{ top: "30%" }} />
      <div className="absolute right-0 bottom-0 w-16 pointer-events-none bg-gradient-to-l from-background to-transparent" style={{ top: "30%" }} />

      {/* CTA overlay — positioned in the blur zone */}
      <div className="absolute inset-x-0 bottom-0 top-[26%] flex items-center justify-center pointer-events-auto">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="h-20 w-20 rounded-full bg-foreground/5 border border-border/60 flex items-center justify-center relative">
            <IconLockOutlineDuo18
              size="36px"
              className={`text-muted-foreground absolute transition-all duration-300 ease-in-out ${isHovered ? "opacity-0 scale-90" : "opacity-100 scale-100"}`}
            />
            <IconLockOpen2OutlineDuo18
              size="36px"
              className={`text-muted-foreground absolute transition-all duration-300 ease-in-out ${isHovered ? "opacity-100 scale-100" : "opacity-0 scale-110"}`}
            />
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
          <Button
            size="lg"
            onClick={() => router.push("/dashboard/billing")}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Upgrade to Premium
          </Button>
        </div>
      </div>
    </div>
  );
}
