import React from "react";
import { Modal } from "@/app/shared/components/Modal";
import { getErrorMessage } from "@/app/shared/utils/getErrorMessage";
import { useUpdateLeadMutation } from "../leads.queries";
import { LeadForm, type LeadFormData } from "./LeadForm";
import type { Lead, UpdateLeadInput } from "../leads.types";

export interface EditLeadDialogProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const EditLeadDialog: React.FC<EditLeadDialogProps> = ({
  lead,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const updateMutation = useUpdateLeadMutation();

  if (!lead) return null;

  const handleClose = () => {
    updateMutation.reset();
    onClose();
  };

  const handleSubmit = (data: LeadFormData) => {
    const isEmailChanged = data.email !== (lead.email || "");
    const isStatusChanged = data.emailStatus !== lead.emailStatus;

    const updates: UpdateLeadInput = {
      buyerName: data.buyerName || null,
      companyName: data.companyName || null,
      email: data.email || null,
      website: data.website || null,
      country: data.country || null,
      source: data.source,
      classification: data.classification ? data.classification : null,
    };

    // If email is changed and user left Email Status unchanged,
    // omit emailStatus so the backend applies its deterministic logic.
    // If user explicitly changed Email Status, send that value.
    if (isStatusChanged || !isEmailChanged) {
      if (data.emailStatus) {
        updates.emailStatus = data.emailStatus;
      }
    }

    updateMutation.mutate(
      { id: lead.id, updates },
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
      title="Edit Lead"
      description="Update contact information and properties"
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

        <LeadForm
          isEditMode={true}
          isLoading={updateMutation.isPending}
          initialValues={{
            buyerName: lead.buyerName || "",
            companyName: lead.companyName || "",
            email: lead.email || "",
            website: lead.website || "",
            country: lead.country || "",
            source: lead.source,
            emailStatus: lead.emailStatus,
            classification: lead.classification || "",
          }}
          onSubmit={handleSubmit}
          onCancel={handleClose}
        />
      </div>
    </Modal>
  );
};
