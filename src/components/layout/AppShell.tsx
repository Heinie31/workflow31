import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  Bell,
  CalendarClock,
  LayoutDashboard,
  ListChecks,
  Mail,
  Menu,
  Search,
  Settings as SettingsIcon,
  X,
} from "lucide-react";

import { currentUser } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type NavItem = {
  to: "/" | "/email-assistant" | "/meeting-assistant" | "/task-planner" | "/settings";
  label: string;
  short: string;
  icon: typeof Mail;
};

const workspaceNav: NavItem[] = [
  { to: "/", label: "Dashboard", short: "Dashboard", icon: LayoutDashboard },
  { to: "/email-assistant", label: "Email Assistant", short: "Email", icon: Mail },
  { to: "/meeting-assistant", label: "Meeting Assistant", short: "Meetings", icon: CalendarClock },
  { to: "/task-planner", label: "Task Planner", short: "Planner", icon: ListChecks },
];

const systemNav: NavItem[] = [
  { to: "/settings", label: "Settings", short: "Settings", icon: SettingsIcon },
];

function NavLink({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      activeOptions={{ exact: item.to === "/" }}
      onClick={onNavigate}
      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-inkmuted transition-colors hover:bg-lumen-soft/50 hover:text-ink"
      activeProps={{
        className: "bg-lumen-soft text-ink font-medium ring-1 ring-lumen/25 hover:text-ink",
      }}
    >
      <Icon className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
      {item.label}
    </Link>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="grid size-7 place-items-center rounded-lg bg-lumen-soft font-mono text-sm font-medium text-lumen ring-1 ring-lumen/20">
        W
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-semibold tracking-tight">WorkFlow AI</span>
        {!compact && (
          <span className="block font-mono text-[10px] tracking-wider text-inkfaint">
            PRODUCTIVITY
          </span>
        )}
      </span>
    </Link>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <div className="mt-2 space-y-5 px-3">
        <div>
          <p className="wf-label mb-1.5 px-2">Workspace</p>
          <div className="space-y-0.5">
            {workspaceNav.map((item) => (
              <NavLink key={item.to} item={item} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
        <div>
          <p className="wf-label mb-1.5 px-2">System</p>
          <div className="space-y-0.5">
            {systemNav.map((item) => (
              <NavLink key={item.to} item={item} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-auto p-3">
        <div className="wf-card flex items-center gap-3 rounded-xl p-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-lumen-soft font-mono text-xs text-lumen">
            {currentUser.initials}
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-sm font-medium">{currentUser.displayName}</span>
            <span className="block truncate text-[11px] text-inkfaint">{currentUser.jobTitle}</span>
          </span>
        </div>
      </div>
    </>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-obsidian font-display text-ink antialiased">
      {/* Mobile top bar + scrollable tab nav */}
      <header className="wf-glass sticky top-0 z-30 lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Brand compact />
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="grid size-9 place-items-center rounded-lg border border-edge text-inkmuted"
            aria-label="Open navigation menu"
          >
            <Menu className="size-4" strokeWidth={1.75} />
          </button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-2">
          {[...workspaceNav, ...systemNav].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="whitespace-nowrap rounded-md px-3 py-1.5 text-xs text-inkfaint"
              activeProps={{ className: "bg-lumen-soft text-lumen font-medium" }}
            >
              {item.short}
            </Link>
          ))}
        </nav>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm"
          />
          <aside className="wf-glass absolute inset-y-0 left-0 flex w-72 flex-col">
            <div className="flex h-14 items-center justify-between px-4">
              <Brand />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="grid size-9 place-items-center rounded-lg border border-edge text-inkmuted"
                aria-label="Close navigation menu"
              >
                <X className="size-4" strokeWidth={1.75} />
              </button>
            </div>
            <SidebarBody onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:flex">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-edge bg-sidebar lg:flex">
          <div className="flex h-16 items-center px-5">
            <Brand />
          </div>
          <SidebarBody />
        </aside>

        <main className="min-w-0 flex-1">
          <div className="wf-glass sticky top-0 z-10 hidden border-b border-edge lg:block">
            <div className="flex h-16 items-center gap-3 px-6">
              <div className="flex items-center gap-2 font-mono text-xs text-inkfaint">
                <span>Thu, 3 Sep</span>
                <span className="opacity-40">/</span>
                <span>08:14</span>
              </div>
              <label className="ml-0 flex max-w-md flex-1 items-center gap-2 rounded-lg border border-edge bg-obsidian/60 px-3 py-2">
                <Search className="size-3.5 text-inkfaint" strokeWidth={1.75} aria-hidden />
                <input
                  type="search"
                  placeholder="Search tasks, meetings, drafts…"
                  className="w-full bg-transparent text-sm text-ink placeholder:text-inkfaint focus:outline-none"
                />
              </label>
              <button
                type="button"
                className="ml-auto grid size-9 place-items-center rounded-lg border border-edge text-inkmuted transition-colors hover:text-ink"
                aria-label="Notifications"
              >
                <Bell className="size-4" strokeWidth={1.75} />
              </button>
              <span className="grid size-8 place-items-center rounded-full bg-lumen-soft font-mono text-xs text-lumen ring-1 ring-lumen/20">
                {currentUser.initials}
              </span>
            </div>
          </div>

          <div className={cn("mx-auto max-w-[1500px] px-4 py-6 sm:px-6")}>{children}</div>
        </main>
      </div>
    </div>
  );
}
