import React from "react";
import { Button } from "./Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  className,
}) => {
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  if (totalPages <= 1 && totalItems === undefined) return null;

  return (
    <div className={`flex items-center justify-between text-xs text-zinc-400 py-2 ${className || ""}`}>
      <div>
        {totalItems !== undefined ? (
          <span>
            Total <span className="text-zinc-200 font-medium">{totalItems}</span> records
          </span>
        ) : (
          <span />
        )}
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-zinc-400 mr-2">
          Page <span className="text-zinc-200 font-medium">{currentPage}</span> of{" "}
          <span className="text-zinc-200 font-medium">{Math.max(1, totalPages)}</span>
        </span>
        <Button
          variant="secondary"
          size="sm"
          disabled={!canPrev}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous Page"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span>Prev</span>
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={!canNext}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next Page"
        >
          <span>Next</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};
