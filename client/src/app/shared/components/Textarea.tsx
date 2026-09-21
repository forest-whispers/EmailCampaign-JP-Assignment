import React from "react";
import { cn } from "../utils/cn";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, rows = 3, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-medium text-zinc-300"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          className={cn(
            "w-full px-2.5 py-1.5 text-xs bg-zinc-900 border rounded text-zinc-100 placeholder-zinc-500",
            "focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400",
            "disabled:opacity-50 disabled:cursor-not-allowed resize-y",
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

Textarea.displayName = "Textarea";
