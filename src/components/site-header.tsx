import { Link, useNavigate } from "@tanstack/react-router";
import { Home, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrentUser, signOutUser } from "@/lib/current-user";

export function SiteHeader() {
  const user = useCurrentUser();
  const navigate = useNavigate();

  function onSignOut() {
    signOutUser();
    navigate({ to: "/" });
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Home className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-foreground">Casmara Systems</p>
            <p className="text-[11px] text-muted-foreground">Service marketplace</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            to="/providers"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "text-sm font-medium text-foreground" }}
          >
            Browse providers
          </Link>
          <Link
            to="/materials"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "text-sm font-medium text-foreground" }}
          >
            Materials
          </Link>
          <Link
            to="/requests"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "text-sm font-medium text-foreground" }}
          >
            My requests
          </Link>
          <Link
            to="/billing"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "text-sm font-medium text-foreground" }}
          >
            Billing
          </Link>
          <Link
            to="/how-it-works"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "text-sm font-medium text-foreground" }}
          >
            How it works
          </Link>
          <Link
            to="/for-providers"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "text-sm font-medium text-foreground" }}
          >
            For providers
          </Link>
          <Link
            to="/admin"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "text-sm font-medium text-foreground" }}
          >
            Admin
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden max-w-[140px] truncate text-xs text-muted-foreground sm:inline">
                {user.name}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
                onClick={onSignOut}
              >
                <LogOut className="mr-1 h-4 w-4" />
                Sign out
              </Button>
            </>
          ) : (
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/sign-in">Sign in</Link>
            </Button>
          )}
          <Button asChild size="sm">
            <Link to="/request">Request service</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row">
        <p>© {new Date().getFullYear()} Casmara Systems.</p>
        <div className="flex gap-4">
          <Link to="/how-it-works" className="hover:text-foreground">
            How it works
          </Link>
          <Link to="/for-providers" className="hover:text-foreground">
            For providers
          </Link>
          <Link to="/materials" className="hover:text-foreground">
            Materials
          </Link>
          <Link to="/requests" className="hover:text-foreground">
            My requests
          </Link>
          <Link to="/billing" className="hover:text-foreground">
            Billing
          </Link>
        </div>
      </div>
    </footer>
  );
}
