import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserRound, KeyRound } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { FormProvider, RHFTextField } from "@/components/hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAdminSession } from "@/lib/admin-auth";
import { updatePassword, type UpdatePasswordInput } from "@/lib/api/account.api";

export const Route = createFileRoute("/administrator/account")({
  head: () => ({ meta: [{ title: "Account — Casmara Systems Admin" }] }),
  component: AccountPage,
});

interface PasswordFormValues {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

function AccountPage() {
  const session = useAdminSession();
  const user = session?.user;

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
    <AdminShell title="Account" description="Your profile and login security.">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <UserRound className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base">Profile</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Name</p>
                <p className="mt-0.5">
                  {`${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() ||
                    user?.username ||
                    "—"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Email</p>
                <p className="mt-0.5">{user?.email ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Role</p>
                <p className="mt-0.5">{user?.role?.name ?? "—"}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base">Change password</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <FormProvider methods={methods} onSubmit={onSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <RHFTextField
                    name="current_password"
                    label="Current password"
                    type="password"
                  />
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
      </div>
    </AdminShell>
  );
}
