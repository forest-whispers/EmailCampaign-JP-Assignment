import React from "react";
import { Outlet, Link } from "react-router-dom";

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <Link to="/" className="inline-block">
            <h1 className="text-sm font-semibold tracking-wider uppercase text-zinc-200">
              EXPORT Automation
            </h1>
          </Link>
          <p className="text-xs text-zinc-500 mt-1">Internal Operations Portal</p>
        </div>
        <div className="bg-zinc-900/60 border border-zinc-800 rounded p-6 shadow-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
