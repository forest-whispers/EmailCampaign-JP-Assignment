import React from "react";
import { RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/app/shared/components/Button";
import { getErrorMessage } from "@/app/shared/utils/getErrorMessage";
import { useReportQuery } from "../reports.queries";
import { SummaryCards } from "../components/SummaryCards";
import { LeadBreakdown } from "../components/LeadBreakdown";
import { SourceBreakdown } from "../components/SourceBreakdown";
import { EmailSendingBreakdown } from "../components/EmailSendingBreakdown";

export const ReportsPage: React.FC = () => {
  const { data: report, isLoading, isError, error, isFetching, refetch } =
    useReportQuery();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-base font-semibold text-zinc-100">Dashboard</h1>
          <p className="text-xs text-zinc-400">
            Real-time operations summary, contact breakdowns, and email telemetry
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="self-start sm:self-auto"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 mr-1.5 text-zinc-400 ${
              isFetching ? "animate-spin" : ""
            }`}
          />
          <span>{isFetching ? "Refreshing..." : "Refresh"}</span>
        </Button>
      </div>

      {/* Error state */}
      {isError && (
        <div className="p-3 rounded border border-red-800/80 bg-red-950/40 text-xs text-red-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{getErrorMessage(error)}</span>
          </div>
          <Button variant="secondary" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {/* Initial Loading Skeleton */}
      {isLoading && !report && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-24 rounded border border-zinc-800 bg-zinc-900/30 animate-pulse"
              />
            ))}
          </div>
          <div className="h-48 rounded border border-zinc-800 bg-zinc-900/30 animate-pulse" />
          <div className="h-36 rounded border border-zinc-800 bg-zinc-900/30 animate-pulse" />
        </div>
      )}

      {/* Dashboard Data */}
      {report && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <SummaryCards report={report} />

          {/* Lead Overview (Email Status & Classification) */}
          <LeadBreakdown report={report} />

          {/* Lead Sources */}
          <SourceBreakdown report={report} />

          {/* Email Sending Pipeline */}
          <EmailSendingBreakdown report={report} />
        </div>
      )}
    </div>
  );
};
