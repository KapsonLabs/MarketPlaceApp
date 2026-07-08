import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Tags } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { FormProvider, RHFTextField } from "@/components/hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  getMarketplaceSettings,
  updateMarketplaceSettings,
  type MarketplaceSettings,
} from "@/lib/api/settings.api";

export const Route = createFileRoute("/administrator/settings")({
  head: () => ({ meta: [{ title: "Settings — Casmara Systems Admin" }] }),
  component: SettingsPage,
});

interface FormValues {
  marketplace_fee_percent: string;
  deposit_percent: string;
  assessment_fee: string;
  currency: string;
}

function SettingsPage() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useQuery({
    queryKey: ["marketplace-settings"],
    queryFn: getMarketplaceSettings,
  });

  const methods = useForm<FormValues>({
    defaultValues: {
      marketplace_fee_percent: "8",
      deposit_percent: "75",
      assessment_fee: "35000",
      currency: "UGX",
    },
  });

  useEffect(() => {
    if (settings) {
      methods.reset({
        marketplace_fee_percent: String(settings.marketplace_fee_percent),
        deposit_percent: String(settings.deposit_percent),
        assessment_fee: settings.assessment_fee,
        currency: settings.currency,
      });
    }
  }, [settings, methods]);

  const saveMutation = useMutation({
    mutationFn: (payload: Partial<MarketplaceSettings>) => updateMarketplaceSettings(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(["marketplace-settings"], data);
      toast.success("Settings saved");
    },
    onError: () => toast.error("Could not save settings"),
  });

  function onSubmit(values: FormValues) {
    saveMutation.mutate({
      marketplace_fee_percent: Number(values.marketplace_fee_percent),
      deposit_percent: Number(values.deposit_percent),
      assessment_fee: values.assessment_fee,
      currency: values.currency,
    });
  }

  return (
    <AdminShell
      title="Settings"
      description="Configure marketplace fees, deposits, and general pricing defaults."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Pricing & fees</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading…</p>
              ) : (
                <FormProvider methods={methods} onSubmit={onSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <RHFTextField
                      name="marketplace_fee_percent"
                      label="Marketplace fee (%)"
                      type="number"
                      min="0"
                      max="100"
                    />
                    <RHFTextField
                      name="deposit_percent"
                      label="Deposit required (%)"
                      type="number"
                      min="0"
                      max="100"
                    />
                    <RHFTextField
                      name="assessment_fee"
                      label="Flat assessment fee (UGX)"
                      type="number"
                      min="0"
                    />
                    <RHFTextField name="currency" label="Currency code" />
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button type="submit" disabled={saveMutation.isPending}>
                      {saveMutation.isPending ? "Saving…" : "Save settings"}
                    </Button>
                  </div>
                </FormProvider>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Tags className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base">Service categories</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage the categories providers can list services under.
              </p>
              <Button asChild variant="outline" className="mt-3 w-full">
                <Link to="/administrator/service-categories">Manage categories</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}
