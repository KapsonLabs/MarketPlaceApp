import { Link } from "@tanstack/react-router";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
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
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link to="/providers">Find a pro</Link>
          </Button>
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
        <p>© {new Date().getFullYear()} Casmara Systems. Powered by Unit & Tenant Views.</p>
        <div className="flex gap-4">
          <Link to="/how-it-works" className="hover:text-foreground">How it works</Link>
          <Link to="/for-providers" className="hover:text-foreground">For providers</Link>
        </div>
      </div>
    </footer>
  );
}