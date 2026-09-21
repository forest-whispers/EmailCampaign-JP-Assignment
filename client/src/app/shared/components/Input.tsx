import React from "react";
import { cn } from "../utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-zinc-300"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "w-full h-8 px-2.5 text-xs bg-zinc-900 border rounded text-zinc-100 placeholder-zinc-500",
            "focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error ? "border-red-600 focus:ring-red-500 focus:border-red-500" : "border-zinc-700 hover:border-zinc-600",
            className
          )}
          {...props}
        />
        {error && <p className="text-[11px] text-red-400">{error}</p>}
        {helperText && !error && (
          <p className="text-[11px] text-zinc-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
