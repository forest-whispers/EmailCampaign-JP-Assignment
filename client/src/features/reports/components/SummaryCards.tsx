import React from "react";
import { Users, CheckCircle2, Send, MailCheck } from "lucide-react";
import type { ReportData } from "../reports.types";

export interface SummaryCardsProps {
  report: ReportData;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ report }) => {
  const cards = [
    {
      title: "Total Leads",
      value: report.leads.total,
      icon: Users,
      color: "text-zinc-200",
      description: "Ingested lead repository",
    },
    {
      title: "Valid Emails",
      value: report.leads.emailStatus.valid,
      icon: CheckCircle2,
      color: "text-emerald-400",
      description: "Verified sendable contacts",
    },
    {
      title: "Total Campaigns",
      value: report.campaigns.total,
      icon: Send,
      color: "text-blue-400",
      description: "Configured outreach campaigns",
    },
    {
      title: "Emails Sent",
      value: report.emailSending.sent,
      icon: MailCheck,
      color: "text-purple-400",
      description: "Total delivered dispatches",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="p-3.5 rounded border border-zinc-800 bg-zinc-900/60 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">
                {card.title}
              </span>
              <Icon className={`h-4 w-4 ${card.color} opacity-80`} />
            </div>

            <div className="mt-2.5">
              <span className="text-xl font-bold tracking-tight text-zinc-100">
                {card.value.toLocaleString()}
              </span>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                {card.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
