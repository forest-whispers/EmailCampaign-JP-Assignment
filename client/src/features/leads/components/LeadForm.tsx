import React, { useState } from "react";
import { Input } from "@/app/shared/components/Input";
import { Select } from "@/app/shared/components/Select";
import { Button } from "@/app/shared/components/Button";
import type {
  Classification,
  EmailStatus,
  LeadSource,
} from "../leads.types";

export interface LeadFormData {
  buyerName: string;
  companyName: string;
  email: string;
  website: string;
  country: string;
  source: LeadSource;
  emailStatus?: EmailStatus;
  classification?: Classification | "";
}

export interface LeadFormProps {
  initialValues?: Partial<LeadFormData>;
  isEditMode?: boolean;
  isLoading?: boolean;
  onSubmit: (data: LeadFormData) => void;
  onCancel: () => void;
}

export const LeadForm: React.FC<LeadFormProps> = ({
  initialValues,
  isEditMode = false,
  isLoading = false,
  onSubmit,
  onCancel,
}) => {
  const [buyerName, setBuyerName] = useState(initialValues?.buyerName || "");
  const [companyName, setCompanyName] = useState(initialValues?.companyName || "");
  const [email, setEmail] = useState(initialValues?.email || "");
  const [website, setWebsite] = useState(initialValues?.website || "");
  const [country, setCountry] = useState(initialValues?.country || "");
  const [source, setSource] = useState<LeadSource>(initialValues?.source || "WEBSITE");
  const [emailStatus, setEmailStatus] = useState<EmailStatus>(
    initialValues?.emailStatus || "VALID"
  );
  const [classification, setClassification] = useState<Classification | "">(
    initialValues?.classification || ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      buyerName: buyerName.trim(),
      companyName: companyName.trim(),
      email: email.trim(),
      website: website.trim(),
      country: country.trim(),
      source,
      ...(isEditMode && {
        emailStatus,
        classification,
      }),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Buyer Name"
          value={buyerName}
          onChange={(e) => setBuyerName(e.target.value)}
          placeholder="e.g. Jane Doe"
          disabled={isLoading}
        />
        <Input
          label="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="e.g. Acme Corp"
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@company.com"
          disabled={isLoading}
        />
        <Input
          label="Website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="https://example.com"
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="e.g. United States"
          disabled={isLoading}
        />
        <Select
          label="Source"
          value={source}
          onChange={(e) => setSource(e.target.value as LeadSource)}
          disabled={isLoading}
          required
        >
          <option value="WEBSITE">Website</option>
          <option value="GOOGLE">Google</option>
          <option value="FACEBOOK">Facebook</option>
          <option value="LINKEDIN">LinkedIn</option>
          <option value="DIRECTORY">Directory</option>
          <option value="CSV">CSV</option>
          <option value="OTHER">Other</option>
        </Select>
      </div>

      {/* Edit Mode Only Fields: Email Status & Classification */}
      {isEditMode && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-zinc-800">
          <Select
            label="Email Status"
            value={emailStatus}
            onChange={(e) => setEmailStatus(e.target.value as EmailStatus)}
            disabled={isLoading}
          >
            <option value="VALID">Valid</option>
            <option value="INVALID">Invalid</option>
            <option value="MISSING">Missing</option>
          </Select>

          <Select
            label="Classification"
            value={classification}
            onChange={(e) =>
              setClassification(
                e.target.value ? (e.target.value as Classification) : ""
              )
            }
            disabled={isLoading}
          >
            <option value="">Unclassified (null)</option>
            <option value="BUSINESS">Business</option>
            <option value="INDIVIDUAL">Individual</option>
          </Select>
        </div>
      )}

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
          {isEditMode ? "Save Changes" : "Create Lead"}
        </Button>
      </div>
    </form>
  );
};
