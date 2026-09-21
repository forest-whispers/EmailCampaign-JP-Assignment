import React from "react";
import { AppShell } from "./AppShell";

export const AuthenticatedLayout: React.FC = () => {
  // Authentication boundary: Future auth check/guard will be connected here.
  return <AppShell />;
};
