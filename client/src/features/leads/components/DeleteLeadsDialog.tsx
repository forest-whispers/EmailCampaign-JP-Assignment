import React from "react";
import { ConfirmDialog } from "@/app/shared/components/ConfirmDialog";
import { getErrorMessage } from "@/app/shared/utils/getErrorMessage";
import { useDeleteLeadsMutation } from "../leads.queries";

export interface DeleteLeadsDialogProps {
  leadIds: string[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (count: number) => void;
}

export const DeleteLeadsDialog: React.FC<DeleteLeadsDialogProps> = ({
  leadIds,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const deleteMutation = useDeleteLeadsMutation();

  const handleConfirm = () => {
    if (leadIds.length === 0) return;

    deleteMutation.mutate(leadIds, {
      onSuccess: (res) => {
        onClose();
        onSuccess?.(res.deletedCount);
      },
    });
  };

  const count = leadIds.length;
  const message =
    count === 1
      ? "Are you sure you want to permanently delete this lead? This action cannot be undone."
      : `Are you sure you want to permanently delete ${count} selected leads? This action cannot be undone.`;

  return (
    <>
      <ConfirmDialog
        isOpen={isOpen}
        title={count === 1 ? "Delete Lead" : "Delete Selected Leads"}
        message={
          deleteMutation.error
            ? `${message}\n\nError: ${getErrorMessage(deleteMutation.error)}`
            : message
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={handleConfirm}
        onCancel={onClose}
      />
    </>
  );
};
