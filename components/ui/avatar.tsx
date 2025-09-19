"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className,
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "bg-emerald-900/40 w-full backdrop-blur-md backdrop-saturate-150 flex items-center  justify-center rounded-full dark:border-primary/50 border-primary/80 border p-1 shadow-sm  max-w-[500px] mx-auto relative overflow-hidden",
      className,
    )}
    {...props}
  >
    <div className="absolute inset-0 bg-emerald-500 dark:bg-emerald-500 blur-xl rounded-full"></div>
    <div className="absolute inset-x-0 top-0 h-[30%] w-full bg-gradient-to-b from-white/10 to-transparent rounded-t-full"></div>
    <div className="flex -space-x-1.5 relative z-10"></div>

    <span className="text-white px-2 text-xs relative z-10 font-medium flex items-center">
      {props.children}
    </span>
  </AvatarPrimitive.Fallback>
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
