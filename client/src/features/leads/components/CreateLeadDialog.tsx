import React, { useState } from "react";
import { Modal } from "@/app/shared/components/Modal";
import { Button } from "@/app/shared/components/Button";
import { getErrorMessage } from "@/app/shared/utils/getErrorMessage";
import { useCreateLeadsMutation } from "../leads.queries";
import { LeadForm, type LeadFormData } from "./LeadForm";
import type { CreateLeadsResponse } from "../leads.types";

export interface CreateLeadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessResult?: (result: CreateLeadsResponse) => void;
}

export const CreateLeadDialog: React.FC<CreateLeadDialogProps> = ({
  isOpen,
  onClose,
  onSuccessResult,
}) => {
  const createMutation = useCreateLeadsMutation();
  const [result, setResult] = useState<CreateLeadsResponse | null>(null);

  const handleClose = () => {
    setResult(null);
    createMutation.reset();
    onClose();
  };

  const handleSubmit = (data: LeadFormData) => {
    createMutation.mutate(
      {
        leads: [
          {
            ...(data.buyerName && { buyerName: data.buyerName }),
            ...(data.companyName && { companyName: data.companyName }),
            email: data.email || null,
            ...(data.website && { website: data.website }),
            ...(data.country && { country: data.country }),
            source: data.source,
          },
        ],
      },
      {
        onSuccess: (res) => {
          if (res.skippedCount > 0) {
            // Show duplicate skipped notification inside dialog
            setResult(res);
          } else {
            handleClose();
            onSuccessResult?.(res);
          }
        },
      }
    );
  };

  const errorMessage = createMutation.error
    ? getErrorMessage(createMutation.error)
    : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Lead"
      description="Add a new lead to your contacts repository"
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

        {result ? (
          <div className="space-y-3 py-2">
            <div className="p-3 rounded border border-amber-800/80 bg-amber-950/30 text-xs text-amber-300 space-y-1">
              <p className="font-semibold">
                Created: {result.createdCount} &bull; Skipped: {result.skippedCount}
              </p>
              {result.skipped.map((s, idx) => (
                <p key={idx} className="text-[11px] text-zinc-400">
                  {s.email || "Lead"}: {s.reason}
                </p>
              ))}
            </div>
            <div className="flex justify-end">
              <Button variant="secondary" size="sm" onClick={handleClose}>
                Close
              </Button>
            </div>
          </div>
        ) : (
          <LeadForm
            isEditMode={false}
            isLoading={createMutation.isPending}
            onSubmit={handleSubmit}
            onCancel={handleClose}
          />
        )}
      </div>
    </Modal>
  );
};
