import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Users, Send, LogOut } from "lucide-react";
import { Button } from "../shared/components/Button";
import { useLogoutMutation } from "@/features/auth/auth.queries";
import type { AuthUser } from "@/features/auth/auth.types";

export interface AppShellProps {
  user?: AuthUser;
}

export const AppShell: React.FC<AppShellProps> = ({ user }) => {
  const { mutate: logout, isPending: isLoggingOut } = useLogoutMutation();

  const navItems = [
    { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { label: "Leads", to: "/leads", icon: Users },
    { label: "Campaigns", to: "/campaigns", icon: Send },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] text-zinc-100 antialiased">
      {/* Top Header */}
      <header className="h-11 border-b border-zinc-800 bg-zinc-950 px-4 flex items-center justify-between select-none">
        <div className="flex items-center space-x-2.5">
          <span className="font-semibold text-xs tracking-wider uppercase text-zinc-200">
            EXPORT Automation
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" title="System Online" />
        </div>

        <div className="flex items-center space-x-3">
          {user?.email && (
            <span className="text-xs text-zinc-400 font-mono hidden sm:inline-block">
              {user.email}
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="text-zinc-400 hover:text-zinc-200 text-xs px-2"
            onClick={() => logout()}
            isLoading={isLoggingOut}
            disabled={isLoggingOut}
          >
            <LogOut className="h-3.5 w-3.5 mr-1.5" />
            <span>Logout</span>
          </Button>
        </div>
      </header>

      {/* Main Container: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-52 border-r border-zinc-800 bg-zinc-950/80 flex flex-col justify-between p-2 select-none">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 text-xs rounded transition-colors ${
                      isActive
                        ? "bg-zinc-800 text-zinc-100 font-medium"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                    }`
                  }
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="p-2 border-t border-zinc-900 text-[11px] text-zinc-600">
            v1.0.0 &bull; Internal
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[#09090b] p-6">
          <Outlet context={{ user }} />
        </main>
      </div>
    </div>
  );
};
