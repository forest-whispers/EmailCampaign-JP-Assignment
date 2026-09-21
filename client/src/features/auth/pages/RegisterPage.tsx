import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/app/shared/components/Button";
import { Input } from "@/app/shared/components/Input";
import { Spinner } from "@/app/shared/components/Spinner";
import { getErrorMessage } from "@/app/shared/utils/getErrorMessage";
import { useCurrentUserQuery, useRegisterMutation } from "../auth.queries";

export const RegisterPage: React.FC = () => {
  const { data: user, isLoading: isCheckingAuth } = useCurrentUserQuery();
  const registerMutation = useRegisterMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  // If already authenticated, redirect to /dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Brief initial loading state while checking session
  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center py-10">
        <Spinner size="md" />
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) return;

    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    // Only send email and password to backend (Confirm Password is frontend-only)
    registerMutation.mutate({
      email: trimmedEmail,
      password,
    });
  };

  const errorMessage =
    localError ||
    (registerMutation.error ? getErrorMessage(registerMutation.error) : null);

  return (
    <div className="space-y-4">
      <div className="space-y-1 text-center">
        <h2 className="text-sm font-semibold text-zinc-100">Create your account</h2>
        <p className="text-xs text-zinc-400">Enter your details to get started</p>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="p-2.5 rounded border border-red-800/80 bg-red-950/40 text-xs text-red-300"
        >
          {errorMessage}
        </div>
      )}

      <form className="space-y-3" onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (localError) setLocalError(null);
          }}
          required
          disabled={registerMutation.isPending}
        />
        <Input
          label="Password"
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (localError) setLocalError(null);
          }}
          required
          minLength={8}
          disabled={registerMutation.isPending}
        />
        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Repeat your password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (localError) setLocalError(null);
          }}
          required
          minLength={8}
          disabled={registerMutation.isPending}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          isLoading={registerMutation.isPending}
          disabled={registerMutation.isPending}
        >
          Create Account
        </Button>
      </form>

      <div className="pt-2 text-center text-xs text-zinc-400 border-t border-zinc-800">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-zinc-200 hover:text-white underline underline-offset-4"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};
