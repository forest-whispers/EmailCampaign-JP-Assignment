import React from "react";
import { Trash2, ExternalLink, Plus } from "lucide-react";
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
import type { Campaign } from "../campaigns.types";

export interface CampaignListProps {
  campaigns: Campaign[];
  isLoading: boolean;
  onOpen: (campaign: Campaign) => void;
  onDelete: (campaign: Campaign) => void;
  onCreate: () => void;
}

export const CampaignList: React.FC<CampaignListProps> = ({
  campaigns,
  isLoading,
  onOpen,
  onDelete,
  onCreate,
}) => {
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
            <TableHead>Campaign Name</TableHead>
            <TableHead>Classification</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead className="w-24 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <tr>
              <TableCell colSpan={5} className="h-36 text-center">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Spinner size="md" />
                  <span className="text-xs text-zinc-500">Loading campaigns...</span>
                </div>
              </TableCell>
            </tr>
          ) : campaigns.length === 0 ? (
            <tr>
              <TableCell colSpan={5} className="h-44 text-center">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-zinc-300">
                      No campaigns yet
                    </p>
                    <p className="text-[11px] text-zinc-500">
                      Create your first campaign to start outreach.
                    </p>
                  </div>
                  <Button variant="primary" size="sm" onClick={onCreate}>
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Create Campaign
                  </Button>
                </div>
              </TableCell>
            </tr>
          ) : (
            campaigns.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium text-zinc-200">
                  <button
                    onClick={() => onOpen(c)}
                    className="hover:text-blue-400 transition-colors text-left font-semibold"
                  >
                    {c.name}
                  </button>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={c.classification === "BUSINESS" ? "info" : "neutral"}
                    size="sm"
                  >
                    {c.classification}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-xs truncate text-zinc-300">
                  {c.subject}
                </TableCell>
                <TableCell className="text-zinc-500 text-[11px]">
                  {formatDate(c.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-zinc-300 hover:text-white"
                      onClick={() => onOpen(c)}
                      title="Open Campaign Details"
                    >
                      <span>Open</span>
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-zinc-400 hover:text-red-400"
                      onClick={() => onDelete(c)}
                      title="Delete Campaign"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
