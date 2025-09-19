import React from "react";
import { cn } from "@/lib/utils";

interface FlexRibbonWrapProps {
  children: React.ReactNode;
  text: string;
  variant?: "default" | "primary" | "success" | "warning" | "error" | "info";
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const FlexRibbonWrap = ({
  children,
  text,
  variant = "warning",
  position = "top-right",
  size = "md",
  className,
}: FlexRibbonWrapProps) => {
  // Variant styles for ribbon colors (based on amber/yellow base)
  const variantStyles = {
    default: {
      ribbon: "bg-emerald-500 text-emerald-800 hover:bg-emerald-400",
      corners: "bg-gray-500",
    },
    primary: {
      ribbon: "bg-blue-300 text-blue-800 hover:bg-blue-400",
      corners: "bg-blue-500",
    },
    success: {
      ribbon: "bg-green-300 text-green-800 hover:bg-green-400",
      corners: "bg-green-500",
    },
    warning: {
      ribbon: "bg-amber-300 text-amber-800 hover:bg-yellow-300",
      corners: "bg-amber-500",
    },
    error: {
      ribbon: "bg-red-300 text-red-800 hover:bg-red-400",
      corners: "bg-red-500",
    },
    info: {
      ribbon: "bg-cyan-300 text-cyan-800 hover:bg-cyan-400",
      corners: "bg-cyan-500",
    },
  };

  // Size variants
  const sizeStyles = {
    sm: {
      container: "w-32 aspect-square",
      ribbon: "py-1 text-xs",
      corners: "h-1.5 w-1.5",
    },
    md: {
      container: "w-36 aspect-square",
      ribbon: "py-1.5 text-xs",
      corners: "h-2 w-2",
    },
    lg: {
      container: "w-40 aspect-square",
      ribbon: "py-2 text-sm",
      corners: "h-3 w-3",
    },
  };

  // Position variants based on the base structure
  const positionStyles = {
    "top-left": {
      container: "absolute -top-2 -left-2",
      ribbon: "absolute bottom-0 left-0 -rotate-45 origin-bottom-left",
      corners: {
        corner1: "absolute top-0 right-0",
        corner2: "absolute bottom-0 left-0",
      },
    },
    "top-right": {
      container: "absolute -top-2 -right-2",
      ribbon: "absolute bottom-0 right-0 rotate-45 origin-bottom-right",
      corners: {
        corner1: "absolute top-0 left-0",
        corner2: "absolute bottom-0 right-0",
      },
    },
    "bottom-left": {
      container: "absolute -bottom-2 -left-2",
      ribbon: "absolute top-0 left-0 rotate-45 origin-top-left",
      corners: {
        corner1: "absolute bottom-0 right-0",
        corner2: "absolute top-0 left-0",
      },
    },
    "bottom-right": {
      container: "absolute -bottom-2 -right-2",
      ribbon: "absolute top-0 right-0 -rotate-45 origin-top-right",
      corners: {
        corner1: "absolute bottom-0 left-0",
        corner2: "absolute top-0 right-0",
      },
    },
  };

  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];
  const currentPosition = positionStyles[position];

  return (
    <div className={cn("relative", className)}>
      {/* Ribbon - based on the provided base structure */}
      <div
        className={cn(
          currentSize.container,
          currentPosition.container,
          "overflow-hidden rounded-sm",
        )}
      >
        {/* Corner fold effects */}
        <div
          className={cn(
            currentPosition.corners.corner1,
            currentSize.corners,
            currentVariant.corners,
          )}
        ></div>
        <div
          className={cn(
            currentPosition.corners.corner2,
            currentSize.corners,
            currentVariant.corners,
          )}
        ></div>

        {/* Main ribbon text */}
        <a
          href="#"
          className={cn(
            "font-semibold uppercase tracking-wider block w-square-diagonal text-center shadow-sm",
            currentSize.ribbon,
            currentPosition.ribbon,
            currentVariant.ribbon,
          )}
        >
          {text}
        </a>
      </div>

      {/* Children content */}
      {children}
    </div>
  );
};

// Export default for easier imports
export default FlexRibbonWrap;
