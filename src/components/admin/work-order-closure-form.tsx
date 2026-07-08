import { useForm } from "react-hook-form";
import { FormProvider, RHFTextField, RHFTextArea } from "@/components/hook-form";
import { Button } from "@/components/ui/button";
import type { WorkOrderMaterial } from "@/lib/api/work-orders.api";

interface FormValues {
  final_cost: string;
  actual_start: string;
  actual_end: string;
  hours_worked: string;
  issues_experienced: string;
}

interface WorkOrderClosureFormProps {
  materials: WorkOrderMaterial[];
  defaultActualStart?: string | null;
  defaultActualEnd?: string | null;
  onConfirm: (values: {
    final_cost: string;
    actual_start?: string;
    actual_end?: string;
    hours_worked?: number;
    issues_experienced?: string;
  }) => void;
  onCancel: () => void;
  isPending?: boolean;
}

function toDatetimeLocal(value?: string | null): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function WorkOrderClosureForm({
  materials,
  defaultActualStart,
  defaultActualEnd,
  onConfirm,
  onCancel,
  isPending = false,
}: WorkOrderClosureFormProps) {
  const materialsTotal = materials.reduce((sum, m) => sum + Number(m.total_cost), 0);

  const methods = useForm<FormValues>({
    defaultValues: {
      final_cost: materialsTotal ? String(materialsTotal) : "",
      actual_start: toDatetimeLocal(defaultActualStart),
      actual_end: toDatetimeLocal(defaultActualEnd),
      hours_worked: "",
      issues_experienced: "",
    },
  });

  function onSubmit(data: FormValues) {
    onConfirm({
      final_cost: data.final_cost,
      actual_start: data.actual_start ? new Date(data.actual_start).toISOString() : undefined,
      actual_end: data.actual_end ? new Date(data.actual_end).toISOString() : undefined,
      hours_worked: data.hours_worked ? Number(data.hours_worked) : undefined,
      issues_experienced: data.issues_experienced || undefined,
    });
  }

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Confirm the final price and record operation details before closing this work
          order. Materials total{" "}
          <strong className="text-foreground">UGX {materialsTotal.toLocaleString()}</strong>
          {materials.length === 0 && " — add any materials used from the card below before closing, if applicable."}
        </p>

        <RHFTextField
          name="final_cost"
          label="Final price (UGX)"
          type="number"
          min="0"
          placeholder="0"
        />

        <div className="grid grid-cols-2 gap-3">
          <RHFTextField name="actual_start" label="Actual start" type="datetime-local" />
          <RHFTextField name="actual_end" label="Actual end" type="datetime-local" />
        </div>

        <RHFTextField
          name="hours_worked"
          label="Hours worked"
          type="number"
          min="0"
          step="0.25"
          placeholder="e.g. 3.5"
        />

        <RHFTextArea
          name="issues_experienced"
          label="Issues experienced (optional)"
          placeholder="Note any complications, delays, or follow-up needed…"
          rows={3}
        />

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Closing…" : "Confirm & close"}
          </Button>
        </div>
      </div>
    </FormProvider>
  );
}
