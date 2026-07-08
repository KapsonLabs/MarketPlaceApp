import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { KeyRound, UserRound } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/marketplace/site-header";
import { FormProvider, RHFTextField } from "@/components/hook-form";
import { useCurrentUser } from "@/lib/marketplace/current-user";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { updatePassword, type UpdatePasswordInput } from "@/lib/api/account.api";

export const Route = createFileRoute("/marketplace/account")({
  head: () => ({
    meta: [
      { title: "Account — Casmara Systems" },
      { name: "description", content: "Manage your marketplace profile and login security." },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const user = useCurrentUser();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto max-w-4xl px-4 py-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Account</h1>
          <p className="mt-2 text-muted-foreground">Manage your profile and login security.</p>

          {!user ? (
            <GuestState />
          ) : (
            <AccountContent name={user.name} email={user.email} />
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

interface PasswordFormValues {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

function AccountContent({ name, email }: { name: string; email: string }) {
  const methods = useForm<PasswordFormValues>({
    defaultValues: { current_password: "", new_password: "", confirm_password: "" },
  });

  const passwordMutation = useMutation({
    mutationFn: (payload: UpdatePasswordInput) => updatePassword(payload),
    onSuccess: () => {
      toast.success("Password updated");
      methods.reset();
    },
    onError: () => toast.error("Could not update password"),
  });

  function onSubmit(values: PasswordFormValues) {
    if (values.new_password !== values.confirm_password) {
      methods.setError("confirm_password", { message: "Passwords do not match" });
      return;
    }
    passwordMutation.mutate({
      current_password: values.current_password,
      new_password: values.new_password,
    });
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-3">
      <Card className="border-border lg:col-span-1">
        <CardContent className="space-y-3 p-6 text-sm">
          <div className="flex items-center gap-2 text-foreground">
            <UserRound className="h-4 w-4 text-primary" />
            <span className="font-medium">Profile</span>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Name</p>
            <p className="mt-0.5">{name}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Email</p>
            <p className="mt-0.5">{email}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border lg:col-span-2">
        <CardContent className="p-6">
          <div className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-primary" />
            <h2 className="text-base font-semibold text-foreground">Change password</h2>
          </div>
          <FormProvider methods={methods} onSubmit={onSubmit}>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <RHFTextField name="current_password" label="Current password" type="password" />
              <div />
              <RHFTextField name="new_password" label="New password" type="password" />
              <RHFTextField
                name="confirm_password"
                label="Confirm new password"
                type="password"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <Button type="submit" disabled={passwordMutation.isPending}>
                {passwordMutation.isPending ? "Updating…" : "Update password"}
              </Button>
            </div>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}

function GuestState() {
  return (
    <Card className="mt-8 border-border">
      <CardContent className="flex flex-col items-start gap-4 p-8">
        <UserRound className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-lg font-semibold text-foreground">Sign in to view your account</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your profile and account security settings are tied to your marketplace account.
          </p>
        </div>
        <Button asChild>
          <Link to="/marketplace/sign-in" search={{ redirect: "/marketplace/account" } as never}>
            Sign in
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
