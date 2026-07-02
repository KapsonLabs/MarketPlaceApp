import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  ImagePlus,
  Loader2,
  MapPin,
  ReceiptText,
  User,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/marketplace/site-header";
import { RequestProgress } from "@/components/marketplace/request-progress";
import { StatusBadge } from "@/components/admin/provider-badges";
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
import { useCurrentUser } from "@/lib/marketplace/current-user";
import {
  formatDate,
  formatMoney,
  formatTime,
  prettify,
  requestBalance,
  requestTotal,
} from "@/lib/marketplace/service-request-utils";
import { listAllServiceCategories } from "@/lib/service-categories.api";
import {
  getMyServiceRequest,
  makeServiceRequestPayment,
  type RequestImage,
  type ServiceRequestDetail,
} from "@/lib/service-requests.api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/marketplace/requests/$requestId")({
  head: () => ({
    meta: [{ title: "Request detail — Casmara Systems" }],
  }),
  component: RequestDetailPage,
});

function RequestDetailPage() {
  const { requestId } = Route.useParams();
  const user = useCurrentUser();

  const {
    data: request,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["marketplace", "service-request", requestId],
    queryFn: () => getMyServiceRequest(requestId),
    enabled: !!user,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["service-categories"],
    queryFn: listAllServiceCategories,
    enabled: !!user,
  });

  const categoryName = request
    ? (categories.find((c) => c.id === request.service_category)?.name ??
      prettify(request.service_category))
    : "";

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {!user ? (
          <div className="container mx-auto max-w-3xl px-4 py-16">
            <GuestState />
          </div>
        ) : isLoading ? (
          <LoadingState />
        ) : isError || !request ? (
          <div className="container mx-auto max-w-3xl px-4 py-16">
            <NotFoundState />
          </div>
        ) : (
          <RequestDetail request={request} categoryName={categoryName} />
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function RequestDetail({
  request,
  categoryName,
}: {
  request: ServiceRequestDetail;
  categoryName: string;
}) {
  const queryClient = useQueryClient();
  const [payOpen, setPayOpen] = useState(false);
  const [payAmount, setPayAmount] = useState("");

  const payMutation = useMutation({
    mutationFn: (amount: string) => makeServiceRequestPayment(request.id, amount),
    onSuccess: () => {
      setPayOpen(false);
      setPayAmount("");
      queryClient.invalidateQueries({
        queryKey: ["marketplace", "service-request", request.id],
      });
    },
  });

  const balance = requestBalance(request);
  const total = requestTotal(request);
  const heroImage = request.images[0];

  return (
    <>
      {/* Header */}
      <div className="border-b border-border bg-muted/20">
        <div className="container mx-auto max-w-3xl px-4 py-5 sm:py-6">
          <Button asChild variant="ghost" size="sm" className="-ml-2 mb-4 h-8 px-2">
            <Link to="/marketplace/requests">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              My requests
            </Link>
          </Button>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {categoryName}
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {request.title}
              </h1>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <StatusBadge value={request.status} />
                <StatusBadge value={request.priority} />
                {request.payment_status !== "unpaid" && (
                  <StatusBadge value={request.payment_status} />
                )}
              </div>
            </div>
            {balance > 0 && (
              <div className="shrink-0 rounded-lg border border-border bg-background px-4 py-3 text-right">
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Balance due
                </p>
                <p className="mt-0.5 text-xl font-bold tabular-nums text-foreground">
                  {formatMoney(balance)}
                </p>
              </div>
            )}
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <MetaChip label="Submitted" value={formatDate(request.created_at)} />
            <MetaChip label="Updated" value={formatDate(request.updated_at)} />
            <MetaChip
              label="Budget"
              value={request.estimated_budget ? formatMoney(request.estimated_budget) : "—"}
            />
            <MetaChip label="Assignment" value={prettify(request.assignment_type)} />
          </dl>
        </div>
      </div>

      <div className="container mx-auto max-w-3xl px-4 py-6 sm:py-8">
        {/* Progress */}
        <section className="mb-8">
          <RequestProgress status={request.status} />
        </section>

        {/* Description */}
        {request.description && (
          <section className="mb-8">
            <SectionLabel>About this job</SectionLabel>
            <p className="mt-2 text-sm leading-relaxed text-foreground/90">
              {request.description}
            </p>
          </section>
        )}

        {request.assignments.length > 0 && (
          <section className="mb-8">
            <SectionLabel>Provider assignments</SectionLabel>
            <ul className="mt-3 divide-y divide-border rounded-xl border border-border">
              {request.assignments.map((a) => (
                <li key={a.id} className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge value={a.acceptance_status} />
                    <span className="text-xs text-muted-foreground">
                      {new Date(a.assignment_date).toLocaleString()}
                    </span>
                  </div>
                  {a.assignment_reason && (
                    <p className="mt-1.5 text-sm text-muted-foreground">{a.assignment_reason}</p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {request.payments.length > 0 && (
          <section className="mb-8">
            <SectionLabel>Payment history</SectionLabel>
            <ul className="mt-3 divide-y divide-border rounded-xl border border-border">
              {request.payments.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-foreground">{prettify(p.payment_type)}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(p.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span className="font-semibold tabular-nums">{formatMoney(p.amount)}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mb-8 grid gap-6 sm:grid-cols-2">
          <InfoBlock title="Preferred slot" icon={CalendarDays}>
            <InfoLine label="Date" value={formatDate(request.preferred_date)} />
            <InfoLine label="Time" value={formatTime(request.preferred_time)} />
          </InfoBlock>

          <InfoBlock title="Payment" icon={ReceiptText}>
            <InfoLine
              label="Estimated cost"
              value={request.estimated_cost ? formatMoney(request.estimated_cost) : "Pending"}
            />
            {request.estimated_cost && !request.is_deposit_paid && request.deposit_required != null && (
              <InfoLine
                label="Deposit required"
                value={formatMoney(request.deposit_required)}
                highlight
              />
            )}
            <InfoLine label="Amount paid" value={formatMoney(request.amount_paid)} />
            <InfoLine
              label="Balance"
              value={balance > 0 ? formatMoney(balance) : "Nothing due"}
              highlight={balance > 0}
            />
            {balance > 0 && (
              <>
                {request.estimated_cost && !request.is_deposit_paid && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Pay the deposit to have a provider assigned to your request.
                  </p>
                )}
                <Dialog open={payOpen} onOpenChange={(open) => { setPayOpen(open); if (!open) payMutation.reset(); }}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="mt-2 w-full"
                      onClick={() =>
                        setPayAmount(
                          request.deposit_required != null && !request.is_deposit_paid
                            ? String(request.deposit_required)
                            : String(balance),
                        )
                      }
                    >
                      Make Payment
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Make Payment</DialogTitle>
                      <DialogDescription>
                        {request.estimated_cost && !request.is_deposit_paid
                          ? `Pay the deposit of ${formatMoney(request.deposit_required)} to proceed with your request.`
                          : `Outstanding balance: ${formatMoney(balance)}`}
                      </DialogDescription>
                    </DialogHeader>
                    {payMutation.isError && (
                      <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {(payMutation.error as { uiMessage?: string }).uiMessage ??
                          (payMutation.error as Error).message ??
                          "Payment failed."}
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="pay-amount">Amount (USh)</Label>
                      <Input
                        id="pay-amount"
                        type="number"
                        min="1"
                        placeholder="e.g. 112500"
                        value={payAmount}
                        onChange={(e) => setPayAmount(e.target.value)}
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setPayOpen(false)}
                        disabled={payMutation.isPending}
                      >
                        Cancel
                      </Button>
                      <Button
                        disabled={!payAmount || payMutation.isPending}
                        onClick={() => payMutation.mutate(payAmount)}
                      >
                        {payMutation.isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Pay
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </InfoBlock>
        </div>

        {/* Photos */}
        <section className="mb-8">
          <div className="flex items-center justify-between gap-3">
            <SectionLabel>Photos</SectionLabel>
            <Button asChild variant="outline" size="sm">
              <Link
                to="/marketplace/request-photos"
                search={{ id: request.id, title: request.title }}
              >
                <ImagePlus className="mr-1.5 h-4 w-4" />
                Add photo
              </Link>
            </Button>
          </div>

          {request.images.length === 0 ? (
            <div className="mt-3 rounded-xl border border-dashed border-border bg-muted/20 px-4 py-10 text-center">
              <ImagePlus className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                No photos yet — add one to help providers assess the issue.
              </p>
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              {heroImage && (
                <a
                  href={heroImage.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block overflow-hidden rounded-xl border border-border"
                >
                  <img
                    src={heroImage.image}
                    alt={heroImage.caption}
                    className="aspect-[16/10] w-full object-cover sm:aspect-[2/1]"
                  />
                  <div className="border-t border-border bg-background px-4 py-3">
                    <p className="text-sm font-medium text-foreground">{heroImage.caption}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {new Date(heroImage.created_at).toLocaleString()}
                    </p>
                  </div>
                </a>
              )}
              {request.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {request.images.slice(1).map((image) => (
                    <PhotoThumb key={image.id} image={image} />
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Location & contact */}
        <div className="grid gap-6 sm:grid-cols-2">
          <InfoBlock title="Location" icon={MapPin}>
            <InfoLine label="Address" value={request.formatted_address} />
            <InfoLine
              label="Area"
              value={[request.city, request.district].filter(Boolean).join(", ")}
            />
            {request.latitude != null && request.longitude != null && (
              <a
                href={`https://maps.google.com/maps?q=${request.latitude},${request.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="mt-3 flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
              >
                <MapPin className="h-4 w-4 shrink-0" />
                View on Google Maps
                <ExternalLink className="ml-auto h-3.5 w-3.5 opacity-70" />
              </a>
            )}
          </InfoBlock>

          <InfoBlock title="Contact" icon={User}>
            <InfoLine label="Person" value={request.contact_person} />
            <InfoLine
              label="Phone"
              value={request.contact_phone}
              href={`tel:${request.contact_phone}`}
            />
            {request.contact_alternate_phone && (
              <InfoLine label="Alt. phone" value={request.contact_alternate_phone} />
            )}
            <InfoLine
              label="Email"
              value={request.contact_email}
              href={`mailto:${request.contact_email}`}
            />
          </InfoBlock>
        </div>
      </div>
    </>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </h2>
  );
}

function MetaChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-background px-3 py-2">
      <dt className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 truncate text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}

function InfoBlock({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof MapPin;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border p-4">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Icon className="h-4 w-4 text-primary" />
        {title}
      </h3>
      <div className="mt-3 space-y-2">{children}</div>
    </section>
  );
}

function InfoLine({
  label,
  value,
  href,
  highlight = false,
}: {
  label: string;
  value: string;
  href?: string;
  highlight?: boolean;
}) {
  const content = (
    <span className={cn("text-sm", highlight ? "font-semibold text-foreground" : "text-foreground")}>
      {value || "—"}
    </span>
  );

  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      {href && value ? (
        <a href={href} className="text-sm font-medium text-primary hover:underline">
          {value}
        </a>
      ) : (
        content
      )}
    </div>
  );
}

function PhotoThumb({ image }: { image: RequestImage }) {
  return (
    <a
      href={image.image}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-28 shrink-0 overflow-hidden rounded-lg border border-border sm:w-32"
    >
      <img
        src={image.image}
        alt={image.caption}
        className="aspect-square w-full object-cover"
        loading="lazy"
      />
    </a>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center gap-2 py-24 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" />
      Loading request…
    </div>
  );
}

function GuestState() {
  return (
    <div className="text-center">
      <h2 className="text-lg font-semibold text-foreground">Sign in to view this request</h2>
      <Button asChild className="mt-4">
        <Link to="/marketplace/sign-in" search={{ redirect: "/marketplace/requests" } as never}>
          Sign in
        </Link>
      </Button>
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="text-center">
      <h2 className="text-lg font-semibold text-foreground">Request not found</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        This request doesn&apos;t exist or you don&apos;t have access to it.
      </p>
      <Button asChild variant="outline" className="mt-4">
        <Link to="/marketplace/requests">Back to my requests</Link>
      </Button>
    </div>
  );
}
