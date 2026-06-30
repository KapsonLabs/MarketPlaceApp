import { useForm } from "react-hook-form";
import { FormProvider, RHFTextArea } from "@/components/hook-form";
import { Button } from "@/components/ui/button";
import { WORK_ORDER_STATUS_LABEL, type WorkOrderStatus } from "@/lib/api/work-orders.api";

interface FormValues {
  description: string;
}

interface StatusUpdateFormProps {
  fromStatus: WorkOrderStatus;
  toStatus: WorkOrderStatus;
  onConfirm: (description: string) => void;
  onCancel: () => void;
  isPending?: boolean;
}

export function StatusUpdateForm({
  fromStatus,
  toStatus,
  onConfirm,
  onCancel,
  isPending = false,
}: StatusUpdateFormProps) {
  const methods = useForm<FormValues>({ defaultValues: { description: "" } });

  function onSubmit(data: FormValues) {
    onConfirm(data.description);
  }

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Move this work order from{" "}
          <strong className="text-foreground">
            {WORK_ORDER_STATUS_LABEL[fromStatus] ?? fromStatus}
          </strong>{" "}
          to{" "}
          <strong className="text-foreground">
            {WORK_ORDER_STATUS_LABEL[toStatus] ?? toStatus}
          </strong>
          .
        </p>

        <RHFTextArea
          name="description"
          label="Description"
          placeholder="Describe the reason for this status change…"
          rows={3}
        />

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving…" : "Confirm"}
          </Button>
        </div>
      </div>
    </FormProvider>
  );
}
