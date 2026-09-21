import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Send,
  Calendar,
  Tag,
  AlertCircle,
  X,
} from "lucide-react";
import { Button } from "@/app/shared/components/Button";
import { Badge } from "@/app/shared/components/Badge";
import { Spinner } from "@/app/shared/components/Spinner";
import { getErrorMessage } from "@/app/shared/utils/getErrorMessage";
import { useCampaignQuery } from "../campaigns.queries";
import { CampaignLeadSelector } from "../components/CampaignLeadSelector";
import { EditCampaignDialog } from "../components/EditCampaignDialog";
import { DeleteCampaignDialog } from "../components/DeleteCampaignDialog";
import { SendCampaignDialog } from "../components/SendCampaignDialog";

export const CampaignDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: campaign, isLoading, isError, error, refetch } = useCampaignQuery(
    id || ""
  );

  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Spinner size="lg" />
        <span className="text-xs text-zinc-500">Loading campaign details...</span>
      </div>
    );
  }

  if (isError || !campaign) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-3">
        <AlertCircle className="h-8 w-8 text-red-400 mx-auto" />
        <h2 className="text-sm font-semibold text-zinc-200">
          Failed to load campaign
        </h2>
        <p className="text-xs text-zinc-400">
          {error ? getErrorMessage(error) : "Campaign not found."}
        </p>
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button variant="secondary" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
          <Link to="/campaigns">
            <Button variant="ghost" size="sm">
              Back to Campaigns
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs text-zinc-400">
            <Link
              to="/campaigns"
              className="hover:text-zinc-200 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>Campaigns</span>
            </Link>
            <span>/</span>
            <span className="text-zinc-200 truncate">{campaign.name}</span>
          </div>

          <div className="flex items-center gap-2.5 pt-1">
            <h1 className="text-base font-semibold text-zinc-100">
              {campaign.name}
            </h1>
            <Badge
              variant={
                campaign.classification === "BUSINESS" ? "info" : "neutral"
              }
              size="sm"
            >
              <Tag className="h-3 w-3 mr-1" />
              {campaign.classification}
            </Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsEditOpen(true)}
          >
            <Edit2 className="h-3.5 w-3.5 mr-1" />
            Edit Campaign
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Delete
          </Button>
        </div>
      </div>

      {/* Ephemeral Feedback Message */}
      {feedbackMessage && (
        <div className="p-2.5 rounded border border-zinc-700 bg-zinc-900/80 text-xs text-zinc-200 flex items-center justify-between">
          <span>{feedbackMessage}</span>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-zinc-400 hover:text-zinc-200"
            aria-label="Dismiss message"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Campaign Configuration Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Email Subject & Message */}
        <div className="md:col-span-2 p-4 rounded border border-zinc-800 bg-zinc-900/40 space-y-3">
          <div>
            <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
              Subject Line
            </span>
            <p className="text-xs font-medium text-zinc-200 mt-0.5">
              {campaign.subject}
            </p>
          </div>

          <div className="pt-2 border-t border-zinc-800/80">
            <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
              Email Template
            </span>
            <pre className="mt-1 p-3 rounded bg-zinc-950 border border-zinc-800/80 font-mono text-xs text-zinc-300 whitespace-pre-wrap overflow-x-auto leading-relaxed">
              {campaign.emailMessage}
            </pre>
          </div>
        </div>

        {/* Meta details & Dispatch Action Card */}
        <div className="p-4 rounded border border-zinc-800 bg-zinc-900/40 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
              Campaign Properties
            </span>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-zinc-300">
                <span className="text-zinc-500 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Created
                </span>
                <span>{formatDate(campaign.createdAt)}</span>
              </div>

              <div className="flex items-center justify-between text-zinc-300">
                <span className="text-zinc-500">Target Audience</span>
                <Badge
                  variant={
                    campaign.classification === "BUSINESS" ? "info" : "neutral"
                  }
                  size="sm"
                >
                  {campaign.classification} Leads
                </Badge>
              </div>

              {campaign.recipients && campaign.recipients.length > 0 && (
                <div className="flex items-center justify-between text-zinc-300 pt-1 border-t border-zinc-800">
                  <span className="text-zinc-500">Recipients</span>
                  <span>{campaign.recipients.length} recorded</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800 space-y-2">
            <Button
              variant="primary"
              className="w-full"
              size="md"
              disabled={selectedLeadIds.size === 0}
              onClick={() => setIsSendOpen(true)}
              title={
                selectedLeadIds.size === 0
                  ? "Select at least one eligible lead below to dispatch"
                  : undefined
              }
            >
              <Send className="h-3.5 w-3.5 mr-1.5" />
              <span>Send Campaign ({selectedLeadIds.size})</span>
            </Button>
            <p className="text-[11px] text-center text-zinc-500">
              {selectedLeadIds.size === 0
                ? "Select eligible leads below to dispatch"
                : `${selectedLeadIds.size} recipient(s) selected`}
            </p>
          </div>
        </div>
      </div>

      {/* Recipient Statuses (if returned by backend) */}
      {campaign.recipients && campaign.recipients.length > 0 && (
        <div className="p-4 rounded border border-zinc-800 bg-zinc-900/30 space-y-3">
          <h2 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
            Past Recipient Dispatches
          </h2>
          <div className="max-h-48 overflow-y-auto divide-y divide-zinc-800/60 text-xs">
            {campaign.recipients.map((r) => (
              <div
                key={r.id}
                className="py-1.5 flex items-center justify-between gap-2"
              >
                <div className="font-mono text-[11px] text-zinc-400 truncate">
                  {r.lead?.email || `Lead: ${r.leadId.slice(0, 8)}...`}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {r.errorMessage && (
                    <span className="text-[10px] text-red-400 max-w-xs truncate">
                      {r.errorMessage}
                    </span>
                  )}
                  <Badge
                    variant={
                      r.status === "SENT"
                        ? "success"
                        : r.status === "FAILED"
                        ? "danger"
                        : "warning"
                    }
                    size="sm"
                  >
                    {r.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lead Selection Section */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-zinc-800 pb-2">
          <div>
            <h2 className="text-sm font-semibold text-zinc-100">
              Select Leads for Outreach
            </h2>
            <p className="text-[11px] text-zinc-400">
              Showing leads matching target classification (
              <strong className="text-zinc-200">{campaign.classification}</strong>).
              Only leads with verified valid emails are selectable.
            </p>
          </div>
        </div>

        <CampaignLeadSelector
          classification={campaign.classification}
          selectedLeadIds={selectedLeadIds}
          onSelectionChange={(ids) => setSelectedLeadIds(ids)}
        />
      </div>

      {/* Dialogs */}
      <EditCampaignDialog
        campaign={campaign}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={() => {
          setFeedbackMessage("Campaign updated successfully.");
        }}
      />

      <DeleteCampaignDialog
        campaign={campaign}
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onSuccess={() => {
          navigate("/campaigns", { replace: true });
        }}
      />

      <SendCampaignDialog
        campaignId={campaign.id}
        campaignName={campaign.name}
        selectedLeadIds={Array.from(selectedLeadIds)}
        isOpen={isSendOpen}
        onClose={() => setIsSendOpen(false)}
        onSuccessResult={(res) => {
          setSelectedLeadIds(new Set());
          setFeedbackMessage(
            `Campaign dispatched. ${res.sentCount} email(s) sent${
              res.skippedCount > 0 ? `, ${res.skippedCount} skipped` : ""
            }.`
          );
        }}
      />
    </div>
  );
};
