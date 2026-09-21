import React from "react";
import { cn } from "../utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md";
}

const variantStyles = {
  neutral: "bg-zinc-800 text-zinc-300 border-zinc-700",
  success: "bg-emerald-950/60 text-emerald-300 border-emerald-800/80",
  warning: "bg-amber-950/60 text-amber-300 border-amber-800/80",
  danger: "bg-rose-950/60 text-rose-300 border-rose-800/80",
  info: "bg-blue-950/60 text-blue-300 border-blue-800/80",
};

const sizeStyles = {
  sm: "text-[10px] px-1.5 py-0.5 leading-none",
  md: "text-xs px-2 py-0.5 leading-tight",
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "neutral",
  size = "md",
  className,
  ...props
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium border rounded tracking-wide",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
