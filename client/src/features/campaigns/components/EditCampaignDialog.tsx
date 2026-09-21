import React from "react";
import { Modal } from "@/app/shared/components/Modal";
import { getErrorMessage } from "@/app/shared/utils/getErrorMessage";
import { useUpdateCampaignMutation } from "../campaigns.queries";
import { CampaignForm, type CampaignFormData } from "./CampaignForm";
import type { Campaign } from "../campaigns.types";

export interface EditCampaignDialogProps {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const EditCampaignDialog: React.FC<EditCampaignDialogProps> = ({
  campaign,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const updateMutation = useUpdateCampaignMutation();

  if (!campaign) return null;

  const handleClose = () => {
    updateMutation.reset();
    onClose();
  };

  const handleSubmit = (data: CampaignFormData) => {
    updateMutation.mutate(
      {
        id: campaign.id,
        data: {
          name: data.name,
          classification: data.classification,
          subject: data.subject,
          emailMessage: data.emailMessage,
        },
      },
      {
        onSuccess: () => {
          handleClose();
          onSuccess?.();
        },
      }
    );
  };

  const errorMessage = updateMutation.error
    ? getErrorMessage(updateMutation.error)
    : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Campaign"
      description="Update campaign configuration and email message"
    >
      <div className="space-y-3">
        {errorMessage && (
          <div
            role="alert"
            className="p-2.5 rounded border border-red-800/80 bg-red-950/40 text-xs text-red-300"
          >
            {errorMessage}
          </div>
        )}

        <CampaignForm
          initialValues={{
            name: campaign.name,
            classification: campaign.classification,
            subject: campaign.subject,
            emailMessage: campaign.emailMessage,
          }}
          submitLabel="Save Changes"
          isLoading={updateMutation.isPending}
          onSubmit={handleSubmit}
          onCancel={handleClose}
        />
      </div>
    </Modal>
  );
};
