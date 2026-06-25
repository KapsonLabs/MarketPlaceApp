import { cn } from "@/lib/utils";
import {
  PROGRESS_STEPS,
  STATUS_ORDER,
  isTerminalStatus,
} from "@/lib/marketplace/service-request-utils";

export function RequestProgress({ status }: { status: string }) {
  if (isTerminalStatus(status)) {
    return (
      <p className="text-sm text-muted-foreground">
        This request was {status.replace(/_/g, " ")} and is closed.
      </p>
    );
  }

  const currentIndex = STATUS_ORDER[status] ?? 0;
  const currentStep = PROGRESS_STEPS[currentIndex] ?? PROGRESS_STEPS[0];
  const progressPct = (currentIndex / (PROGRESS_STEPS.length - 1)) * 100;

  return (
    <div>
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="font-medium text-foreground">{currentStep.label}</span>
        <span className="text-muted-foreground">
          Step {currentIndex + 1} of {PROGRESS_STEPS.length}
        </span>
      </div>

      <div className="relative mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all"
          style={{ width: `${Math.max(progressPct, 8)}%` }}
        />
      </div>

      <div className="mt-3 flex justify-between gap-1">
        {PROGRESS_STEPS.map((step, index) => {
          const done = currentIndex > index;
          const current = currentIndex === index;
          return (
            <div
              key={step.key}
              className="flex min-w-0 flex-1 flex-col items-center gap-1 text-center"
            >
              <span
                className={cn(
                  "flex h-2 w-2 rounded-full",
                  done && "bg-primary",
                  current &&
                    "bg-primary ring-2 ring-primary/30 ring-offset-2 ring-offset-background",
                  !done && !current && "bg-muted-foreground/30",
                )}
              />
              <span
                className={cn(
                  "hidden text-[10px] leading-tight sm:block",
                  current ? "font-medium text-foreground" : "text-muted-foreground",
                )}
              >
                {step.short}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
