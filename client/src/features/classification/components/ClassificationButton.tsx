import React from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/app/shared/components/Button";
import { useClassifyLeadsMutation } from "../classification.queries";
import type { ClassifyLeadsResponse } from "../classification.types";

export interface ClassificationButtonProps {
  onSuccess?: (response: ClassifyLeadsResponse) => void;
  onError?: (error: unknown) => void;
  className?: string;
}

export const ClassificationButton: React.FC<ClassificationButtonProps> = ({
  onSuccess,
  onError,
  className,
}) => {
  const classifyMutation = useClassifyLeadsMutation();

  const handleClassify = () => {
    if (classifyMutation.isPending) return;

    classifyMutation.mutate(undefined, {
      onSuccess: (res) => {
        onSuccess?.(res);
      },
      onError: (err) => {
        onError?.(err);
      },
    });
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleClassify}
      disabled={classifyMutation.isPending}
      isLoading={classifyMutation.isPending}
      className={className}
      title="Classify next eligible batch of leads"
    >
      {!classifyMutation.isPending && (
        <Sparkles className="h-3.5 w-3.5 mr-1 text-zinc-400" />
      )}
      <span>
        {classifyMutation.isPending ? "Classifying..." : "Classify Leads"}
      </span>
    </Button>
  );
};
