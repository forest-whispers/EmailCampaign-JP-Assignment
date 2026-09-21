import React from "react";
import { cn } from "../utils/cn";
import { Spinner } from "./Spinner";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "secondary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded";

    const variantStyles = {
      primary:
        "bg-blue-600 text-white hover:bg-blue-500 border border-blue-500 active:bg-blue-700",
      secondary:
        "bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700 active:bg-zinc-800",
      danger:
        "bg-red-950/60 text-red-300 hover:bg-red-900/60 border border-red-800/80 active:bg-red-950",
      ghost:
        "bg-transparent text-zinc-300 hover:bg-zinc-800/60 border border-transparent active:bg-zinc-800",
    };

    const sizeStyles = {
      sm: "h-7 px-2.5 text-xs gap-1.5",
      md: "h-8 px-3 text-xs gap-2",
      lg: "h-9 px-4 text-sm gap-2",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading && <Spinner size="sm" className="text-current" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
