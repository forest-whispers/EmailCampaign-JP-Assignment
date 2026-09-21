import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/app/shared/components/Button";
import { Input } from "@/app/shared/components/Input";
import { Spinner } from "@/app/shared/components/Spinner";
import { getErrorMessage } from "@/app/shared/utils/getErrorMessage";
import { useCurrentUserQuery, useLoginMutation } from "../auth.queries";

const DEMO_EMAIL = "demo@example.com";
const DEMO_PASSWORD = "Demo@123456";

export const LoginPage: React.FC = () => {
  const { data: user, isLoading: isCheckingAuth } = useCurrentUserQuery();
  const loginMutation = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
    if (!email.trim() || !password.trim()) return;

    loginMutation.mutate({ email: email.trim(), password });
  };

  const handleDemoLogin = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    loginMutation.mutate({ email: DEMO_EMAIL, password: DEMO_PASSWORD });
  };

  const errorMessage = loginMutation.error
    ? getErrorMessage(loginMutation.error)
    : null;

  return (
    <div className="space-y-4">
      <div className="space-y-1 text-center">
        <h2 className="text-sm font-semibold text-zinc-100">Sign in to your account</h2>
        <p className="text-xs text-zinc-400">Enter your credentials to access the console</p>
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
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loginMutation.isPending}
        />
        <Input
          label="Password"
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loginMutation.isPending}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          isLoading={loginMutation.isPending && email !== DEMO_EMAIL}
          disabled={loginMutation.isPending}
        >
          Sign In
        </Button>
      </form>

      {/* Quick Login / Demo Account */}
      <div className="pt-3 border-t border-zinc-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-400 font-medium">Demo Account</span>
          <span className="text-zinc-500 font-mono text-[11px]">{DEMO_EMAIL}</span>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="w-full text-xs text-zinc-300 hover:text-white"
          onClick={handleDemoLogin}
          disabled={loginMutation.isPending}
          isLoading={loginMutation.isPending && email === DEMO_EMAIL}
        >
          Login as Demo
        </Button>
      </div>

      <div className="pt-2 text-center text-xs text-zinc-400 border-t border-zinc-800">
        New here?{" "}
        <Link
          to="/register"
          className="font-medium text-zinc-200 hover:text-white underline underline-offset-4"
        >
          Register
        </Link>
      </div>
    </div>
  );
};
