import { createFileRoute, useNavigate, Link, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import type { AxiosError } from "axios";
import { ArrowRight, Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/marketplace/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMarketplaceSession, loginMarketplace } from "@/lib/marketplace-auth";

const searchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/marketplace/sign-in")({
  validateSearch: searchSchema,
  beforeLoad: () => {
    if (getMarketplaceSession()) {
      throw redirect({ to: "/marketplace/requests" });
    }
  },
  head: () => ({
    meta: [
      { title: "Sign in — Casmara Systems" },
      {
        name: "description",
        content: "Sign in or create an account to request facility management services.",
      },
    ],
  }),
  component: SignInPage,
});

function SignInPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const redirectTo = search.redirect?.startsWith("/")
    ? search.redirect
    : "/marketplace/requests";
  const [mode, setMode] = useState<"login" | "create">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleModeChange(value: "login" | "create") {
    setMode(value);
    setUsername("");
    setPassword("");
    setError(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === "create") return;

    setError(null);
    setLoading(true);

    try {
      await loginMarketplace({ username: username.trim(), password });
      const redirectUrl = new URL(redirectTo, window.location.origin);
      navigate({
        to: redirectUrl.pathname as never,
        search: Object.fromEntries(redirectUrl.searchParams) as never,
      });
    } catch (err) {
      const axiosError = err as AxiosError & { uiMessage?: string };
      setError(
        axiosError.uiMessage ??
          (err instanceof Error ? err.message : "Invalid username or password."),
      );
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto grid gap-8 px-4 py-10 lg:grid-cols-[1fr_420px] lg:py-16">
          <section className="flex flex-col justify-center">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
                <KeyRound className="h-3.5 w-3.5 text-primary" />
                Member app and direct access
              </span>
              <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Sign in to request facility management services.
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Use your marketplace account to track service requests, provider assignment and
                billing in one place.
              </p>
            </div>
          </section>

          <Card className="border-border shadow-[var(--shadow-elegant)]">
            <CardContent className="p-6">
              <Tabs value={mode} onValueChange={(value) => handleModeChange(value as typeof mode)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Log in</TabsTrigger>
                  <TabsTrigger value="create">Create account</TabsTrigger>
                </TabsList>
                <TabsContent value="login" className="mt-6">
                  <form onSubmit={onSubmit} className="space-y-4">
                    <Field label="Username" id="username">
                      <Input
                        id="username"
                        type="text"
                        autoComplete="username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="client"
                        disabled={loading}
                      />
                    </Field>
                    <Field label="Password" id="password">
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={loading}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </Field>
                    {error && (
                      <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                        {error}
                      </p>
                    )}
                    <Button type="submit" size="lg" className="w-full" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Log in
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </form>
                </TabsContent>
                <TabsContent value="create" className="mt-6">
                  <div className="rounded-lg border border-dashed border-border bg-muted/20 px-4 py-8 text-center">
                    <p className="text-sm font-semibold text-foreground">Registration coming soon</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      New account signup is not available yet. Contact support if you need access.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
              <p className="mt-5 text-center text-xs text-muted-foreground">
                Providers can apply from{" "}
                <Link to="/marketplace/for-providers" className="font-medium text-primary">
                  For providers
                </Link>
                .
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}
