import React from "react";
import { Edit2, Trash2, Plus, Upload } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/shared/components/Table";
import { Badge } from "@/app/shared/components/Badge";
import { Button } from "@/app/shared/components/Button";
import { Spinner } from "@/app/shared/components/Spinner";
import type { Classification, EmailStatus, Lead, LeadSource } from "../leads.types";

export interface LeadsTableProps {
  leads: Lead[];
  isLoading: boolean;
  selectedIds: Set<string>;
  hasActiveFilters: boolean;
  onToggleSelectAll: () => void;
  onToggleSelectRow: (id: string) => void;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (lead: Lead) => void;
  onCreateLead: () => void;
  onImportCsv: () => void;
  onClearFilters: () => void;
}

export const LeadsTable: React.FC<LeadsTableProps> = ({
  leads,
  isLoading,
  selectedIds,
  hasActiveFilters,
  onToggleSelectAll,
  onToggleSelectRow,
  onEditLead,
  onDeleteLead,
  onCreateLead,
  onImportCsv,
  onClearFilters,
}) => {
  const isAllSelected =
    leads.length > 0 && leads.every((lead) => selectedIds.has(lead.id));
  const isPartiallySelected =
    leads.some((lead) => selectedIds.has(lead.id)) && !isAllSelected;

  const renderEmailStatusBadge = (status: EmailStatus) => {
    switch (status) {
      case "VALID":
        return <Badge variant="success" size="sm">VALID</Badge>;
      case "INVALID":
        return <Badge variant="danger" size="sm">INVALID</Badge>;
      case "MISSING":
        return <Badge variant="warning" size="sm">MISSING</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{status}</Badge>;
    }
  };

  const renderClassificationBadge = (classification: Classification | null) => {
    if (!classification) {
      return (
        <Badge variant="neutral" size="sm" className="text-zinc-500 border-zinc-800">
          Unclassified
        </Badge>
      );
    }
    if (classification === "BUSINESS") {
      return <Badge variant="info" size="sm">BUSINESS</Badge>;
    }
    return <Badge variant="neutral" size="sm">INDIVIDUAL</Badge>;
  };

  const renderSourceBadge = (source: LeadSource) => {
    return (
      <Badge variant="neutral" size="sm" className="font-mono text-[10px]">
        {source}
      </Badge>
    );
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <input
                type="checkbox"
                checked={isAllSelected}
                ref={(input) => {
                  if (input) input.indeterminate = isPartiallySelected;
                }}
                onChange={onToggleSelectAll}
                disabled={isLoading || leads.length === 0}
                className="rounded border-zinc-700 bg-zinc-900 text-blue-600 focus:ring-zinc-500 focus:ring-offset-0 cursor-pointer"
                aria-label="Select all leads on current page"
              />
            </TableHead>
            <TableHead>Buyer Name</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Email Status</TableHead>
            <TableHead>Classification</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-20 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <tr>
              <TableCell colSpan={10} className="h-36 text-center">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Spinner size="md" />
                  <span className="text-xs text-zinc-500">Loading leads...</span>
                </div>
              </TableCell>
            </tr>
          ) : leads.length === 0 ? (
            <tr>
              <TableCell colSpan={10} className="h-44 text-center">
                {hasActiveFilters ? (
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <p className="text-xs text-zinc-400">No leads match your filters.</p>
                    <Button variant="secondary" size="sm" onClick={onClearFilters}>
                      Clear Filters
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-zinc-300">No leads yet</p>
                      <p className="text-[11px] text-zinc-500">
                        Create your first lead or import a CSV file.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="primary" size="sm" onClick={onCreateLead}>
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Create Lead
                      </Button>
                      <Button variant="secondary" size="sm" onClick={onImportCsv}>
                        <Upload className="h-3.5 w-3.5 mr-1" />
                        Import CSV
                      </Button>
                    </div>
                  </div>
                )}
              </TableCell>
            </tr>
          ) : (
            leads.map((lead) => {
              const isSelected = selectedIds.has(lead.id);
              return (
                <TableRow
                  key={lead.id}
                  data-state={isSelected ? "selected" : undefined}
                >
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelectRow(lead.id)}
                      className="rounded border-zinc-700 bg-zinc-900 text-blue-600 focus:ring-zinc-500 focus:ring-offset-0 cursor-pointer"
                      aria-label={`Select lead ${lead.email || lead.id}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-zinc-200">
                    {lead.buyerName || "—"}
                  </TableCell>
                  <TableCell>{lead.companyName || "—"}</TableCell>
                  <TableCell className="font-mono text-[11px]">
                    {lead.email ? (
                      <span className="text-zinc-300">{lead.email}</span>
                    ) : (
                      <span className="text-zinc-600">—</span>
                    )}
                  </TableCell>
                  <TableCell>{lead.country || "—"}</TableCell>
                  <TableCell>{renderSourceBadge(lead.source)}</TableCell>
                  <TableCell>{renderEmailStatusBadge(lead.emailStatus)}</TableCell>
                  <TableCell>{renderClassificationBadge(lead.classification)}</TableCell>
                  <TableCell className="text-zinc-500 text-[11px]">
                    {formatDate(lead.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-zinc-400 hover:text-zinc-100"
                        onClick={() => onEditLead(lead)}
                        title="Edit Lead"
                        aria-label="Edit Lead"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-zinc-400 hover:text-red-400"
                        onClick={() => onDeleteLead(lead)}
                        title="Delete Lead"
                        aria-label="Delete Lead"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};
