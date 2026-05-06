import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  listAllRequests,
  setRequestStatus,
} from "@/server/requests.functions";
import {
  REQUEST_STATUSES,
  type ForwardedMaintenanceRequest,
  type RequestStatus,
} from "@/server/requests.server";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin — Casmara Systems" }],
  }),
  loader: async () => listAllRequests(),
  component: AdminPage,
});

const statusTone: Record<RequestStatus, string> = {
  Open: "bg-warning/15 text-warning-foreground border-warning/40",
  Triaged: "bg-primary/10 text-primary border-primary/30",
  Assigned: "bg-primary/15 text-primary border-primary/40",
  InProgress: "bg-accent/15 text-accent-foreground border-accent/40",
  Completed: "bg-success/15 text-success border-success/40",
  Cancelled: "bg-muted text-muted-foreground border-border",
};

function AdminPage() {
  const data = Route.useLoaderData() as { requests: ForwardedMaintenanceRequest[] };
  const requests = data.requests;
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  async function changeStatus(r: ForwardedMaintenanceRequest, status: RequestStatus) {
    setBusy(r.id);
    try {
      await setRequestStatus({
        data: { id: r.id, status, notes: notes[r.id] },
      });
      router.invalidate();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto max-w-6xl px-4 py-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Marketplace requests
              </h1>
              <p className="mt-1 text-muted-foreground">
                Triage submissions and update their status. Updates sync to the
                Maintenance module.
              </p>
            </div>
            <Button variant="outline" onClick={() => router.invalidate()}>
              <RefreshCw className="mr-1 h-4 w-4" /> Refresh
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-6">
            {REQUEST_STATUSES.map((s) => {
              const count = requests.filter((r) => r.status === s).length;
              return (
                <Card key={s} className="border-border">
                  <CardContent className="p-4">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      {s}
                    </p>
                    <p className="mt-1 text-2xl font-bold text-foreground">{count}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-8 space-y-4">
            {requests.length === 0 && (
              <Card className="border-border">
                <CardContent className="p-8 text-center text-muted-foreground">
                  No requests yet. Submitted marketplace requests will appear here.
                </CardContent>
              </Card>
            )}
            {requests.map((r) => (
              <Card key={r.id} className="border-border">
                <CardContent className="space-y-4 p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {r.title}
                        </h3>
                        <Badge variant="outline" className={statusTone[r.status]}>
                          {r.status}
                        </Badge>
                        <Badge variant="secondary">{r.priority}</Badge>
                        <Badge variant="outline">{r.category}</Badge>
                        <Badge variant="outline">{r.audience}</Badge>
                      </div>
                      <p className="mt-1 text-xs font-mono text-muted-foreground">
                        {r.id} • {new Date(r.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={r.status}
                        onValueChange={(v) =>
                          changeStatus(r, v as RequestStatus)
                        }
                        disabled={busy === r.id}
                      >
                        <SelectTrigger className="w-[160px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {REQUEST_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {busy === r.id && (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-foreground/90">{r.description}</p>

                  <div className="grid gap-3 text-xs text-muted-foreground sm:grid-cols-2">
                    <div>
                      <p className="font-semibold text-foreground">Contact</p>
                      <p>{r.contact.name}</p>
                      <p>{r.contact.email} • {r.contact.phone}</p>
                      <p>{r.contact.address}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Property</p>
                      <p>Property: {r.propertyId ?? "—"}</p>
                      <p>Unit: {r.unitId ?? "—"}</p>
                      <p>
                        Preferred provider: {r.preferredProviderId ?? "—"}
                      </p>
                    </div>
                  </div>

                  {r.photos.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                      {r.photos.map((p, i) => (
                        <a
                          key={i}
                          href={p.dataUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="aspect-square overflow-hidden rounded-md border border-border"
                        >
                          <img
                            src={p.dataUrl}
                            alt={p.name}
                            className="h-full w-full object-cover"
                          />
                        </a>
                      ))}
                    </div>
                  )}

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-foreground">Notes</p>
                    <Textarea
                      rows={2}
                      placeholder="Internal note for the maintenance team…"
                      defaultValue={r.notes ?? ""}
                      onChange={(e) =>
                        setNotes((n) => ({ ...n, [r.id]: e.target.value }))
                      }
                    />
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busy === r.id}
                        onClick={() => changeStatus(r, r.status)}
                      >
                        Save note
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}