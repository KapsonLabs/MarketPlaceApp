import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createProviderService,
  SKILL_LEVELS,
  CERTIFICATION_STATUSES,
} from "@/lib/providers.api";
import { listServiceCategories } from "@/lib/service-categories.api";

const empty = {
  category: "",
  years_of_experience: "",
  skill_level: "intermediate",
  certification_status: "none",
  hourly_rate: "",
};

function prettify(value: string) {
  return value.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function ProviderServiceDialog({ providerId }: { providerId: string }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);

  const categoriesQuery = useQuery({
    queryKey: ["service-categories"],
    queryFn: listServiceCategories,
    enabled: open,
  });

  const mutation = useMutation({
    mutationFn: () =>
      createProviderService(providerId, {
        category: form.category,
        years_of_experience: Number(form.years_of_experience) || 0,
        skill_level: form.skill_level,
        certification_status: form.certification_status,
        hourly_rate: form.hourly_rate,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider", providerId] });
      setForm(empty);
      setOpen(false);
    },
  });

  function onOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setForm(empty);
      mutation.reset();
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate();
  }

  const error = mutation.error as
    | { uiMessage?: string; message?: string }
    | null;
  const categories = categoriesQuery.data?.results ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="mr-1 h-4 w-4" /> Add service
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a service</DialogTitle>
          <DialogDescription>
            Register a service category this provider offers.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          {error && (
            <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                {error.uiMessage ?? error.message ?? "Failed to add service."}
              </span>
            </div>
          )}

          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select
              value={form.category}
              onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
              required
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    categoriesQuery.isPending
                      ? "Loading categories…"
                      : "Select a category"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="svc-years">Years of experience</Label>
              <Input
                id="svc-years"
                type="number"
                min={0}
                value={form.years_of_experience}
                onChange={(e) =>
                  setForm((f) => ({ ...f, years_of_experience: e.target.value }))
                }
                placeholder="5"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="svc-rate">Hourly rate</Label>
              <Input
                id="svc-rate"
                value={form.hourly_rate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, hourly_rate: e.target.value }))
                }
                placeholder="1800.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Skill level</Label>
              <Select
                value={form.skill_level}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, skill_level: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SKILL_LEVELS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {prettify(s)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Certification</Label>
              <Select
                value={form.certification_status}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, certification_status: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CERTIFICATION_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {prettify(s)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending || !form.category}
            >
              {mutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Add service
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
