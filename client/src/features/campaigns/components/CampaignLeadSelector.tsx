import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/app/shared/components/Input";
import { Select } from "@/app/shared/components/Select";
import { Button } from "@/app/shared/components/Button";
import { Badge } from "@/app/shared/components/Badge";
import { Spinner } from "@/app/shared/components/Spinner";
import { Pagination } from "@/app/shared/components/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/shared/components/Table";
import { useDebounce } from "@/app/shared/hooks/useDebounce";
import { useLeadsQuery } from "@/features/leads/leads.queries";
import type {
  Classification,
  LeadSource,
} from "@/features/leads/leads.types";

export interface CampaignLeadSelectorProps {
  classification: Classification;
  selectedLeadIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
}

const PAGE_SIZE = 15;

export const CampaignLeadSelector: React.FC<CampaignLeadSelectorProps> = ({
  classification,
  selectedLeadIds,
  onSelectionChange,
}) => {
  const [page, setPage] = useState(1);
  const [localSearch, setLocalSearch] = useState("");
  const [source, setSource] = useState<LeadSource | undefined>(undefined);
  const debouncedSearch = useDebounce(localSearch, 300);

  // Clear selection whenever server query params (search, source, page, classification) change
  useEffect(() => {
    setPage(1);
    onSelectionChange(new Set());
  }, [debouncedSearch, source, classification]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    onSelectionChange(new Set());
  };

  const { data, isLoading } = useLeadsQuery({
    page,
    limit: PAGE_SIZE,
    classification, // Strictly filtered to campaign classification
    ...(debouncedSearch.trim() && { search: debouncedSearch.trim() }),
    ...(source && { source }),
  });

  const leads = data?.leads || [];
  const pagination = data?.pagination || {
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  };

  // Only leads with emailStatus === "VALID" are selectable for sending
  const selectableLeadsOnPage = leads.filter(
    (l) => l.emailStatus === "VALID" && Boolean(l.email)
  );

  const isAllSelectableChecked =
    selectableLeadsOnPage.length > 0 &&
    selectableLeadsOnPage.every((l) => selectedLeadIds.has(l.id));

  const isPartiallyChecked =
    selectableLeadsOnPage.some((l) => selectedLeadIds.has(l.id)) &&
    !isAllSelectableChecked;

  const handleToggleSelectAll = () => {
    if (selectableLeadsOnPage.length === 0) return;

    if (isAllSelectableChecked) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(selectableLeadsOnPage.map((l) => l.id)));
    }
  };

  const handleToggleRow = (id: string, isValid: boolean) => {
    if (!isValid) return;

    const next = new Set(selectedLeadIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    onSelectionChange(next);
  };

  return (
    <div className="space-y-3">
      {/* Search & Source Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-zinc-500">
            <Search className="h-3.5 w-3.5" />
          </div>
          <Input
            type="text"
            placeholder="Search leads by buyer, company, or email..."
            className="pl-8 h-8 text-xs"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
          {localSearch && (
            <button
              type="button"
              onClick={() => setLocalSearch("")}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-zinc-500 hover:text-zinc-300"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="w-full sm:w-36">
          <Select
            value={source || ""}
            onChange={(e) =>
              setSource(e.target.value ? (e.target.value as LeadSource) : undefined)
            }
            aria-label="Filter leads by source"
          >
            <option value="">All Sources</option>
            <option value="GOOGLE">Google</option>
            <option value="FACEBOOK">Facebook</option>
            <option value="LINKEDIN">LinkedIn</option>
            <option value="DIRECTORY">Directory</option>
            <option value="WEBSITE">Website</option>
            <option value="CSV">CSV</option>
            <option value="OTHER">Other</option>
          </Select>
        </div>

        {selectedLeadIds.size > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelectionChange(new Set())}
            className="text-zinc-400 hover:text-zinc-200 text-xs shrink-0"
          >
            Clear selection ({selectedLeadIds.size})
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="border border-zinc-800 rounded overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <input
                  type="checkbox"
                  checked={isAllSelectableChecked}
                  ref={(input) => {
                    if (input) input.indeterminate = isPartiallyChecked;
                  }}
                  onChange={handleToggleSelectAll}
                  disabled={isLoading || selectableLeadsOnPage.length === 0}
                  className="rounded border-zinc-700 bg-zinc-900 text-blue-600 focus:ring-zinc-500 focus:ring-offset-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Select all eligible leads on current page"
                />
              </TableHead>
              <TableHead>Buyer Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Email Status</TableHead>
              <TableHead>Classification</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <tr>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Spinner size="md" />
                    <span className="text-xs text-zinc-500">Loading leads...</span>
                  </div>
                </TableCell>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <TableCell colSpan={7} className="h-32 text-center text-xs text-zinc-500">
                  No eligible leads available for this campaign.
                </TableCell>
              </tr>
            ) : (
              leads.map((lead) => {
                const isValidEmail = lead.emailStatus === "VALID" && Boolean(lead.email);
                const isSelected = selectedLeadIds.has(lead.id);

                return (
                  <TableRow
                    key={lead.id}
                    data-state={isSelected ? "selected" : undefined}
                    className={!isValidEmail ? "opacity-60 bg-zinc-950/20" : undefined}
                  >
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={!isValidEmail}
                        onChange={() => handleToggleRow(lead.id, isValidEmail)}
                        className="rounded border-zinc-700 bg-zinc-900 text-blue-600 focus:ring-zinc-500 focus:ring-offset-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-30"
                        title={
                          !isValidEmail
                            ? "Only leads with valid email can be selected for sending"
                            : undefined
                        }
                      />
                    </TableCell>
                    <TableCell className="font-medium text-zinc-200">
                      {lead.buyerName || "—"}
                    </TableCell>
                    <TableCell>{lead.companyName || "—"}</TableCell>
                    <TableCell className="font-mono text-[11px]">
                      {lead.email || "—"}
                    </TableCell>
                    <TableCell>{lead.country || "—"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          lead.emailStatus === "VALID"
                            ? "success"
                            : lead.emailStatus === "INVALID"
                            ? "danger"
                            : "warning"
                        }
                        size="sm"
                      >
                        {lead.emailStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={lead.classification === "BUSINESS" ? "info" : "neutral"}
                        size="sm"
                      >
                        {lead.classification || "Unclassified"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!isLoading && leads.length > 0 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};
