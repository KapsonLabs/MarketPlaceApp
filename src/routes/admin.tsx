import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getAdminSession } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin")({
  beforeLoad: ({ location }) => {
    if (location.pathname === "/admin/login") return;
    if (!getAdminSession()) {
      throw redirect({
        to: "/admin/login",
        search: { redirect: location.pathname },
      });
    }
  },
  component: () => <Outlet />,
});
