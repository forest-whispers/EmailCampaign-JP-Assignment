import React, { useState } from "react";
import { Send, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";
import { Modal } from "@/app/shared/components/Modal";
import { Button } from "@/app/shared/components/Button";
import { getErrorMessage } from "@/app/shared/utils/getErrorMessage";
import { useSendCampaignMutation } from "../campaigns.queries";
import type { SendCampaignResponse } from "../campaigns.types";

export interface SendCampaignDialogProps {
  campaignId: string;
  campaignName: string;
  selectedLeadIds: string[];
  isOpen: boolean;
  onClose: () => void;
  onSuccessResult?: (res: SendCampaignResponse) => void;
}

export const SendCampaignDialog: React.FC<SendCampaignDialogProps> = ({
  campaignId,
  campaignName,
  selectedLeadIds,
  isOpen,
  onClose,
  onSuccessResult,
}) => {
  const sendMutation = useSendCampaignMutation();
  const [result, setResult] = useState<SendCampaignResponse | null>(null);

  const handleClose = () => {
    setResult(null);
    sendMutation.reset();
    onClose();
  };

  const handleConfirmSend = () => {
    if (selectedLeadIds.length === 0 || sendMutation.isPending) return;

    sendMutation.mutate(
      { id: campaignId, leadIds: selectedLeadIds },
      {
        onSuccess: (res) => {
          setResult(res);
          onSuccessResult?.(res);
        },
      }
    );
  };

  const errorMessage = sendMutation.error
    ? getErrorMessage(sendMutation.error)
    : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Dispatch Campaign"
      description="Send personalized emails to selected leads"
    >
      <div className="space-y-4">
        {errorMessage && (
          <div
            role="alert"
            className="p-2.5 rounded border border-red-800/80 bg-red-950/40 text-xs text-red-300 flex items-start gap-2"
          >
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {result ? (
          <div className="space-y-3 py-1">
            <div className="p-3 rounded border border-zinc-800 bg-zinc-950/50 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-medium">
                <CheckCircle2 className="h-4 w-4" />
                <span>Campaign Dispatched</span>
              </div>
              <p className="text-zinc-300">
                Successfully sent:{" "}
                <strong className="text-zinc-100">{result.sentCount}</strong> email(s).
              </p>

              {result.skippedCount > 0 && (
                <div className="pt-2 border-t border-zinc-800/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-400 font-medium">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>Skipped recipients: {result.skippedCount}</span>
                  </div>
                  <div className="max-h-32 overflow-y-auto space-y-0.5 pr-1">
                    {result.skipped.map((s, idx) => (
                      <p key={idx} className="text-[11px] text-zinc-400 font-mono">
                        Lead {s.leadId.slice(0, 8)}...: {s.reason}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button variant="secondary" size="sm" onClick={handleClose}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-2 text-xs text-zinc-300">
              <div className="p-3 rounded border border-zinc-800 bg-zinc-950/40 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Campaign:</span>
                  <span className="font-medium text-zinc-200">{campaignName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Selected Recipients:</span>
                  <span className="font-semibold text-blue-400">
                    {selectedLeadIds.length} lead(s)
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-zinc-400">
                The backend will personalize message placeholders and deliver emails with the presentation PDF attachment.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-zinc-800">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleClose}
                disabled={sendMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirmSend}
                disabled={selectedLeadIds.length === 0 || sendMutation.isPending}
                isLoading={sendMutation.isPending}
              >
                <Send className="h-3.5 w-3.5 mr-1.5" />
                <span>{sendMutation.isPending ? "Sending..." : "Send Now"}</span>
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
