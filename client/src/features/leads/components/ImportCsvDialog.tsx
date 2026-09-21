import React, { useRef, useState } from "react";
import { Upload, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import { Modal } from "@/app/shared/components/Modal";
import { Button } from "@/app/shared/components/Button";
import { getErrorMessage } from "@/app/shared/utils/getErrorMessage";
import { useImportCsvMutation } from "../leads.queries";
import type { CreateLeadsResponse } from "../leads.types";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB limit

export interface ImportCsvDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessResult?: (result: CreateLeadsResponse) => void;
}

export const ImportCsvDialog: React.FC<ImportCsvDialogProps> = ({
  isOpen,
  onClose,
  onSuccessResult,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [result, setResult] = useState<CreateLeadsResponse | null>(null);

  const importMutation = useImportCsvMutation();

  const handleClose = () => {
    setSelectedFile(null);
    setFileError(null);
    setResult(null);
    importMutation.reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    setResult(null);

    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setFileError("Only .csv files are supported.");
      setSelectedFile(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileError("File exceeds the 5 MB size limit.");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleImport = () => {
    if (!selectedFile) return;

    importMutation.mutate(selectedFile, {
      onSuccess: (res) => {
        setResult(res);
        onSuccessResult?.(res);
      },
    });
  };

  const errorMessage = importMutation.error
    ? getErrorMessage(importMutation.error)
    : fileError;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Import Leads from CSV"
      description="Upload a CSV file containing contact leads"
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
                <span>Import Completed</span>
              </div>
              <p className="text-zinc-300">
                Successfully created:{" "}
                <strong className="text-zinc-100">{result.createdCount}</strong>{" "}
                leads.
              </p>
              {result.skippedCount > 0 && (
                <div className="pt-2 border-t border-zinc-800/60 space-y-1">
                  <p className="text-amber-400 font-medium">
                    Skipped duplicates: {result.skippedCount}
                  </p>
                  <div className="max-h-32 overflow-y-auto space-y-0.5 pr-1">
                    {result.skipped.map((s, idx) => (
                      <p key={idx} className="text-[11px] text-zinc-400 font-mono">
                        {s.email || "Lead"}: {s.reason}
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
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileChange}
                className="hidden"
                id="csv-file-input"
              />

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={importMutation.isPending}
                >
                  <Upload className="h-3.5 w-3.5 mr-1.5" />
                  Choose CSV File
                </Button>

                {selectedFile ? (
                  <div className="flex items-center gap-1.5 text-xs text-zinc-300 truncate">
                    <FileText className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                    <span className="truncate">{selectedFile.name}</span>
                    <span className="text-zinc-500 text-[11px]">
                      ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-zinc-500">No file selected</span>
                )}
              </div>

              <p className="text-[11px] text-zinc-500">
                Supported columns: <code>name</code>, <code>company</code>,{" "}
                <code>email</code>, <code>website</code>, <code>country</code>. Maximum
                size: 5 MB.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-zinc-800">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleClose}
                disabled={importMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleImport}
                disabled={!selectedFile || importMutation.isPending}
                isLoading={importMutation.isPending}
              >
                {importMutation.isPending ? "Importing..." : "Import"}
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
