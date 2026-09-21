import React from "react";
import { Modal } from "@/app/shared/components/Modal";
import { getErrorMessage } from "@/app/shared/utils/getErrorMessage";
import { useCreateCampaignMutation } from "../campaigns.queries";
import { CampaignForm, type CampaignFormData } from "./CampaignForm";
import type { Campaign } from "../campaigns.types";

export interface CreateCampaignDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (campaign: Campaign) => void;
}

export const CreateCampaignDialog: React.FC<CreateCampaignDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const createMutation = useCreateCampaignMutation();

  const handleClose = () => {
    createMutation.reset();
    onClose();
  };

  const handleSubmit = (data: CampaignFormData) => {
    createMutation.mutate(data, {
      onSuccess: (res) => {
        handleClose();
        onSuccess?.(res.campaign);
      },
    });
  };

  const errorMessage = createMutation.error
    ? getErrorMessage(createMutation.error)
    : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Campaign"
      description="Configure email template and targeting properties"
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
          submitLabel="Create Campaign"
          isLoading={createMutation.isPending}
          onSubmit={handleSubmit}
          onCancel={handleClose}
        />
      </div>
    </Modal>
  );
};
