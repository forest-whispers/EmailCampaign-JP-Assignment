import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/app/shared/components/Button";
import { Input } from "@/app/shared/components/Input";

export const RegisterPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="space-y-1 text-center">
        <h2 className="text-sm font-semibold text-zinc-100">Create an account</h2>
        <p className="text-xs text-zinc-400">Register to access EXPORT automation</p>
      </div>

      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Input label="Name" type="text" placeholder="Full name" disabled />
        <Input label="Email" type="email" placeholder="name@company.com" disabled />
        <Input label="Password" type="password" placeholder="••••••••" disabled />

        <Button variant="primary" className="w-full mt-2" disabled>
          Register
        </Button>
      </form>

      <div className="text-center text-xs text-zinc-500 pt-2 border-t border-zinc-800/80">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-400 hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
};
