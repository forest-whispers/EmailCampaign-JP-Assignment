import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, X, AlertCircle } from "lucide-react";
import { Button } from "@/app/shared/components/Button";
import { Select } from "@/app/shared/components/Select";
import { Spinner } from "@/app/shared/components/Spinner";
import { getErrorMessage } from "@/app/shared/utils/getErrorMessage";
import {
  useCampaignsQuery,
  useCampaignQuery,
} from "@/features/campaigns/campaigns.queries";
import { CampaignSettings } from "../components/CampaignSettings";

export const SettingsPage: React.FC = () => {
  const {
    data: campaigns = [],
    isLoading: isCampaignsLoading,
    isError: isCampaignsError,
    error: campaignsError,
    refetch: refetchCampaigns,
  } = useCampaignsQuery();

  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Initialize selected campaign to the first available campaign once loaded,
  // while preserving user selection if the campaign still exists
  useEffect(() => {
    if (campaigns.length > 0) {
      if (!selectedCampaignId || !campaigns.some((c) => c.id === selectedCampaignId)) {
        setSelectedCampaignId(campaigns[0].id);
      }
    } else {
      setSelectedCampaignId("");
    }
  }, [campaigns, selectedCampaignId]);

  // Detail query is enabled only when a valid campaign ID is selected
  const {
    data: activeCampaign,
    isLoading: isActiveCampaignLoading,
    isError: isActiveCampaignError,
    error: activeCampaignError,
    refetch: refetchActiveCampaign,
  } = useCampaignQuery(selectedCampaignId);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-4">
        <h1 className="text-base font-semibold text-zinc-100">Settings</h1>
        <p className="text-xs text-zinc-400">
          Manage outreach campaign templates, targeting, and dispatch configuration
        </p>
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

      {/* Campaigns Loading State */}
      {isCampaignsLoading && (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <Spinner size="md" />
          <span className="text-xs text-zinc-500">Loading campaign settings...</span>
        </div>
      )}

      {/* Campaigns Error State */}
      {isCampaignsError && (
        <div className="p-3 rounded border border-red-800/80 bg-red-950/40 text-xs text-red-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{getErrorMessage(campaignsError)}</span>
          </div>
          <Button variant="secondary" size="sm" onClick={() => refetchCampaigns()}>
            Retry
          </Button>
        </div>
      )}

      {/* Empty State: No Campaigns */}
      {!isCampaignsLoading && !isCampaignsError && campaigns.length === 0 && (
        <div className="p-8 rounded border border-zinc-800 bg-zinc-900/30 text-center space-y-3">
          <p className="text-xs font-medium text-zinc-300">
            No campaigns configured yet.
          </p>
          <p className="text-[11px] text-zinc-500">
            Create a campaign first to manage its configuration and email template.
          </p>
          <div className="pt-1">
            <Link to="/campaigns">
              <Button variant="primary" size="sm">
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Go to Campaigns
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Active Configuration Area */}
      {!isCampaignsLoading && campaigns.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded border border-zinc-800 bg-zinc-900/50">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Campaign Configuration
              </span>
              <p className="text-[11px] text-zinc-500">
                Select a campaign to inspect and modify its email message and parameters
              </p>
            </div>

            <div className="w-full sm:w-64">
              <Select
                value={selectedCampaignId}
                onChange={(e) => setSelectedCampaignId(e.target.value)}
                aria-label="Select campaign to configure"
              >
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.classification})
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Active Campaign Detail Loading */}
          {isActiveCampaignLoading && (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <Spinner size="md" />
              <span className="text-xs text-zinc-500">Loading campaign details...</span>
            </div>
          )}

          {/* Active Campaign Error */}
          {isActiveCampaignError && (
            <div className="p-3 rounded border border-red-800/80 bg-red-950/40 text-xs text-red-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{getErrorMessage(activeCampaignError)}</span>
              </div>
              <Button variant="secondary" size="sm" onClick={() => refetchActiveCampaign()}>
                Retry
              </Button>
            </div>
          )}

          {/* Active Campaign Form */}
          {!isActiveCampaignLoading && activeCampaign && (
            <CampaignSettings
              campaign={activeCampaign}
              onSuccess={() => {
                setFeedbackMessage(
                  `Campaign "${activeCampaign.name}" updated successfully.`
                );
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};
