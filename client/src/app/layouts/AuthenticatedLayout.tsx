import React from "react";
import { Navigate } from "react-router-dom";
import { Spinner } from "../shared/components/Spinner";
import { Button } from "../shared/components/Button";
import { getErrorMessage } from "../shared/utils/getErrorMessage";
import { ApiError } from "@/lib/api";
import { useCurrentUserQuery } from "@/features/auth/auth.queries";
import { AppShell } from "./AppShell";

export const AuthenticatedLayout: React.FC = () => {
  const { data: user, isLoading, isError, error, refetch } = useCurrentUserQuery();

  // 1. While establishing current user session: show centered spinner
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // 2. If error occurs:
  if (isError) {
    const isUnauthorized = error instanceof ApiError && error.status === 401;

    // Normal unauthenticated state: smoothly redirect to /login
    if (isUnauthorized) {
      return <Navigate to="/login" replace />;
    }

    // Network errors or 5xx server errors: surface the error with retry option
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-4 text-center">
        <div className="max-w-md w-full p-6 bg-zinc-900 border border-zinc-800 rounded space-y-4">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-zinc-100">Failed to connect to service</h2>
            <p className="text-xs text-zinc-400">{getErrorMessage(error)}</p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => refetch()}>
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  // 3. Fallback: unauthenticated state
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 4. Authenticated: render shell with user session
  return <AppShell user={user} />;
};
