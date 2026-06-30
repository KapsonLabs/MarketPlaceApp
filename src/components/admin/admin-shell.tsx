import { Link, useRouter } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Inbox,
  Users,
  ListChecks,
  Wallet,
  Search,
  LogOut,
} from "lucide-react";
import type { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/admin/notification-bell";
import { clearAdminSession, useAdminSession } from "@/lib/admin-auth";
import { useNotificationSocket } from "@/lib/notifications.ws";

const navItems = [
  { to: "/administrator", label: "Dashboard", icon: LayoutDashboard },
  { to: "/administrator/requests", label: "Requests", icon: Inbox },
  { to: "/administrator/providers", label: "Providers", icon: Users },
  { to: "/administrator/tasks", label: "Work Orders", icon: ListChecks },
  { to: "/administrator/payments", label: "Payments", icon: Wallet },
] as const;

export function AdminShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const router = useRouter();
  const session = useAdminSession();
  const user = session?.user;
  useNotificationSocket();
  const displayName =
    user && `${user.first_name} ${user.last_name}`.trim()
      ? `${user.first_name} ${user.last_name}`.trim()
      : (user?.username ?? "Admin");

  function handleSignOut() {
    clearAdminSession();
    router.navigate({ to: "/administrator/login" });
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <aside className="hidden h-screen w-64 shrink-0 flex-col overflow-y-auto border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold">
            H
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Casmara Systems</p>
            <p className="text-[11px] text-sidebar-foreground/70">Admin console</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                activeOptions={{ exact: item.to === "/administrator" }}
                activeProps={{
                  className:
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm bg-sidebar-primary text-sidebar-primary-foreground font-medium",
                }}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-3 rounded-md px-2 py-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                {displayName.slice(0, 2).toUpperCase() || "AO"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-sm font-medium">{displayName}</p>
              <p className="truncate text-[11px] text-sidebar-foreground/60">{user?.email}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="h-7 w-7 shrink-0 text-sidebar-foreground/60 hover:text-sidebar-foreground"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="z-30 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background px-4 md:px-8">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search requests, providers, payments…"
              className="pl-9"
            />
          </div>
          <NotificationBell />
          <Avatar className="h-8 w-8 md:hidden">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              AO
            </AvatarFallback>
          </Avatar>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
              {description && (
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
              )}
            </div>
            {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
