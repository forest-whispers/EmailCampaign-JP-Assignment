import React from "react";
import { Badge } from "@/app/shared/components/Badge";
import type { ReportData } from "../reports.types";

export interface LeadBreakdownProps {
  report: ReportData;
}

export const LeadBreakdown: React.FC<LeadBreakdownProps> = ({ report }) => {
  const { total, emailStatus, classification } = report.leads;

  const emailItems = [
    {
      label: "Valid",
      count: emailStatus.valid,
      badgeVariant: "success" as const,
      barColor: "bg-emerald-500",
    },
    {
      label: "Invalid",
      count: emailStatus.invalid,
      badgeVariant: "danger" as const,
      barColor: "bg-rose-500",
    },
    {
      label: "Missing",
      count: emailStatus.missing,
      badgeVariant: "warning" as const,
      barColor: "bg-amber-500",
    },
  ];

  const classItems = [
    {
      label: "Business",
      count: classification.business,
      badgeVariant: "info" as const,
      barColor: "bg-blue-500",
    },
    {
      label: "Individual",
      count: classification.individual,
      badgeVariant: "neutral" as const,
      barColor: "bg-purple-500",
    },
    {
      label: "Unclassified",
      count: classification.unclassified,
      badgeVariant: "neutral" as const,
      barColor: "bg-zinc-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Email Status Breakdown */}
      <div className="p-4 rounded border border-zinc-800 bg-zinc-900/60 space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            Email Verification Status
          </h2>
          <span className="text-[11px] text-zinc-500">
            Total: {total.toLocaleString()}
          </span>
        </div>

        <div className="space-y-2.5">
          {emailItems.map((item) => {
            const percentage = total > 0 ? (item.count / total) * 100 : 0;
            return (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Badge variant={item.badgeVariant} size="sm">
                      {item.label}
                    </Badge>
                  </div>
                  <span className="font-mono text-zinc-200">
                    {item.count.toLocaleString()}
                  </span>
                </div>
                {/* Visual Representation Bar */}
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

      {/* Classification Breakdown */}
      <div className="p-4 rounded border border-zinc-800 bg-zinc-900/60 space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            Lead Classification
          </h2>
          <span className="text-[11px] text-zinc-500">
            Total: {total.toLocaleString()}
          </span>
        </div>

        <div className="space-y-2.5">
          {classItems.map((item) => {
            const percentage = total > 0 ? (item.count / total) * 100 : 0;
            return (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Badge variant={item.badgeVariant} size="sm">
                      {item.label}
                    </Badge>
                  </div>
                  <span className="font-mono text-zinc-200">
                    {item.count.toLocaleString()}
                  </span>
                </div>
                {/* Visual Representation Bar */}
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
    </div>
  );
};
