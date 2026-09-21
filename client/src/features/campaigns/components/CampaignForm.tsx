import React, { useState } from "react";
import { Input } from "@/app/shared/components/Input";
import { Select } from "@/app/shared/components/Select";
import { Textarea } from "@/app/shared/components/Textarea";
import { Button } from "@/app/shared/components/Button";
import type { Classification } from "@/features/leads/leads.types";

export interface CampaignFormData {
  name: string;
  classification: Classification;
  subject: string;
  emailMessage: string;
}

export interface CampaignFormProps {
  initialValues?: Partial<CampaignFormData>;
  isLoading?: boolean;
  submitLabel?: string;
  onSubmit: (data: CampaignFormData) => void;
  onCancel: () => void;
}

const SUPPORTED_PLACEHOLDERS = [
  "{username}",
  "{companyName}",
  "{email}",
  "{website}",
  "{country}",
];

export const CampaignForm: React.FC<CampaignFormProps> = ({
  initialValues,
  isLoading = false,
  submitLabel = "Save Campaign",
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = useState(initialValues?.name || "");
  const [classification, setClassification] = useState<Classification>(
    initialValues?.classification || "BUSINESS"
  );
  const [subject, setSubject] = useState(initialValues?.subject || "");
  const [emailMessage, setEmailMessage] = useState(
    initialValues?.emailMessage || ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !subject.trim() || !emailMessage.trim()) return;

    onSubmit({
      name: name.trim(),
      classification,
      subject: subject.trim(),
      emailMessage,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Campaign Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Q4 Outreach - Tech"
          required
          disabled={isLoading}
        />

        <Select
          label="Target Classification"
          value={classification}
          onChange={(e) => setClassification(e.target.value as Classification)}
          disabled={isLoading}
          required
        >
          <option value="BUSINESS">Business</option>
          <option value="INDIVIDUAL">Individual</option>
        </Select>
      </div>

      <Input
        label="Subject Line"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="e.g. Partnership inquiry for {companyName}"
        required
        disabled={isLoading}
      />

      <div className="space-y-1.5">
        <Textarea
          label="Email Message"
          rows={6}
          value={emailMessage}
          onChange={(e) => setEmailMessage(e.target.value)}
          placeholder="Write your email template here..."
          required
          disabled={isLoading}
        />

        <div className="p-2 rounded bg-zinc-950/60 border border-zinc-800 text-[11px] text-zinc-400 space-y-1">
          <span className="font-medium text-zinc-300">
            Available Personalization Placeholders:
          </span>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {SUPPORTED_PLACEHOLDERS.map((p) => (
              <span
                key={p}
                className="inline-block px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700/80 font-mono text-[10px] text-blue-300 select-all"
              >
                {p}
              </span>
            ))}
          </div>
          <p className="text-[10px] text-zinc-500">
            The server automatically replaces placeholders with each lead's data when dispatching.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-2 pt-3 border-t border-zinc-800">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};
