import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getAdminSession } from "@/lib/admin-auth";

export const Route = createFileRoute("/administrator")({
  beforeLoad: ({ location }) => {
    if (location.pathname === "/administrator/login") return;
    if (!getAdminSession()) {
      throw redirect({
        to: "/administrator/login",
        search: { redirect: location.pathname },
      });
    }
  },
  component: () => <Outlet />,
});
