import React from "react";
import { Badge } from "@/app/shared/components/Badge";
import type { ReportData } from "../reports.types";

export interface EmailSendingBreakdownProps {
  report: ReportData;
}

export const EmailSendingBreakdown: React.FC<EmailSendingBreakdownProps> = ({
  report,
}) => {
  const { sent, failed, pending } = report.emailSending;
  const totalDispatches = sent + failed + pending;

  const items = [
    {
      label: "Delivered (Sent)",
      count: sent,
      badgeVariant: "success" as const,
      barColor: "bg-emerald-500",
      description: "Successfully transmitted through SMTP",
    },
    {
      label: "Failed",
      count: failed,
      badgeVariant: "danger" as const,
      barColor: "bg-rose-500",
      description: "Rejected by recipient server or transmission error",
    },
    {
      label: "Pending",
      count: pending,
      badgeVariant: "warning" as const,
      barColor: "bg-amber-500",
      description: "Queued for processing",
    },
  ];

  return (
    <div className="p-4 rounded border border-zinc-800 bg-zinc-900/60 space-y-3">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
          Email Dispatch Pipeline
        </h2>
        <span className="text-[11px] text-zinc-500">
          Total Dispatches: {totalDispatches.toLocaleString()}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {items.map((item) => {
          const percentage =
            totalDispatches > 0 ? (item.count / totalDispatches) * 100 : 0;

          return (
            <div
              key={item.label}
              className="p-3 rounded bg-zinc-950/60 border border-zinc-800/80 space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <Badge variant={item.badgeVariant} size="sm">
                    {item.label}
                  </Badge>
                  <span className="font-mono text-sm font-bold text-zinc-200">
                    {item.count.toLocaleString()}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-500 mt-1">
                  {item.description}
                </p>
              </div>

              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.barColor} transition-all duration-300`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
