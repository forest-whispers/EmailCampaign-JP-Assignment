import React from "react";

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="border-b border-zinc-800 pb-3">
        <h1 className="text-base font-semibold text-zinc-100">Dashboard</h1>
        <p className="text-xs text-zinc-400">System metrics and operational status</p>
      </div>

      <div className="p-4 rounded border border-zinc-800/80 bg-zinc-900/30 text-xs text-zinc-500">
        Dashboard module pending implementation.
      </div>
    </div>
  );
};
