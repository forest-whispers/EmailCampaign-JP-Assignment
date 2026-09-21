import React from "react";
import { ConfirmDialog } from "@/app/shared/components/ConfirmDialog";
import { getErrorMessage } from "@/app/shared/utils/getErrorMessage";
import { useDeleteCampaignMutation } from "../campaigns.queries";
import type { Campaign } from "../campaigns.types";

export interface DeleteCampaignDialogProps {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const DeleteCampaignDialog: React.FC<DeleteCampaignDialogProps> = ({
  campaign,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const deleteMutation = useDeleteCampaignMutation();

  if (!campaign) return null;

  const handleConfirm = () => {
    deleteMutation.mutate(campaign.id, {
      onSuccess: () => {
        onClose();
        onSuccess?.();
      },
    });
  };

  const errorMessage = deleteMutation.error
    ? getErrorMessage(deleteMutation.error)
    : null;

  return (
    <ConfirmDialog
      isOpen={isOpen}
      title="Delete Campaign"
      message={
        errorMessage
          ? `Error: ${errorMessage}`
          : `Are you sure you want to delete campaign "${campaign.name}"? This action cannot be undone.`
      }
      confirmLabel="Delete Campaign"
      cancelLabel="Cancel"
      variant="danger"
      isLoading={deleteMutation.isPending}
      onConfirm={handleConfirm}
      onCancel={onClose}
    />
  );
};
