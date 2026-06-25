import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Wrench,
  Settings,
  ShieldCheck,
  Tags,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navItems = [
  { to: "/administrator/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/administrator/providers", label: "Providers", icon: Wrench },
  { to: "/administrator/service-categories", label: "Service categories", icon: Tags },
  { to: "/administrator/users", label: "Users", icon: Users },
  { to: "/administrator/settings", label: "Settings", icon: Settings },
] as const;

export function AdminSidebar() {
  const { pathname } = useLocation();

  return (
    <Sidebar>
      <SidebarHeader>
        <Link to="/administrator/dashboard" className="flex items-center gap-2 px-2 py-1.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div className="leading-tight group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-semibold text-foreground">Casmara Admin</p>
            <p className="text-[11px] text-muted-foreground">Console</p>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.to}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.to)}
                  tooltip={item.label}
                >
                  <Link to={item.to}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
