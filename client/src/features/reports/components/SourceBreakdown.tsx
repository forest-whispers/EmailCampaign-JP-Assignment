import React from "react";
import { Badge } from "@/app/shared/components/Badge";
import type { ReportData } from "../reports.types";

export interface SourceBreakdownProps {
  report: ReportData;
}

export const SourceBreakdown: React.FC<SourceBreakdownProps> = ({ report }) => {
  const sources = report.leads.sources;
  const totalLeads = report.leads.total;

  return (
    <div className="p-4 rounded border border-zinc-800 bg-zinc-900/60 space-y-3">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
          Lead Ingestion Sources
        </h2>
        <span className="text-[11px] text-zinc-500">
          {sources.length} active source{sources.length === 1 ? "" : "s"}
        </span>
      </div>

      {sources.length === 0 ? (
        <div className="py-6 text-center text-xs text-zinc-500">
          No source records available.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {sources.map((item) => {
            const percentage =
              totalLeads > 0 ? (item.count / totalLeads) * 100 : 0;

            return (
              <div
                key={item.source}
                className="p-3 rounded bg-zinc-950/60 border border-zinc-800/80 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="neutral" size="sm" className="font-mono text-[10px]">
                    {item.source}
                  </Badge>
                  <span className="font-mono text-xs font-semibold text-zinc-200">
                    {item.count.toLocaleString()}
                  </span>
                </div>

                <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
