import { useNavigate, useLocation } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { clearAdminSession, useAdminSession } from "@/lib/admin-auth";

const titles: Record<string, string> = {
  "/administrator/dashboard": "Service requests",
  "/administrator/requests": "Service requests",
  "/administrator/providers": "Providers",
  "/administrator/service-categories": "Service categories",
  "/administrator/users": "Users",
  "/administrator/settings": "Settings",
};

export function AdminNavbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const session = useAdminSession();
  const title =
    Object.entries(titles).find(([path]) => pathname.startsWith(path))?.[1] ??
    "Admin";
  const identity =
    session?.user.email || session?.user.username || "Signed in";

  function onLogout() {
    clearAdminSession();
    navigate({ to: "/administrator" });
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-6" />
      <h1 className="text-sm font-semibold text-foreground">{title}</h1>
      <div className="ml-auto flex items-center gap-2">
        <span className="hidden max-w-[180px] truncate text-xs text-muted-foreground sm:inline">
          {identity}
        </span>
        <Button type="button" variant="ghost" size="sm" onClick={onLogout}>
          <LogOut className="mr-1 h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}
