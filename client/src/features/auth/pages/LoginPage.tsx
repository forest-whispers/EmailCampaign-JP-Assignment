import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/app/shared/components/Button";
import { Input } from "@/app/shared/components/Input";

export const LoginPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="space-y-1 text-center">
        <h2 className="text-sm font-semibold text-zinc-100">Sign in to your account</h2>
        <p className="text-xs text-zinc-400">Enter your credentials to access the console</p>
      </div>

      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Input
          label="Email"
          type="email"
          placeholder="name@company.com"
          disabled
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          disabled
        />

        <Button variant="primary" className="w-full mt-2" disabled>
          Sign In
        </Button>
      </form>

      <div className="text-center text-xs text-zinc-500 pt-2 border-t border-zinc-800/80">
        Authentication feature pending implementation.
        <div className="mt-2">
          <Link to="/dashboard" className="text-blue-400 hover:underline">
            Go to Console Shell &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};
