import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, X, AlertCircle } from "lucide-react";
import { Button } from "@/app/shared/components/Button";
import { getErrorMessage } from "@/app/shared/utils/getErrorMessage";
import { useCampaignsQuery } from "../campaigns.queries";
import { CampaignList } from "../components/CampaignList";
import { CreateCampaignDialog } from "../components/CreateCampaignDialog";
import { DeleteCampaignDialog } from "../components/DeleteCampaignDialog";
import type { Campaign } from "../campaigns.types";

export const CampaignsPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: campaigns = [], isLoading, isError, error, refetch } =
    useCampaignsQuery();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deletingCampaign, setDeletingCampaign] = useState<Campaign | null>(
    null
  );
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleOpen = (campaign: Campaign) => {
    navigate(`/campaigns/${campaign.id}`);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div>
          <h1 className="text-base font-semibold text-zinc-100">Campaigns</h1>
          <p className="text-xs text-zinc-400">
            Create, manage, and dispatch outreach email campaigns
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsCreateOpen(true)}
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Create Campaign
        </Button>
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

      {/* Campaign List */}
      <CampaignList
        campaigns={campaigns}
        isLoading={isLoading}
        onOpen={handleOpen}
        onDelete={(c) => setDeletingCampaign(c)}
        onCreate={() => setIsCreateOpen(true)}
      />

      {/* Create Dialog */}
      <CreateCampaignDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={(created) => {
          setFeedbackMessage(`Campaign "${created.name}" created successfully.`);
        }}
      />

      {/* Delete Dialog */}
      <DeleteCampaignDialog
        campaign={deletingCampaign}
        isOpen={Boolean(deletingCampaign)}
        onClose={() => setDeletingCampaign(null)}
        onSuccess={() => {
          setFeedbackMessage("Campaign deleted successfully.");
        }}
      />
    </div>
  );
};
