import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import * as React from "react";
import { useState, useMemo } from "react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { Loader2, AlertCircle, CheckCircle, CreditCard, Users, MapPin, ArrowRight, User, Mail, Phone, CalendarDays, Clock, ArrowLeft } from "lucide-react";
import { A as AdminShell } from "./admin-shell-DIDE6yaB.js";
import { D as DataTable } from "./data-table-BdEmie2k.js";
import { S as StatusBadge } from "./provider-badges-Doazn_R_.js";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { c as cn, b as buttonVariants, B as Button } from "./button-BmLZMIt9.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-DkWCRhLz.js";
import { D as Dialog, a as DialogTrigger, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogDescription, f as DialogFooter } from "./dialog-BhK3eTVt.js";
import { I as Input } from "./input-D1RGD0cW.js";
import { L as Label } from "./label-zpVQhn3Q.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-C__ybL41.js";
import { T as Textarea } from "./textarea-DOyZGKZq.js";
import { l as listAllProviders } from "./providers.api-B4SzXqi_.js";
import { a as listServiceCategories } from "./service-categories.api-RHGMOrkk.js";
import { b as getAdminServiceRequest, d as approveServiceRequest, s as setEstimatedCost, e as assignServiceRequest } from "./service-requests.api-K3cgLLXa.js";
import { w as Route } from "./router-rAJgq2Yd.js";
import "@radix-ui/react-avatar";
import "./notifications.ws-DJ822Bff.js";
import "@radix-ui/react-popover";
import "@radix-ui/react-scroll-area";
import "@tanstack/react-table";
import "./table-D9UBOVre.js";
import "./badge-BAnpIKa2.js";
import "class-variance-authority";
import "@radix-ui/react-slot";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
import "axios";
import "zod";
import "./server-ChUyfcIq.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router/ssr/server";
import "./request-types-C9A69B28.js";
const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
const AlertDialogPortal = AlertDialogPrimitive.Portal;
const AlertDialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;
const AlertDialogContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxs(AlertDialogPortal, { children: [
  /* @__PURE__ */ jsx(AlertDialogOverlay, {}),
  /* @__PURE__ */ jsx(
    AlertDialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props
    }
  )
] }));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;
const AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", { className: cn("flex flex-col space-y-2 text-center sm:text-left", className), ...props });
AlertDialogHeader.displayName = "AlertDialogHeader";
const AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);
AlertDialogFooter.displayName = "AlertDialogFooter";
const AlertDialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold", className),
    ...props
  }
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;
const AlertDialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;
const AlertDialogAction = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AlertDialogPrimitive.Action, { ref, className: cn(buttonVariants(), className), ...props }));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;
const AlertDialogCancel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Cancel,
  {
    ref,
    className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
    ...props
  }
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;
function RequestDetailPage() {
  const {
    requestId
  } = Route.useParams();
  const queryClient = useQueryClient();
  const requestQuery = useQuery({
    queryKey: ["admin-service-request", requestId],
    queryFn: () => getAdminServiceRequest(requestId)
  });
  const [approveOpen, setApproveOpen] = useState(false);
  const [costOpen, setCostOpen] = useState(false);
  const [estimatedCostInput, setEstimatedCostInput] = useState("");
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignProviderId, setAssignProviderId] = useState("");
  const [assignReason, setAssignReason] = useState("");
  const approveMutation = useMutation({
    mutationFn: () => approveServiceRequest(requestId),
    onSuccess: (data) => {
      setApproveOpen(false);
      queryClient.setQueryData(["admin-service-request", requestId], data);
      queryClient.invalidateQueries({
        queryKey: ["admin-service-requests"]
      });
    }
  });
  const costMutation = useMutation({
    mutationFn: (cost) => setEstimatedCost(requestId, cost),
    onSuccess: (data) => {
      setCostOpen(false);
      setEstimatedCostInput("");
      queryClient.setQueryData(["admin-service-request", requestId], data);
      queryClient.invalidateQueries({
        queryKey: ["admin-service-requests"]
      });
    }
  });
  const assignMutation = useMutation({
    mutationFn: () => assignServiceRequest(requestId, {
      provider_id: assignProviderId,
      reason: assignReason
    }),
    onSuccess: () => {
      setAssignOpen(false);
      setAssignProviderId("");
      setAssignReason("");
      queryClient.invalidateQueries({
        queryKey: ["admin-service-request", requestId]
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-service-requests"]
      });
    }
  });
  const providersQuery = useQuery({
    queryKey: ["providers"],
    queryFn: listAllProviders
  });
  const categoriesQuery = useQuery({
    queryKey: ["service-categories"],
    queryFn: listServiceCategories
  });
  const providerNames = useMemo(() => new Map((providersQuery.data ?? []).map((p) => [p.id, p.business_name])), [providersQuery.data]);
  const categoryNames = useMemo(() => new Map((categoriesQuery.data?.results ?? []).map((c) => [c.id, c.name])), [categoriesQuery.data]);
  if (requestQuery.isPending) {
    return /* @__PURE__ */ jsx(AdminShell, { title: "Request", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
      "Loading request..."
    ] }) });
  }
  if (requestQuery.isError) {
    return /* @__PURE__ */ jsx(AdminShell, { title: "Request", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive", children: [
      /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4 shrink-0" }),
      requestQuery.error.uiMessage ?? requestQuery.error.message ?? "Failed to load request."
    ] }) });
  }
  const request = requestQuery.data;
  const categoryName = categoryNames.get(request.service_category) ?? request.service_category;
  return /* @__PURE__ */ jsx(AdminShell, { title: request.title, description: `${request.id.slice(0, 8)}... · submitted ${new Date(request.created_at).toLocaleString()}`, actions: /* @__PURE__ */ jsx(Button, { asChild: true, variant: "outline", size: "sm", children: /* @__PURE__ */ jsxs(Link, { to: "/admin/requests", children: [
    /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
    " All requests"
  ] }) }), children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx(Card, { className: "border-border", children: /* @__PURE__ */ jsxs(CardContent, { className: "space-y-5 p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsx(StatusBadge, { value: request.status }),
          /* @__PURE__ */ jsx(StatusBadge, { value: request.priority }),
          /* @__PURE__ */ jsx(StatusBadge, { value: request.payment_status })
        ] }),
        request.status === "submitted" && /* @__PURE__ */ jsxs(AlertDialog, { open: approveOpen, onOpenChange: setApproveOpen, children: [
          /* @__PURE__ */ jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { size: "sm", children: [
            /* @__PURE__ */ jsx(CheckCircle, { className: "mr-2 h-4 w-4" }),
            "Approve Request"
          ] }) }),
          /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
            /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
              /* @__PURE__ */ jsx(AlertDialogTitle, { children: "Approve this request?" }),
              /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
                'This will approve the service request "',
                request.title,
                '" and move it to the assignment stage.'
              ] })
            ] }),
            approveMutation.isError && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive", children: [
              /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4 shrink-0" }),
              approveMutation.error.uiMessage ?? approveMutation.error.message ?? "Failed to approve request."
            ] }),
            /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
              /* @__PURE__ */ jsx(AlertDialogCancel, { disabled: approveMutation.isPending, children: "Cancel" }),
              /* @__PURE__ */ jsxs(AlertDialogAction, { disabled: approveMutation.isPending, onClick: (e) => {
                e.preventDefault();
                approveMutation.mutate();
              }, children: [
                approveMutation.isPending && /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
                "Approve"
              ] })
            ] })
          ] })
        ] }),
        request.status === "approved" && !request.estimated_cost && /* @__PURE__ */ jsxs(Dialog, { open: costOpen, onOpenChange: setCostOpen, children: [
          /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { size: "sm", children: [
            /* @__PURE__ */ jsx(CreditCard, { className: "mr-2 h-4 w-4" }),
            "Add Estimated Cost"
          ] }) }),
          /* @__PURE__ */ jsxs(DialogContent, { children: [
            /* @__PURE__ */ jsxs(DialogHeader, { children: [
              /* @__PURE__ */ jsx(DialogTitle, { children: "Add Estimated Cost" }),
              /* @__PURE__ */ jsxs(DialogDescription, { children: [
                'Set the estimated cost for "',
                request.title,
                '". A deposit of 75% will be calculated automatically.'
              ] })
            ] }),
            costMutation.isError && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive", children: [
              /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4 shrink-0" }),
              costMutation.error.uiMessage ?? costMutation.error.message ?? "Failed to set estimated cost."
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "estimated-cost", children: "Estimated cost (USh)" }),
              /* @__PURE__ */ jsx(Input, { id: "estimated-cost", type: "number", min: "0", placeholder: "e.g. 150000", value: estimatedCostInput, onChange: (e) => setEstimatedCostInput(e.target.value) })
            ] }),
            /* @__PURE__ */ jsxs(DialogFooter, { children: [
              /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setCostOpen(false), disabled: costMutation.isPending, children: "Cancel" }),
              /* @__PURE__ */ jsxs(Button, { disabled: !estimatedCostInput || costMutation.isPending, onClick: () => costMutation.mutate(estimatedCostInput), children: [
                costMutation.isPending && /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
                "Save"
              ] })
            ] })
          ] })
        ] }),
        request.status === "awaiting_assignment" && /* @__PURE__ */ jsxs(Dialog, { open: assignOpen, onOpenChange: (open) => {
          setAssignOpen(open);
          if (!open) assignMutation.reset();
        }, children: [
          /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { size: "sm", children: [
            /* @__PURE__ */ jsx(Users, { className: "mr-2 h-4 w-4" }),
            "Assign to Provider"
          ] }) }),
          /* @__PURE__ */ jsxs(DialogContent, { children: [
            /* @__PURE__ */ jsxs(DialogHeader, { children: [
              /* @__PURE__ */ jsx(DialogTitle, { children: "Assign to Provider" }),
              /* @__PURE__ */ jsx(DialogDescription, { children: "Select a provider and optionally add a reason for the assignment." })
            ] }),
            assignMutation.isError && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive", children: [
              /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4 shrink-0" }),
              assignMutation.error.uiMessage ?? assignMutation.error.message ?? "Failed to assign provider."
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "assign-provider", children: "Provider" }),
                /* @__PURE__ */ jsxs(Select, { value: assignProviderId, onValueChange: setAssignProviderId, children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { id: "assign-provider", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select a provider" }) }),
                  /* @__PURE__ */ jsx(SelectContent, { children: (providersQuery.data ?? []).map((p) => /* @__PURE__ */ jsx(SelectItem, { value: p.id, children: p.business_name }, p.id)) })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "assign-reason", children: "Reason" }),
                /* @__PURE__ */ jsx(Textarea, { id: "assign-reason", placeholder: "e.g. Best rated plumber in area", value: assignReason, onChange: (e) => setAssignReason(e.target.value), rows: 3 })
              ] })
            ] }),
            /* @__PURE__ */ jsxs(DialogFooter, { children: [
              /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setAssignOpen(false), disabled: assignMutation.isPending, children: "Cancel" }),
              /* @__PURE__ */ jsxs(Button, { disabled: !assignProviderId || assignMutation.isPending, onClick: () => assignMutation.mutate(), children: [
                assignMutation.isPending && /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
                "Assign"
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm leading-6 text-foreground/90", children: request.description }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4" }),
          categoryName,
          (request.city || request.district) && /* @__PURE__ */ jsxs(Fragment, { children: [
            " · ",
            [request.city, request.district].filter(Boolean).join(", ")
          ] })
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 capitalize", children: [
          /* @__PURE__ */ jsx(Users, { className: "h-4 w-4" }),
          prettify(request.assignment_type)
        ] }),
        request.assigned_provider && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx(Link, { to: "/admin/providers/$providerId", params: {
            providerId: request.assigned_provider
          }, className: "font-medium text-primary hover:underline", children: providerNames.get(request.assigned_provider) ?? "Assigned provider" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
        /* @__PURE__ */ jsx(Metric, { label: "Estimated cost", value: formatMoney(request.estimated_cost) }),
        /* @__PURE__ */ jsx(Metric, { label: "Amount paid", value: formatMoney(request.amount_paid) }),
        /* @__PURE__ */ jsx(Metric, { label: "Deposit required", value: request.deposit_required != null ? formatMoney(String(request.deposit_required)) : "-" }),
        /* @__PURE__ */ jsx(Metric, { label: "Cost variance", value: formatMoney(request.cost_variance) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-6 xl:grid-cols-[1fr_360px]", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx(AssignmentsTimeline, { request, providerNames }),
        /* @__PURE__ */ jsx(PaymentsSection, { request }),
        request.images.length > 0 && /* @__PURE__ */ jsx(ImagesSection, { request })
      ] }),
      /* @__PURE__ */ jsx("aside", { className: "space-y-6", children: /* @__PURE__ */ jsxs(Card, { className: "border-border", children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Requester & contact" }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3", children: [
          /* @__PURE__ */ jsx(DetailItem, { icon: User, label: "Requester", value: displayName(request.requester_name, "Unknown requester") }),
          /* @__PURE__ */ jsx(DetailItem, { icon: Mail, label: "Email", value: display(request.contact_email) }),
          /* @__PURE__ */ jsx(DetailItem, { icon: Phone, label: "Phone", value: display(request.contact_phone) }),
          /* @__PURE__ */ jsx(DetailItem, { icon: Phone, label: "Alternate phone", value: display(request.contact_alternate_phone) }),
          /* @__PURE__ */ jsx(DetailItem, { icon: User, label: "Contact person", value: display(request.contact_person) }),
          /* @__PURE__ */ jsx(DetailItem, { icon: CalendarDays, label: "Preferred date", value: formatDate(request.preferred_date) }),
          /* @__PURE__ */ jsx(DetailItem, { icon: Clock, label: "Preferred time", value: display(request.preferred_time) })
        ] })
      ] }) })
    ] })
  ] }) });
}
function AssignmentsTimeline({
  request,
  providerNames
}) {
  const assignments = [...request.assignments].sort((a, b) => new Date(b.assignment_date).getTime() - new Date(a.assignment_date).getTime());
  if (assignments.length === 0) {
    return /* @__PURE__ */ jsxs("section", { className: "rounded-xl border border-dashed border-border bg-muted/20 px-4 py-10 text-center", children: [
      /* @__PURE__ */ jsx(Users, { className: "mx-auto h-8 w-8 text-muted-foreground" }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm font-semibold text-foreground", children: "No assignments yet" }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: request.preferred_provider ? /* @__PURE__ */ jsxs(Fragment, { children: [
        "Customer preferred",
        " ",
        /* @__PURE__ */ jsx(Link, { to: "/admin/providers/$providerId", params: {
          providerId: request.preferred_provider
        }, className: "font-medium text-primary hover:underline", children: providerNames.get(request.preferred_provider) ?? "a provider" }),
        ". Awaiting assignment."
      ] }) : "This request has not been assigned to a provider." })
    ] });
  }
  return /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-base font-semibold text-foreground", children: "Assignment history" }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "How providers were matched, accepted, or superseded on this request." })
    ] }),
    /* @__PURE__ */ jsx("ol", { className: "relative space-y-0 border-l border-border pl-6", children: assignments.map((assignment, index) => {
      const isLatest = index === 0;
      const providerName = providerNames.get(assignment.provider) ?? assignment.provider.slice(0, 8);
      return /* @__PURE__ */ jsxs("li", { className: "relative pb-6 last:pb-0", children: [
        /* @__PURE__ */ jsx("span", { className: cn("absolute -left-[1.625rem] top-1 flex h-3 w-3 rounded-full ring-4 ring-background", isLatest ? "bg-primary" : "bg-muted-foreground/40") }),
        /* @__PURE__ */ jsxs("div", { className: cn("rounded-xl border p-4 transition-colors", isLatest ? "border-primary/30 bg-primary/5" : "border-border bg-card/50"), children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Link, { to: "/admin/providers/$providerId", params: {
                providerId: assignment.provider
              }, className: "text-sm font-semibold text-foreground hover:text-primary", children: providerName }),
              /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs capitalize text-muted-foreground", children: [
                assignment.assignment_type.replace(/_/g, " "),
                " ·",
                " ",
                new Date(assignment.assignment_date).toLocaleString()
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
              /* @__PURE__ */ jsx(StatusBadge, { value: assignment.acceptance_status }),
              assignment.superseded_at && /* @__PURE__ */ jsx(StatusBadge, { value: "inactive", className: "opacity-80" })
            ] })
          ] }),
          assignment.assignment_reason && /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm leading-relaxed text-muted-foreground", children: assignment.assignment_reason }),
          assignment.response_note && /* @__PURE__ */ jsxs("p", { className: "mt-2 rounded-md bg-muted/40 px-3 py-2 text-xs text-foreground", children: [
            "Provider note: ",
            assignment.response_note
          ] }),
          assignment.responded_at && /* @__PURE__ */ jsxs("p", { className: "mt-2 text-xs text-muted-foreground", children: [
            "Responded ",
            new Date(assignment.responded_at).toLocaleString()
          ] })
        ] })
      ] }, assignment.id);
    }) })
  ] });
}
function PaymentsSection({
  request
}) {
  const columns = useMemo(() => [{
    accessorKey: "payment_type",
    header: "Type",
    cell: ({
      getValue
    }) => /* @__PURE__ */ jsx("span", { className: "text-sm capitalize", children: String(getValue()) })
  }, {
    accessorKey: "amount",
    header: "Amount",
    cell: ({
      getValue
    }) => /* @__PURE__ */ jsx("span", { className: "text-sm", children: formatMoney(String(getValue())) }),
    meta: {
      align: "right"
    }
  }, {
    accessorKey: "reference",
    header: "Reference",
    cell: ({
      getValue
    }) => /* @__PURE__ */ jsx("span", { className: "text-sm", children: String(getValue() || "-") })
  }, {
    accessorKey: "created_at",
    header: "Paid at",
    cell: ({
      getValue
    }) => /* @__PURE__ */ jsx("span", { className: "text-sm", children: new Date(String(getValue())).toLocaleString() })
  }], []);
  return /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(CreditCard, { className: "h-4 w-4 text-primary" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-base font-semibold text-foreground", children: "Payments" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Deposit and final payments recorded." })
      ] })
    ] }),
    /* @__PURE__ */ jsx(DataTable, { columns, data: request.payments, emptyMessage: "No payments recorded." })
  ] });
}
function ImagesSection({
  request
}) {
  return /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-base font-semibold text-foreground", children: "Images" }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3", children: request.images.map((image) => /* @__PURE__ */ jsx("a", { href: image.image, target: "_blank", rel: "noreferrer", className: "overflow-hidden rounded-lg border border-border", children: /* @__PURE__ */ jsx("img", { src: image.image, alt: image.caption ?? "Request image", className: "aspect-[4/3] w-full object-cover" }) }, image.id)) })
  ] });
}
function Metric({
  label,
  value
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-muted/20 p-4", children: [
    /* @__PURE__ */ jsx("p", { className: "text-xs font-medium uppercase tracking-wide text-muted-foreground", children: label }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-lg font-semibold text-foreground", children: value })
  ] });
}
function DetailItem({
  icon: Icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex gap-3 border-b border-border/60 pb-3 last:border-0 last:pb-0", children: [
    /* @__PURE__ */ jsx("span", { className: "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground", children: /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs font-medium uppercase tracking-wide text-muted-foreground", children: label }),
      /* @__PURE__ */ jsx("p", { className: "mt-0.5 break-words text-sm font-medium text-foreground", children: value })
    ] })
  ] });
}
function formatMoney(value) {
  if (!value) return "-";
  const amount = Number.parseFloat(value);
  if (!Number.isFinite(amount)) return value;
  return `USh ${amount.toLocaleString()}`;
}
function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString();
}
function display(value) {
  if (!value?.trim()) return "-";
  return value;
}
function displayName(name, fallback) {
  const trimmed = name?.trim();
  return trimmed ? trimmed : fallback;
}
function prettify(value) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
export {
  RequestDetailPage as component
};
