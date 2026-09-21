import React, { useState } from "react";
import { Plus, Upload, Trash2, X, AlertCircle } from "lucide-react";
import { Button } from "@/app/shared/components/Button";
import { Pagination } from "@/app/shared/components/Pagination";
import { getErrorMessage } from "@/app/shared/utils/getErrorMessage";
import { useLeadsQuery } from "../leads.queries";
import { LeadsTable } from "../components/LeadsTable";
import { LeadFilters } from "../components/LeadFilters";
import { CreateLeadDialog } from "../components/CreateLeadDialog";
import { EditLeadDialog } from "../components/EditLeadDialog";
import { ImportCsvDialog } from "../components/ImportCsvDialog";
import { DeleteLeadsDialog } from "../components/DeleteLeadsDialog";
import { ClassificationButton } from "@/features/classification/components/ClassificationButton";
import type {
  Classification,
  EmailStatus,
  Lead,
  LeadSource,
} from "../leads.types";

const PAGE_SIZE = 20;

export const LeadsPage: React.FC = () => {
  // Query / Filter state
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [source, setSource] = useState<LeadSource | undefined>(undefined);
  const [emailStatus, setEmailStatus] = useState<EmailStatus | undefined>(
    undefined
  );
  const [classification, setClassification] = useState<Classification | undefined>(
    undefined
  );

  // Selection state (strictly local to current page)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLeadIds, setDeletingLeadIds] = useState<string[] | null>(null);

  // Notification state
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Query
  const { data, isLoading, isError, error, refetch } = useLeadsQuery({
    page,
    limit: PAGE_SIZE,
    ...(search.trim() && { search: search.trim() }),
    ...(source && { source }),
    ...(emailStatus && { emailStatus }),
    ...(classification && { classification }),
  });

  const leads = data?.leads || [];
  const pagination = data?.pagination || {
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  };

  // Helper to clear filters & reset page & clear selection
  const handleResetFilters = () => {
    setSearch("");
    setSource(undefined);
    setEmailStatus(undefined);
    setClassification(undefined);
    setPage(1);
    setSelectedIds(new Set());
  };

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
    setSelectedIds(new Set());
  };

  const handleSourceChange = (newSource?: LeadSource) => {
    setSource(newSource);
    setPage(1);
    setSelectedIds(new Set());
  };

  const handleEmailStatusChange = (newStatus?: EmailStatus) => {
    setEmailStatus(newStatus);
    setPage(1);
    setSelectedIds(new Set());
  };

  const handleClassificationChange = (newClassification?: Classification) => {
    setClassification(newClassification);
    setPage(1);
    setSelectedIds(new Set());
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setSelectedIds(new Set());
  };

  // Selection handlers
  const handleToggleSelectAll = () => {
    if (leads.length === 0) return;
    const isAllSelected = leads.every((l) => selectedIds.has(l.id));
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(leads.map((l) => l.id)));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const hasActiveFilters =
    Boolean(search.trim()) ||
    Boolean(source) ||
    Boolean(emailStatus) ||
    Boolean(classification);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div>
          <h1 className="text-base font-semibold text-zinc-100">Leads</h1>
          <p className="text-xs text-zinc-400">
            Manage contact records, status validation, and import pipelines
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <ClassificationButton
            onSuccess={(res) => {
              if (res.processedCount > 0) {
                setFeedbackMessage(
                  `${res.processedCount} lead(s) classified successfully.`
                );
              } else {
                setFeedbackMessage(
                  "No eligible leads available for classification."
                );
              }
            }}
            onError={(err) => {
              setFeedbackMessage(getErrorMessage(err));
            }}
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsImportOpen(true)}
          >
            <Upload className="h-3.5 w-3.5 mr-1" />
            Import CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Create Lead
          </Button>
        </div>
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

      {/* Query Error State */}
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

      {/* Search & Filters */}
      <LeadFilters
        search={search}
        source={source}
        emailStatus={emailStatus}
        classification={classification}
        onSearchChange={handleSearchChange}
        onSourceChange={handleSourceChange}
        onEmailStatusChange={handleEmailStatusChange}
        onClassificationChange={handleClassificationChange}
        onReset={handleResetFilters}
      />

      {/* Bulk Action Bar (rendered only when rows are selected) */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between p-2 px-3 rounded border border-blue-900/70 bg-blue-950/40 text-xs text-blue-200">
          <span className="font-medium">
            {selectedIds.size} lead{selectedIds.size === 1 ? "" : "s"} selected
          </span>
          <div className="flex items-center space-x-2">
            <Button
              variant="danger"
              size="sm"
              onClick={() => setDeletingLeadIds(Array.from(selectedIds))}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Delete Selected
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedIds(new Set())}
            >
              Clear selection
            </Button>
          </div>
        </div>
      )}

      {/* Leads Table */}
      <LeadsTable
        leads={leads}
        isLoading={isLoading}
        selectedIds={selectedIds}
        hasActiveFilters={hasActiveFilters}
        onToggleSelectAll={handleToggleSelectAll}
        onToggleSelectRow={handleToggleSelectRow}
        onEditLead={(lead) => setEditingLead(lead)}
        onDeleteLead={(lead) => setDeletingLeadIds([lead.id])}
        onCreateLead={() => setIsCreateOpen(true)}
        onImportCsv={() => setIsImportOpen(true)}
        onClearFilters={handleResetFilters}
      />

      {/* Pagination */}
      {!isLoading && leads.length > 0 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          onPageChange={handlePageChange}
        />
      )}

      {/* Dialogs */}
      <CreateLeadDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccessResult={(res) => {
          setFeedbackMessage(`Created ${res.createdCount} lead(s).`);
        }}
      />

      <ImportCsvDialog
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onSuccessResult={(res) => {
          setFeedbackMessage(
            `Imported ${res.createdCount} lead(s)${
              res.skippedCount > 0 ? `, ${res.skippedCount} skipped` : ""
            }.`
          );
        }}
      />

      <EditLeadDialog
        lead={editingLead}
        isOpen={Boolean(editingLead)}
        onClose={() => setEditingLead(null)}
        onSuccess={() => {
          setFeedbackMessage("Lead updated successfully.");
        }}
      />

      <DeleteLeadsDialog
        leadIds={deletingLeadIds || []}
        isOpen={Boolean(deletingLeadIds && deletingLeadIds.length > 0)}
        onClose={() => setDeletingLeadIds(null)}
        onSuccess={(count) => {
          setSelectedIds(new Set());
          setDeletingLeadIds(null);
          setFeedbackMessage(`Deleted ${count} lead(s).`);
        }}
      />
    </div>
  );
};
