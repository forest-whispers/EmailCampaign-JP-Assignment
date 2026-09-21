import React, { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/app/shared/components/Input";
import { Select } from "@/app/shared/components/Select";
import { Button } from "@/app/shared/components/Button";
import { useDebounce } from "@/app/shared/hooks/useDebounce";
import type { Classification, EmailStatus, LeadSource } from "../leads.types";

export interface LeadFiltersProps {
  search: string;
  source?: LeadSource;
  emailStatus?: EmailStatus;
  classification?: Classification;
  onSearchChange: (search: string) => void;
  onSourceChange: (source?: LeadSource) => void;
  onEmailStatusChange: (status?: EmailStatus) => void;
  onClassificationChange: (classification?: Classification) => void;
  onReset: () => void;
}

export const LeadFilters: React.FC<LeadFiltersProps> = ({
  search,
  source,
  emailStatus,
  classification,
  onSearchChange,
  onSourceChange,
  onEmailStatusChange,
  onClassificationChange,
  onReset,
}) => {
  // Local state for debounced search
  const [localSearch, setLocalSearch] = useState(search);
  const debouncedSearch = useDebounce(localSearch, 300);

  // Sync debounced search with parent
  useEffect(() => {
    if (debouncedSearch !== search) {
      onSearchChange(debouncedSearch);
    }
  }, [debouncedSearch, onSearchChange, search]);

  // Sync parent search back if reset externally
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const hasActiveFilters =
    Boolean(localSearch.trim()) ||
    Boolean(source) ||
    Boolean(emailStatus) ||
    Boolean(classification);

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pb-3">
      {/* Search Input */}
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-zinc-500">
          <Search className="h-3.5 w-3.5" />
        </div>
        <Input
          type="text"
          placeholder="Search by buyer, company, or email..."
          className="pl-8"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
        {localSearch && (
          <button
            type="button"
            onClick={() => {
              setLocalSearch("");
              onSearchChange("");
            }}
            className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-zinc-500 hover:text-zinc-300"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Source Filter */}
      <div className="w-full sm:w-36">
        <Select
          value={source || ""}
          onChange={(e) =>
            onSourceChange(e.target.value ? (e.target.value as LeadSource) : undefined)
          }
          aria-label="Filter by source"
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

      {/* Email Status Filter */}
      <div className="w-full sm:w-36">
        <Select
          value={emailStatus || ""}
          onChange={(e) =>
            onEmailStatusChange(
              e.target.value ? (e.target.value as EmailStatus) : undefined
            )
          }
          aria-label="Filter by email status"
        >
          <option value="">All Email Status</option>
          <option value="VALID">Valid</option>
          <option value="INVALID">Invalid</option>
          <option value="MISSING">Missing</option>
        </Select>
      </div>

      {/* Classification Filter */}
      <div className="w-full sm:w-36">
        <Select
          value={classification || ""}
          onChange={(e) =>
            onClassificationChange(
              e.target.value ? (e.target.value as Classification) : undefined
            )
          }
          aria-label="Filter by classification"
        >
          <option value="">All Classifications</option>
          <option value="BUSINESS">Business</option>
          <option value="INDIVIDUAL">Individual</option>
        </Select>
      </div>

      {/* Reset Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setLocalSearch("");
            onReset();
          }}
          className="text-zinc-400 hover:text-zinc-200 shrink-0"
        >
          Reset
        </Button>
      )}
    </div>
  );
};
