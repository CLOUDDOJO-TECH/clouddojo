"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, type PanInfo } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import AlarmClockIcon from "@/components/icons/alarm-clock";

interface ExpandableClockProps {
  timeLeft: number;
  isWarning: boolean;
  isPaused: boolean;
  formatTime: (seconds: number) => string;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
}

const COLLAPSED_H = 40;
const DRAG_THRESHOLD = 40;

export default function ExpandableClock({
  timeLeft,
  isWarning,
  isPaused,
  formatTime,
  onPause,
  onResume,
  onReset,
}: ExpandableClockProps) {
  const [expanded, setExpanded] = useState(false);
  const didDrag = useRef(false);
  const expandedRef = useRef<HTMLDivElement>(null);
  const [expandedH, setExpandedH] = useState(0);

  useEffect(() => {
    if (expandedRef.current) {
      setExpandedH(expandedRef.current.scrollHeight);
    }
  }, []);

  const secondHandRotation = ((60 - (timeLeft % 60)) % 60) * 6;

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (!expanded && info.offset.y > DRAG_THRESHOLD) {
        didDrag.current = true;
        setExpanded(true);
      } else if (expanded && info.offset.y < -DRAG_THRESHOLD) {
        didDrag.current = true;
        setExpanded(false);
      }
    },
    [expanded],
  );

  const handleClick = useCallback(() => {
    if (didDrag.current) {
      didDrag.current = false;
      return;
    }
    setExpanded((prev) => !prev);
  }, []);

  const smooth = {
    type: "spring" as const,
    stiffness: 200,
    damping: 28,
    mass: 0.6,
  };

  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-0 z-10">
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.25}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
        animate={{
          height: expanded ? expandedH || COLLAPSED_H : COLLAPSED_H,
          width: expanded ? 220 : 160,
        }}
        whileHover={!expanded ? { height: COLLAPSED_H + 6, scale: 1.03 } : undefined}
        transition={{
          height: { type: "tween", duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
          width: { type: "tween", duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
        }}
        className={cn(
          "group flex flex-col items-center overflow-hidden cursor-pointer select-none rounded-b-xl border border-t-0 will-change-[height,width] px-4",
          expanded
            ? "shadow-lg shadow-black/15 dark:shadow-black/40"
            : "",
          isWarning
            ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800/50"
            : "bg-background text-amber-600 border-border dark:text-amber-400",
        )}
      >
        {/* Collapsed: icon + time + chevron */}
        <motion.div
          animate={{
            opacity: expanded ? 0 : 1,
            height: expanded ? 0 : COLLAPSED_H,
          }}
          transition={smooth}
          className="flex flex-col items-center justify-center overflow-hidden shrink-0 group/pill"
        >
          <div className="flex items-center gap-1.5">
            <AlarmClockIcon className="h-5 w-5 shrink-0" />
            <span className="font-mono text-base font-medium whitespace-nowrap">
              {formatTime(timeLeft)}
            </span>
            {isPaused && (
              <span className="text-[10px] font-medium uppercase tracking-wider opacity-60 shrink-0">
                paused
              </span>
            )}
          </div>
          <div className="h-1 w-10 rounded-full bg-current opacity-20 mt-1 transition-all duration-200 group-hover:w-7" />
        </motion.div>

        {/* Expanded: controls + clock face + drag handle */}
        <motion.div
          ref={expandedRef}
          animate={{ opacity: expanded ? 1 : 0 }}
          transition={smooth}
          className="flex flex-col items-center shrink-0 pb-2 group/clock"
          style={{ pointerEvents: expanded ? "auto" : "none" }}
        >
          {/* Controls */}
          <div
            className="flex w-full items-center justify-between px-2 mt-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              onClick={onReset}
              size="icon"
              variant="outline"
              className="size-8 rounded-full"
              aria-label="Reset timer"
            >
              <RotateCcw className="size-3.5" />
            </Button>
            <Button
              onClick={isPaused ? onResume : onPause}
              size="icon"
              variant="outline"
              className="size-8 rounded-full"
              aria-label={isPaused ? "Resume timer" : "Pause timer"}
            >
              {isPaused ? (
                <Play className="size-3.5 fill-current" />
              ) : (
                <Pause className="size-3.5 fill-current" />
              )}
            </Button>
          </div>

          <div className="relative mx-auto aspect-square size-[140px] mt-1">
            {/* Clock center dot */}
            <div
              className={cn(
                "absolute top-1/2 left-1/2 z-20 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2",
                isWarning ? "border-red-500" : "border-amber-500",
              )}
            />

            {/* 60 second ticks */}
            {[...Array(60)].map((_, i) => (
              <div
                key={`tick-${i}`}
                className="absolute h-full w-full"
                style={{ transform: `rotate(${i * 6}deg)` }}
              >
                <div className="bg-muted-foreground/20 absolute top-0 left-1/2 h-1.5 w-0.5 -translate-x-1/2" />
              </div>
            ))}

            {/* 12 hour markers */}
            {[...Array(12)].map((_, i) => (
              <div
                key={`hour-${i}`}
                className="absolute h-full w-full"
                style={{ transform: `rotate(${i * 30}deg)` }}
              >
                <div className="bg-muted-foreground/60 absolute top-0 left-1/2 h-3 w-0.5 -translate-x-1/2" />
              </div>
            ))}

            {/* Numbers 1-12 */}
            {[...Array(12)].map((_, i) => {
              const angle = i * 30 * (Math.PI / 180);
              const x = Math.sin(angle) * 51;
              const yPos = -Math.cos(angle) * 51;
              const number = i === 0 ? 12 : i;

              return (
                <Label
                  key={`num-${i}`}
                  className="text-foreground/70 absolute flex size-4 items-center justify-center text-[10px] font-semibold"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${yPos}px)`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {number}
                </Label>
              );
            })}

            {/* Second hand */}
            <div
              className="absolute top-1/2 left-1/2 z-10 h-[50px] w-0.5 origin-bottom rounded-full bg-red-500"
              style={{
                transform: `translate(-50%, -100%) rotate(${secondHandRotation}deg)`,
              }}
            />

            {/* Centered digital time */}
            <span
              className={cn(
                "absolute top-1/2 left-1/2 z-30 -translate-x-1/2 translate-y-1 font-mono text-lg font-bold",
                isWarning
                  ? "text-red-600 dark:text-red-400"
                  : "text-foreground",
              )}
            >
              {formatTime(timeLeft)}
            </span>
          </div>

          {/* Drag handle indicator */}
          <div className="h-1 w-14 rounded-full bg-muted-foreground/25 mt-2 transition-all duration-200 group-hover:w-10" />
        </motion.div>
      </motion.div>
    </div>
  );
}
