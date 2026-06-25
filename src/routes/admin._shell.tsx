import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminNavbar } from "@/components/admin/admin-navbar";
import { getAdminSession, isAllowedRole } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/_shell")({
  beforeLoad: () => {
    // localStorage is client-only, so enforce on the client (after hydration).
    if (typeof window === "undefined") return;
    const session = getAdminSession();
    if (!session || !isAllowedRole(session.user)) {
      throw redirect({ to: "/admin" });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <AdminNavbar />
        <div className="flex-1 p-4 sm:p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
