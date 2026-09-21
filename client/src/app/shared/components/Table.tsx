import React from "react";
import { cn } from "../utils/cn";

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, ...props }, ref) => (
    <div className="w-full overflow-x-auto border border-zinc-800 rounded">
      <table
        ref={ref}
        className={cn("w-full text-left text-xs text-zinc-300 border-collapse", className)}
        {...props}
      />
    </div>
  )
);
Table.displayName = "Table";

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("bg-zinc-900/90 border-b border-zinc-800 text-zinc-400 font-medium", className)}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("divide-y divide-zinc-800/60 bg-zinc-950/40", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "transition-colors hover:bg-zinc-800/40 data-[state=selected]:bg-zinc-800/60",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn("h-8 px-3 text-left align-middle font-medium text-zinc-400 select-none", className)}
    {...props}
  />
));
TableHead.displayName = "TableHead";

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-3 align-middle text-zinc-300", className)}
    {...props}
  />
));
TableCell.displayName = "TableCell";

export const TableEmpty: React.FC<{ colSpan: number; message?: string }> = ({
  colSpan,
  message = "No records found.",
}) => (
  <tr>
    <td
      colSpan={colSpan}
      className="h-24 text-center text-xs text-zinc-500 align-middle"
    >
      {message}
    </td>
  </tr>
);
