import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot, Slottable } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-t from-primary to-primary/85 text-primary-foreground dark:inset-shadow-2xs dark:inset-shadow-white/10  border border-b-2 border-zinc-950/40 shadow-md shadow-zinc-950/20 ring-1 ring-inset ring-white/25 transition-[filter] duration-200 hover:brightness-110 active:brightness-90 dark:border-x-0 dark:border-t-0 dark:border-zinc-950/50 dark:ring-white/5",
        outline:
          "bg-background hover:bg-muted/50 dark:ring-input border-input/50 dark:border-input relative border-b-2 shadow-sm shadow-zinc-950/15 ring-1 ring-zinc-300",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        glass:
          "dark:bg-emerald-950/30  dark:text-gray-100 text-gray-800 hover:bg-emerald-950/40 backdrop-blur-md backdrop-saturate-150 flex items-center justify-center rounded-full border-slate-200/50 border p-1 shadow-sm w-fit max-w-[500px] mx-auto relative overflow-hidden",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        destructive:
          "from-destructive to-destructive/85 text-destructive-foreground dark:inset-shadow-2xs dark:inset-shadow-white/10 bg-linear-to-t border border-b-2 border-zinc-950/40 shadow-md shadow-zinc-950/20 ring-1 ring-inset ring-white/25 transition-[filter] duration-200 hover:brightness-110 active:brightness-90 dark:border-x-0 dark:border-t-0 dark:border-zinc-950/50 dark:ring-white/5",
        ringHover:
          "bg-primary text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:ring-2 hover:ring-primary/90 hover:ring-offset-2",
        shine:
          "text-primary-foreground animate-shine bg-gradient-to-r from-primary via-primary/75 to-primary bg-[length:400%_100%] ",
        linkHover1:
          "relative after:absolute after:bg-primary after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-left after:scale-x-100 hover:after:origin-bottom-right hover:after:scale-x-0 after:transition-transform after:ease-in-out after:duration-300",
        linkHover2:
          "relative after:absolute after:bg-primary after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:ease-in-out after:duration-300",
        theme:
          "flex-col h-auto w-auto p-0 gap-3 bg-transparent hover:bg-transparent border-0 shadow-none",
        gradient:
          "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-[0_8px_16px_rgba(16,185,129,0.4)] hover:shadow-[0_12px_24px_rgba(16,185,129,0.5)] transition-all duration-300 border-0 font-medium",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface IconProps {
  Icon?: React.ElementType;
  iconPlacement?: "left" | "right";
}

interface IconRefProps {
  Icon: React.ElementType;
  iconPlacement?: "undefined";
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  Icon?: React.ElementType<any>;
  iconPlacement?: "left" | "right";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      Icon,
      iconPlacement = "right",
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {Icon && iconPlacement === "left" && (
          <div className="group-hover:translate-x-100 w-0 translate-x-[0%] pr-0 opacity-0 transition-all duration-200 *:size-4 group-hover:w-5 group-hover:pr-2 group-hover:opacity-100">
            {React.createElement(Icon)}
          </div>
        )}
        <Slottable>{props.children}</Slottable>
        {Icon && iconPlacement === "right" && (
          <div className="w-0 translate-x-[100%] pl-0 opacity-0 transition-all duration-200 *:size-4 group-hover:w-5 group-hover:translate-x-0 group-hover:pl-2 group-hover:opacity-100">
            {React.createElement(Icon)}
          </div>
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
