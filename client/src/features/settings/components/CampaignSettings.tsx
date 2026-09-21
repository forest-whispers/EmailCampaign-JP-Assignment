import React from "react";
import { getErrorMessage } from "@/app/shared/utils/getErrorMessage";
import { CampaignForm, type CampaignFormData } from "@/features/campaigns/components/CampaignForm";
import { useUpdateCampaignMutation } from "@/features/campaigns/campaigns.queries";
import type { Campaign, UpdateCampaignInput } from "@/features/campaigns/campaigns.types";

export interface CampaignSettingsProps {
  campaign: Campaign;
  onSuccess?: () => void;
}

export const CampaignSettings: React.FC<CampaignSettingsProps> = ({
  campaign,
  onSuccess,
}) => {
  const updateMutation = useUpdateCampaignMutation();

  const handleSubmit = (data: CampaignFormData) => {
    // Only send fields to update
    const updates: UpdateCampaignInput = {};
    if (data.name !== campaign.name) updates.name = data.name;
    if (data.classification !== campaign.classification)
      updates.classification = data.classification;
    if (data.subject !== campaign.subject) updates.subject = data.subject;
    if (data.emailMessage !== campaign.emailMessage)
      updates.emailMessage = data.emailMessage;

    // If nothing changed, we can still submit to confirm or trigger callback
    const payload = Object.keys(updates).length > 0 ? updates : { ...data };

    updateMutation.mutate(
      { id: campaign.id, data: payload },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      }
    );
  };

  const errorMessage = updateMutation.error
    ? getErrorMessage(updateMutation.error)
    : null;

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div
          role="alert"
          className="p-2.5 rounded border border-red-800/80 bg-red-950/40 text-xs text-red-300"
        >
          {errorMessage}
        </div>
      )}

      <div className="p-4 rounded border border-zinc-800 bg-zinc-900/40">
        <CampaignForm
          key={campaign.id} // Re-initialize form whenever selected campaign changes
          initialValues={{
            name: campaign.name,
            classification: campaign.classification,
            subject: campaign.subject,
            emailMessage: campaign.emailMessage,
          }}
          submitLabel="Save Changes"
          isLoading={updateMutation.isPending}
          onSubmit={handleSubmit}
          onCancel={() => {
            // No-op or reset form
          }}
        />
      </div>
    </div>
  );
};
