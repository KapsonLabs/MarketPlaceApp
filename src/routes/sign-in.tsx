import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { ArrowRight, Home, KeyRound, UserRound } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { demoUser, signInUser, type CurrentUser } from "@/lib/current-user";

const searchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/sign-in")({
  validateSearch: searchSchema,
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
  const redirect = search.redirect?.startsWith("/") ? search.redirect : "/providers?welcome=1";
  const [mode, setMode] = useState<"login" | "create">("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  function handleModeChange(value: "login" | "create") {
    setMode(value);
    setForm({ name: "", email: "", phone: "", password: "" });
  }

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  function finish(user: CurrentUser) {
    signInUser(user);
    const redirectUrl = new URL(redirect, window.location.origin);
    navigate({
      to: redirectUrl.pathname as never,
      search: Object.fromEntries(redirectUrl.searchParams) as never,
    });
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    finish({
      id: `user-${Date.now()}`,
      name:
        mode === "login"
          ? form.email
              .split("@")[0]
              .replace(/[._-]+/g, " ")
              .replace(/\b\w/g, (letter) => letter.toUpperCase())
          : form.name,
      email: form.email,
      phone: form.phone || "+256700000000",
      audience: "public",
    });
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
                Create a simple marketplace account to request a vetted provider for facility
                management services at a fee. Tenant and property checks are handled by the member
                app.
              </p>
              <div className="mt-8 grid gap-3 sm:max-w-sm">
                <QuickUser
                  icon={UserRound}
                  title="Demo account"
                  body="Preview the request and marketplace flow."
                  onClick={() => finish(demoUser)}
                />
              </div>
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
                  <AuthForm mode="login" form={form} update={update} onSubmit={onSubmit} />
                </TabsContent>
                <TabsContent value="create" className="mt-6">
                  <AuthForm mode="create" form={form} update={update} onSubmit={onSubmit} />
                </TabsContent>
              </Tabs>
              <p className="mt-5 text-center text-xs text-muted-foreground">
                Providers can apply from{" "}
                <Link to="/for-providers" className="font-medium text-primary">
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

function AuthForm({
  mode,
  form,
  update,
  onSubmit,
}: {
  mode: "login" | "create";
  form: {
    name: string;
    email: string;
    phone: string;
    password: string;
  };
  update: <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {mode === "create" && (
        <Field label="Full name" id="name">
          <Input
            id="name"
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Jane Nakato"
          />
        </Field>
      )}
      <Field label="Email address" id="email">
        <Input
          id="email"
          type="email"
          required
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="you@example.com"
        />
      </Field>
      {mode === "create" && (
        <Field label="Phone number" id="phone">
          <Input
            id="phone"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+256..."
          />
        </Field>
      )}
      <Field label="Password" id="password">
        <Input
          id="password"
          type="password"
          required
          minLength={6}
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
          placeholder="Minimum 6 characters"
        />
      </Field>
      <Button type="submit" size="lg" className="w-full">
        {mode === "login" ? "Log in" : "Create account"}
        <ArrowRight className="ml-1 h-4 w-4" />
      </Button>
    </form>
  );
}

function QuickUser({
  icon: Icon,
  title,
  body,
  onClick,
}: {
  icon: typeof Home;
  title: string;
  body: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border border-border bg-card p-4 text-left transition-colors hover:border-primary"
    >
      <Icon className="h-5 w-5 text-primary" />
      <p className="mt-3 text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{body}</p>
    </button>
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
