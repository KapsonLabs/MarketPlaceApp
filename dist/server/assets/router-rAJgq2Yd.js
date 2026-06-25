import { jsx, jsxs } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRouteWithContext, useRouter, Link, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, redirect, notFound, createRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import axios from "axios";
import { z } from "zod";
import { T as TSS_SERVER_FUNCTION, g as getServerFnById, c as createServerFn } from "./server-ChUyfcIq.js";
import { R as REQUEST_WIZARD_STEPS, a as REQUEST_STATUSES } from "./request-types-C9A69B28.js";
const appCss = "/assets/styles-BZgzZS4y.css";
function NotFoundComponent() {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-3", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/marketplace",
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Marketplace"
        }
      ),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/admin",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Admin"
        }
      )
    ] })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$p = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Casmara Systems — Service marketplace & admin" },
      {
        name: "description",
        content: "Request a vetted plumber, electrician, HVAC technician or handyman. Tenants and homeowners get matched in minutes."
      },
      { property: "og:title", content: "Casmara Systems" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" }
    ],
    links: [{ rel: "stylesheet", href: appCss }]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: { staleTime: 3e4, retry: 1, refetchOnWindowFocus: false }
      }
    })
  );
  return /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsx(Outlet, {}) });
}
const $$splitComponentImporter$n = () => import("./server-error-cLneMFlu.js");
const Route$o = createFileRoute("/server-error")({
  head: () => ({
    meta: [{
      title: "Server error — Casmara Systems"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$n, "component")
});
const $$splitComponentImporter$m = () => import("./marketplace-BFsOu0JM.js");
const Route$n = createFileRoute("/marketplace")({
  component: lazyRouteComponent($$splitComponentImporter$m, "component")
});
const STORAGE_KEY$1 = "casmara.marketplaceAuth";
const AUTH_EVENT$1 = "casmara-marketplace-auth";
function getMarketplaceSession() {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY$1);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    window.localStorage.removeItem(STORAGE_KEY$1);
    return null;
  }
}
function setMarketplaceSession(session) {
  window.localStorage.setItem(STORAGE_KEY$1, JSON.stringify(session));
  window.dispatchEvent(new Event(AUTH_EVENT$1));
}
function clearMarketplaceSession() {
  window.localStorage.removeItem(STORAGE_KEY$1);
  window.dispatchEvent(new Event(AUTH_EVENT$1));
}
function useMarketplaceSession() {
  const [session, setSession] = useState(() => getMarketplaceSession());
  useEffect(() => {
    const sync = () => setSession(getMarketplaceSession());
    window.addEventListener("storage", sync);
    window.addEventListener(AUTH_EVENT$1, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(AUTH_EVENT$1, sync);
    };
  }, []);
  return session;
}
async function loginMarketplace(payload) {
  const res = await api.post("/auth/login/", payload);
  const data = res.data?.data ?? res.data;
  setMarketplaceSession({
    access: data.access,
    refresh: data.refresh,
    user: data.user
  });
  return data.user;
}
const BASE_URL = "https://marketplace.casmara.iolabz.ug/api/v1";
const api = axios.create({
  baseURL: BASE_URL
});
function getAccessToken() {
  return getAdminSession()?.access ?? getMarketplaceSession()?.access;
}
api.interceptors.request.use((config) => {
  const access = getAccessToken();
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});
function extractErrorMessage(data) {
  if (typeof data === "string" && data.trim()) return data;
  if (data && typeof data === "object") {
    const obj = data;
    if (typeof obj.error === "string") return obj.error;
    if (typeof obj.detail === "string") return obj.detail;
    if (typeof obj.message === "string") return obj.message;
    for (const value of Object.values(obj)) {
      if (typeof value === "string" && value.trim()) return value;
      if (Array.isArray(value) && typeof value[0] === "string") return value[0];
    }
  }
  return "Something went wrong. Please try again.";
}
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status && status >= 500) {
      if (typeof window !== "undefined") {
        window.location.assign("/server-error");
      }
      return Promise.reject(error);
    }
    if (status === 401) {
      if (getAdminSession()) {
        clearAdminSession();
        if (typeof window !== "undefined") {
          window.location.assign("/admin/login");
        }
      } else if (getMarketplaceSession()) {
        clearMarketplaceSession();
        if (typeof window !== "undefined") {
          window.location.assign("/marketplace/sign-in");
        }
      }
      return Promise.reject(error);
    }
    if (status === 400 || status === 401) {
      error.uiMessage = extractErrorMessage(error.response?.data);
    }
    return Promise.reject(error);
  }
);
const STORAGE_KEY = "casmara.adminAuth";
const AUTH_EVENT = "casmara-admin-auth";
const ALLOWED_ROLE_SLUGS = ["admin", "provider"];
function isAllowedRole(user) {
  if (!user) return false;
  return ALLOWED_ROLE_SLUGS.includes(user.role?.slug);
}
function getAdminSession() {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}
function setAdminSession(session) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event(AUTH_EVENT));
}
function clearAdminSession() {
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(AUTH_EVENT));
}
function useAdminSession() {
  const [session, setSession] = useState(() => getAdminSession());
  useEffect(() => {
    const sync = () => setSession(getAdminSession());
    window.addEventListener("storage", sync);
    window.addEventListener(AUTH_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(AUTH_EVENT, sync);
    };
  }, []);
  return session;
}
async function loginAdmin(payload) {
  const res = await api.post("/auth/login/", payload);
  const data = res.data?.data ?? res.data;
  if (!isAllowedRole(data.user)) {
    throw new Error("This account is not authorized for the admin console.");
  }
  setAdminSession({ access: data.access, refresh: data.refresh, user: data.user });
  return data.user;
}
const $$splitComponentImporter$l = () => import("./admin-BFsOu0JM.js");
const Route$m = createFileRoute("/admin")({
  beforeLoad: ({
    location
  }) => {
    if (location.pathname === "/admin/login") return;
    if (!getAdminSession()) {
      throw redirect({
        to: "/admin/login",
        search: {
          redirect: location.pathname
        }
      });
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$l, "component")
});
const Route$l = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/marketplace" });
  }
});
const $$splitComponentImporter$k = () => import("./index-CobLscYc.js");
const Route$k = createFileRoute("/marketplace/")({
  head: () => ({
    meta: [{
      title: "Casmara Systems — Trusted home & property service providers"
    }, {
      name: "description",
      content: "Request a vetted plumber, electrician, HVAC technician or handyman. Tenants and homeowners get matched in minutes."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$k, "component")
});
const $$splitComponentImporter$j = () => import("./index-C6_3MgqZ.js");
const Route$j = createFileRoute("/admin/")({
  head: () => ({
    meta: [{
      title: "Dashboard — Casmara Systems Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$j, "component")
});
const $$splitComponentImporter$i = () => import("./sign-in-CLvEBSxJ.js");
const searchSchema$4 = z.object({
  redirect: z.string().optional()
});
const Route$i = createFileRoute("/marketplace/sign-in")({
  validateSearch: searchSchema$4,
  beforeLoad: () => {
    if (getMarketplaceSession()) {
      throw redirect({
        to: "/marketplace/requests"
      });
    }
  },
  head: () => ({
    meta: [{
      title: "Sign in — Casmara Systems"
    }, {
      name: "description",
      content: "Sign in or create an account to request facility management services."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import("./request-photos-rN4v2CyG.js");
const searchSchema$3 = z.object({
  id: z.string().min(1),
  title: z.string().optional()
});
const Route$h = createFileRoute("/marketplace/request-photos")({
  validateSearch: searchSchema$3,
  beforeLoad: ({
    search
  }) => {
    if (!search.id) {
      throw redirect({
        to: "/marketplace/requests"
      });
    }
  },
  head: () => ({
    meta: [{
      title: "Add photos — Casmara Systems"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("./request-BQJk7J7t.js");
const searchSchema$2 = z.object({
  providerId: z.string().optional(),
  categoryId: z.string().optional()
});
const Route$g = createFileRoute("/marketplace/request")({
  validateSearch: searchSchema$2,
  head: () => ({
    meta: [{
      title: "Request a service — Casmara Systems"
    }, {
      name: "description",
      content: "Submit a service request with job details, location, and contact information."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./providers-BtqY1Ozr.js");
const searchSchema$1 = z.object({
  specialty: z.string().optional(),
  welcome: z.string().optional()
});
const Route$f = createFileRoute("/marketplace/providers")({
  validateSearch: searchSchema$1,
  head: () => ({
    meta: [{
      title: "Browse providers — Casmara Systems"
    }, {
      name: "description",
      content: "Find vetted plumbers, electricians, HVAC techs, cleaners and more. All providers are background-checked and reviewed by customers."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./how-it-works-Bywn0WKj.js");
const Route$e = createFileRoute("/marketplace/how-it-works")({
  head: () => ({
    meta: [{
      title: "How it works — Casmara Systems"
    }, {
      name: "description",
      content: "How Casmara Systems routes maintenance requests from the public to the right service provider and into your property's maintenance queue."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./for-providers-JmPNwCfi.js");
const Route$d = createFileRoute("/marketplace/for-providers")({
  head: () => ({
    meta: [{
      title: "Become a Casmara Systems provider"
    }, {
      name: "description",
      content: "Join Casmara Systems to receive vetted maintenance jobs from tenants and homeowners."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./billing-gL1Nnsel.js");
const Route$c = createFileRoute("/marketplace/billing")({
  head: () => ({
    meta: [{
      title: "Billing — Casmara Systems"
    }, {
      name: "description",
      content: "Review estimates, outstanding balances and paid invoices for marketplace jobs."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./login-DEVlRzGN.js");
const searchSchema = z.object({
  redirect: z.string().optional()
});
const Route$b = createFileRoute("/admin/login")({
  validateSearch: searchSchema,
  beforeLoad: () => {
    if (getAdminSession()) {
      throw redirect({
        to: "/admin"
      });
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./requests.index-qsPsHjY4.js");
const Route$a = createFileRoute("/marketplace/requests/")({
  head: () => ({
    meta: [{
      title: "My requests — Casmara Systems"
    }, {
      name: "description",
      content: "Track your facility service requests, provider assignment and billing progress."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./tasks.index-BUOrDkLk.js");
const Route$9 = createFileRoute("/admin/tasks/")({
  head: () => ({
    meta: [{
      title: "Tasks — Casmara Systems Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./requests.index-8fM-UNxt.js");
const Route$8 = createFileRoute("/admin/requests/")({
  head: () => ({
    meta: [{
      title: "Requests — Casmara Systems Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./providers.index-5IErBOsr.js");
const Route$7 = createFileRoute("/admin/providers/")({
  head: () => ({
    meta: [{
      title: "Providers — Casmara Systems Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./payments.index-BbyQ4yYB.js");
const Route$6 = createFileRoute("/admin/payments/")({
  head: () => ({
    meta: [{
      title: "Payments — Casmara Systems Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./requests._requestId-BWqfw47z.js");
const Route$5 = createFileRoute("/marketplace/requests/$requestId")({
  head: () => ({
    meta: [{
      title: "Request detail — Casmara Systems"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const providers = [
  {
    id: "sp-001",
    name: "James Otieno",
    company: "Otieno Plumbing Works",
    specialty: "Plumbing",
    city: "Kampala",
    rating: 4.9,
    reviews: 184,
    hourlyRate: 1500,
    responseTime: "Under 1 hour",
    verified: true,
    bio: "Licensed plumber with 12 years on residential and commercial systems. Same-day emergency callouts.",
    yearsExperience: 12,
    completedJobs: 410,
    serviceAreas: ["Kampala Central", "Kololo", "Ntinda", "Naguru"],
    languages: ["English", "Luganda", "Swahili"],
    certifications: ["Licensed plumber", "Water systems safety", "Emergency leak response"],
    services: ["Leak detection", "Tap and valve repair", "Pump installation", "Drain unblocking"],
    availability: "Weekdays, Saturdays and emergency callouts",
    profileReviews: [
      {
        id: "rev-001",
        author: "Sarah N.",
        role: "Tenant",
        rating: 5,
        date: "Apr 2026",
        service: "Kitchen leak repair",
        comment: "Arrived on time, explained the repair clearly and helped source the missing parts before closing the job."
      },
      {
        id: "rev-002",
        author: "Property desk",
        role: "Landlord team",
        rating: 5,
        date: "Mar 2026",
        service: "Bathroom plumbing",
        comment: "Good updates through the job and clean handover photos for the tenant maintenance file."
      },
      {
        id: "rev-003",
        author: "Daniel K.",
        role: "Direct customer",
        rating: 4,
        date: "Feb 2026",
        service: "Water pump pressure issue",
        comment: "Diagnosed the pressure problem quickly and gave a fair quote before replacing the faulty valve."
      }
    ]
  },
  {
    id: "sp-002",
    name: "Aisha Mwangi",
    company: "BrightSpark Electrical",
    specialty: "Electrical",
    city: "Mbarara",
    rating: 4.8,
    reviews: 142,
    hourlyRate: 1800,
    responseTime: "Same day",
    verified: true,
    bio: "Certified electrician handling rewiring, panel upgrades, solar tie-ins, and fault finding.",
    yearsExperience: 9,
    completedJobs: 287,
    serviceAreas: ["Mbarara", "Nyamitanga", "Ruti", "Kakoba"],
    languages: ["English", "Runyankole", "Swahili"],
    certifications: ["Certified electrician", "Solar tie-in safety", "Panel upgrade specialist"],
    services: ["Fault finding", "Rewiring", "Socket installation", "Backup power setup"],
    availability: "Weekdays and booked weekend jobs",
    profileReviews: [
      {
        id: "rev-004",
        author: "Moses A.",
        role: "Property manager",
        rating: 5,
        date: "Apr 2026",
        service: "Distribution board repair",
        comment: "Clear diagnosis, tidy work and a useful safety note for future inspections."
      },
      {
        id: "rev-005",
        author: "Immaculate R.",
        role: "Tenant",
        rating: 5,
        date: "Mar 2026",
        service: "Power outage fault",
        comment: "She restored power fast and showed me which appliance had caused the trip."
      }
    ]
  },
  {
    id: "sp-003",
    name: "Daniel Kiprono",
    company: "CoolAir HVAC",
    specialty: "HVAC",
    city: "Entebbe",
    rating: 4.7,
    reviews: 96,
    hourlyRate: 2200,
    responseTime: "Next day",
    verified: true,
    bio: "Air-conditioning install, service, and refrigerant work for apartments and offices.",
    yearsExperience: 7,
    completedJobs: 168,
    serviceAreas: ["Entebbe", "Kitoro", "Katabi", "Kajjansi"],
    languages: ["English", "Luganda"],
    certifications: ["HVAC service technician", "Refrigerant handling"],
    services: ["AC servicing", "Filter replacement", "Refrigerant top-up", "Thermostat repair"],
    availability: "Next-day appointments and planned maintenance visits",
    profileReviews: [
      {
        id: "rev-006",
        author: "Airport Office Park",
        role: "Facilities team",
        rating: 5,
        date: "Apr 2026",
        service: "Office AC servicing",
        comment: "Professional scheduling and every unit was tagged with service notes after inspection."
      },
      {
        id: "rev-007",
        author: "Linda M.",
        role: "Direct customer",
        rating: 4,
        date: "Jan 2026",
        service: "Bedroom AC repair",
        comment: "The unit is cooling properly again and the quote was explained before work started."
      }
    ]
  },
  {
    id: "sp-004",
    name: "Grace Wambui",
    company: "Wambui Appliance Repair",
    specialty: "Appliance",
    city: "Wakiso",
    rating: 4.9,
    reviews: 211,
    hourlyRate: 1200,
    responseTime: "Same day",
    verified: true,
    bio: "Fridges, washing machines, ovens — fixed in-home with a 90-day workmanship warranty.",
    yearsExperience: 11,
    completedJobs: 502,
    serviceAreas: ["Wakiso", "Kira", "Namugongo", "Najjera"],
    languages: ["English", "Luganda"],
    certifications: ["Appliance diagnostics", "Refrigeration repair"],
    services: ["Fridge repair", "Washer repair", "Oven diagnostics", "Spare part fitting"],
    availability: "Same-day diagnostics when parts are available",
    profileReviews: [
      {
        id: "rev-008",
        author: "Janet O.",
        role: "Tenant",
        rating: 5,
        date: "Apr 2026",
        service: "Fridge repair",
        comment: "Grace found the fault quickly and returned with the correct part the same afternoon."
      },
      {
        id: "rev-009",
        author: "Samuel T.",
        role: "Landlord",
        rating: 5,
        date: "Feb 2026",
        service: "Washing machine service",
        comment: "Helpful repair report and photos made it easy to approve the final payment."
      }
    ]
  },
  {
    id: "sp-005",
    name: "Peter Kamau",
    company: "Solid Build Co.",
    specialty: "Structural",
    city: "Kiambu",
    rating: 4.6,
    reviews: 58,
    hourlyRate: 2500,
    responseTime: "1–2 days",
    verified: true,
    bio: "Cracks, masonry, roofing repairs, waterproofing. NCA-registered contractor.",
    yearsExperience: 15,
    completedJobs: 134
  },
  {
    id: "sp-006",
    name: "Mary Achieng",
    company: "SparkleHome Cleaning",
    specialty: "Cleaning",
    city: "Kampala",
    rating: 4.8,
    reviews: 320,
    hourlyRate: 800,
    responseTime: "Same day",
    verified: true,
    bio: "Deep cleans, post-tenancy moveouts, carpet shampooing.",
    yearsExperience: 6,
    completedJobs: 870
  },
  {
    id: "sp-007",
    name: "Brian Ndegwa",
    company: "FreshCoat Painters",
    specialty: "Painting",
    city: "Nakuru",
    rating: 4.7,
    reviews: 74,
    hourlyRate: 1e3,
    responseTime: "Next day",
    verified: false,
    bio: "Interior and exterior painting, decorative finishes, free colour consultation.",
    yearsExperience: 8,
    completedJobs: 192
  },
  {
    id: "sp-008",
    name: "Lucy Njeri",
    company: "GreenScape Gardens",
    specialty: "Landscaping",
    city: "Kampala",
    rating: 4.9,
    reviews: 63,
    hourlyRate: 1100,
    responseTime: "1–2 days",
    verified: true,
    bio: "Garden design, lawn care, irrigation, and outdoor lighting.",
    yearsExperience: 10,
    completedJobs: 145
  }
];
const specialties = [
  "Plumbing",
  "Electrical",
  "HVAC",
  "Appliance",
  "Structural",
  "Cleaning",
  "Painting",
  "Landscaping",
  "Other"
];
function getProvider(id) {
  return providers.find((p) => p.id === id);
}
const SPECIALTY_IMAGES = {
  Plumbing: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=1200&q=70",
  Electrical: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=70",
  HVAC: "https://images.unsplash.com/photo-1631545308456-15bbf41a1d62?auto=format&fit=crop&w=1200&q=70",
  Appliance: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=70",
  Structural: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=70",
  Cleaning: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=70",
  Painting: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1200&q=70",
  Landscaping: "https://images.unsplash.com/photo-1599629954294-14df9ec8bc34?auto=format&fit=crop&w=1200&q=70",
  Other: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=1200&q=70"
};
function providerCover(p) {
  return p.coverImage ?? SPECIALTY_IMAGES[p.specialty];
}
function providerGallery(p) {
  if (p.gallery && p.gallery.length) return p.gallery;
  return [
    SPECIALTY_IMAGES[p.specialty],
    "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=900&q=70",
    "https://images.unsplash.com/photo-1503389152951-9f343605f61e?auto=format&fit=crop&w=900&q=70"
  ];
}
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const photoSchema = z.object({
  name: z.string().min(1).max(200),
  type: z.string().regex(/^image\/(jpeg|png|webp|heic|heif)$/),
  size: z.number().int().min(1).max(5 * 1024 * 1024),
  dataUrl: z.string().startsWith("data:image/").max(7 * 1024 * 1024)
});
const schema = z.object({
  audience: z.enum(["tenant", "public"]),
  userId: z.string().min(1).max(120),
  propertyCode: z.string().max(60).optional(),
  unitNumber: z.string().max(40).optional(),
  specialty: z.enum(["Plumbing", "Electrical", "HVAC", "Appliance", "Structural", "Cleaning", "Painting", "Landscaping", "Other"]),
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(2e3),
  priority: z.enum(["Low", "Medium", "High", "Emergency"]),
  preferredProviderId: z.string().max(60).optional(),
  photos: z.array(photoSchema).max(5).optional(),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    accuracy: z.number().min(0).max(1e5).optional(),
    address: z.string().max(300).optional()
  }),
  scheduledFor: z.string().min(1).max(40).optional().refine((v) => {
    if (!v) return true;
    const t = Date.parse(v);
    if (Number.isNaN(t)) return false;
    return t >= Date.now() - 6e4;
  }, {
    message: "Scheduled date must be in the future"
  }),
  wizardStep: z.enum(REQUEST_WIZARD_STEPS).optional(),
  stepHistory: z.array(z.object({
    step: z.enum(REQUEST_WIZARD_STEPS),
    at: z.string().min(1).max(40)
  })).max(20).optional()
});
createServerFn({
  method: "POST"
}).validator((input) => schema.parse(input)).handler(createSsrRpc("e93aa084b225a10de1c927126a1ff459d5215406b06be5c36583b8118888976c"));
createServerFn({
  method: "GET"
}).handler(createSsrRpc("ae1c822e848442ea126b03d3acf47186b7a61075e203217837b714bc7319404f"));
const userRequestsSchema = z.object({
  userId: z.string().min(1).max(120)
});
createServerFn({
  method: "GET"
}).validator((input) => userRequestsSchema.parse(input)).handler(createSsrRpc("66a65aa5f762496a265dd3d400a6a92d6fa165646732f6c7addcac08570b33d8"));
const listUserBilling = createServerFn({
  method: "GET"
}).validator((input) => userRequestsSchema.parse(input)).handler(createSsrRpc("f684a10c0f613c2af52b6847254d9b491d6f7e7ebad63d86e93bf70095401efa"));
const paymentSchema = z.object({
  requestId: z.string().min(1).max(60),
  amount: z.number().int().positive(),
  type: z.enum(["deposit", "final"])
});
const recordPayment = createServerFn({
  method: "POST"
}).validator((input) => paymentSchema.parse(input)).handler(createSsrRpc("77dc76e87809f5163979bb4a7b39cf2b6b1fa09a8b1d676128f58ab3b03e31cb"));
const statusSchema = z.object({
  id: z.string().min(1).max(60),
  status: z.enum(REQUEST_STATUSES),
  notes: z.string().max(2e3).optional()
});
createServerFn({
  method: "POST"
}).validator((input) => statusSchema.parse(input)).handler(createSsrRpc("3b6dc1f6c0f86709b4fd7a3d49654aa6ce126925b74f3b75dab4e2af7c8e3764"));
const reviewSchema = z.object({
  requestId: z.string().min(1).max(60),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(3).max(1e3),
  author: z.string().min(1).max(120)
});
createServerFn({
  method: "POST"
}).validator((input) => reviewSchema.parse(input)).handler(createSsrRpc("75e9bd6d5dbfae96f2259e728dd8b00e5d30415f4b76c329ce99d3c645657d12"));
const providerReviewsSchema = z.object({
  providerId: z.string().min(1).max(60)
});
const listReviewsForProvider = createServerFn({
  method: "GET"
}).validator((input) => providerReviewsSchema.parse(input)).handler(createSsrRpc("0ec8f1406d99d780386558a75c73332e27484c13f07845bb5b7f2472a94274aa"));
const $$splitComponentImporter$4 = () => import("./providers._providerId-B7Al8BiJ.js");
const $$splitErrorComponentImporter = () => import("./providers._providerId-D0egeHF6.js");
const $$splitNotFoundComponentImporter$4 = () => import("./providers._providerId-B-J1zzA_.js");
const Route$4 = createFileRoute("/marketplace/providers/$providerId")({
  loader: async ({
    params
  }) => {
    const provider = getProvider(params.providerId);
    if (!provider) throw notFound();
    const {
      reviews: marketplaceReviews
    } = await listReviewsForProvider({
      data: {
        providerId: provider.id
      }
    });
    return {
      provider,
      marketplaceReviews
    };
  },
  head: ({
    loaderData
  }) => ({
    meta: loaderData ? [{
      title: `${loaderData.provider.company} — Casmara Systems`
    }, {
      name: "description",
      content: loaderData.provider.bio
    }] : []
  }),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$4, "notFoundComponent"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitNotFoundComponentImporter$3 = () => import("./tasks._taskId-Crx_XnJ_.js");
const $$splitComponentImporter$3 = () => import("./tasks._taskId-ly80ui91.js");
const Route$3 = createFileRoute("/admin/tasks/$taskId")({
  head: () => ({
    meta: [{
      title: "Task detail — Casmara Systems Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$3, "notFoundComponent")
});
const $$splitNotFoundComponentImporter$2 = () => import("./requests._requestId-Dbyj5Xne.js");
const $$splitComponentImporter$2 = () => import("./requests._requestId-jZarjaf-.js");
const Route$2 = createFileRoute("/admin/requests/$requestId")({
  head: () => ({
    meta: [{
      title: "Request detail — Casmara Systems Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$2, "notFoundComponent")
});
const $$splitNotFoundComponentImporter$1 = () => import("./providers._providerId-CS9bkwiG.js");
const $$splitComponentImporter$1 = () => import("./providers._providerId-S4V-qPVM.js");
const Route$1 = createFileRoute("/admin/providers/$providerId")({
  head: () => ({
    meta: [{
      title: "Provider detail - Casmara Systems Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$1, "notFoundComponent")
});
const $$splitNotFoundComponentImporter = () => import("./payments._paymentId-_szlYbLF.js");
const $$splitComponentImporter = () => import("./payments._paymentId-Cf3xTJbg.js");
const Route = createFileRoute("/admin/payments/$paymentId")({
  head: () => ({
    meta: [{
      title: "Payment detail — Casmara Systems Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent")
});
const ServerErrorRoute = Route$o.update({
  id: "/server-error",
  path: "/server-error",
  getParentRoute: () => Route$p
});
const MarketplaceRoute = Route$n.update({
  id: "/marketplace",
  path: "/marketplace",
  getParentRoute: () => Route$p
});
const AdminRoute = Route$m.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$p
});
const IndexRoute = Route$l.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$p
});
const MarketplaceIndexRoute = Route$k.update({
  id: "/",
  path: "/",
  getParentRoute: () => MarketplaceRoute
});
const AdminIndexRoute = Route$j.update({
  id: "/",
  path: "/",
  getParentRoute: () => AdminRoute
});
const MarketplaceSignInRoute = Route$i.update({
  id: "/sign-in",
  path: "/sign-in",
  getParentRoute: () => MarketplaceRoute
});
const MarketplaceRequestPhotosRoute = Route$h.update({
  id: "/request-photos",
  path: "/request-photos",
  getParentRoute: () => MarketplaceRoute
});
const MarketplaceRequestRoute = Route$g.update({
  id: "/request",
  path: "/request",
  getParentRoute: () => MarketplaceRoute
});
const MarketplaceProvidersRoute = Route$f.update({
  id: "/providers",
  path: "/providers",
  getParentRoute: () => MarketplaceRoute
});
const MarketplaceHowItWorksRoute = Route$e.update({
  id: "/how-it-works",
  path: "/how-it-works",
  getParentRoute: () => MarketplaceRoute
});
const MarketplaceForProvidersRoute = Route$d.update({
  id: "/for-providers",
  path: "/for-providers",
  getParentRoute: () => MarketplaceRoute
});
const MarketplaceBillingRoute = Route$c.update({
  id: "/billing",
  path: "/billing",
  getParentRoute: () => MarketplaceRoute
});
const AdminLoginRoute = Route$b.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => AdminRoute
});
const MarketplaceRequestsIndexRoute = Route$a.update({
  id: "/requests/",
  path: "/requests/",
  getParentRoute: () => MarketplaceRoute
});
const AdminTasksIndexRoute = Route$9.update({
  id: "/tasks/",
  path: "/tasks/",
  getParentRoute: () => AdminRoute
});
const AdminRequestsIndexRoute = Route$8.update({
  id: "/requests/",
  path: "/requests/",
  getParentRoute: () => AdminRoute
});
const AdminProvidersIndexRoute = Route$7.update({
  id: "/providers/",
  path: "/providers/",
  getParentRoute: () => AdminRoute
});
const AdminPaymentsIndexRoute = Route$6.update({
  id: "/payments/",
  path: "/payments/",
  getParentRoute: () => AdminRoute
});
const MarketplaceRequestsRequestIdRoute = Route$5.update({
  id: "/requests/$requestId",
  path: "/requests/$requestId",
  getParentRoute: () => MarketplaceRoute
});
const MarketplaceProvidersProviderIdRoute = Route$4.update({
  id: "/$providerId",
  path: "/$providerId",
  getParentRoute: () => MarketplaceProvidersRoute
});
const AdminTasksTaskIdRoute = Route$3.update({
  id: "/tasks/$taskId",
  path: "/tasks/$taskId",
  getParentRoute: () => AdminRoute
});
const AdminRequestsRequestIdRoute = Route$2.update({
  id: "/requests/$requestId",
  path: "/requests/$requestId",
  getParentRoute: () => AdminRoute
});
const AdminProvidersProviderIdRoute = Route$1.update({
  id: "/providers/$providerId",
  path: "/providers/$providerId",
  getParentRoute: () => AdminRoute
});
const AdminPaymentsPaymentIdRoute = Route.update({
  id: "/payments/$paymentId",
  path: "/payments/$paymentId",
  getParentRoute: () => AdminRoute
});
const AdminRouteChildren = {
  AdminLoginRoute,
  AdminIndexRoute,
  AdminPaymentsPaymentIdRoute,
  AdminProvidersProviderIdRoute,
  AdminRequestsRequestIdRoute,
  AdminTasksTaskIdRoute,
  AdminPaymentsIndexRoute,
  AdminProvidersIndexRoute,
  AdminRequestsIndexRoute,
  AdminTasksIndexRoute
};
const AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren);
const MarketplaceProvidersRouteChildren = {
  MarketplaceProvidersProviderIdRoute
};
const MarketplaceProvidersRouteWithChildren = MarketplaceProvidersRoute._addFileChildren(MarketplaceProvidersRouteChildren);
const MarketplaceRouteChildren = {
  MarketplaceBillingRoute,
  MarketplaceForProvidersRoute,
  MarketplaceHowItWorksRoute,
  MarketplaceProvidersRoute: MarketplaceProvidersRouteWithChildren,
  MarketplaceRequestRoute,
  MarketplaceRequestPhotosRoute,
  MarketplaceSignInRoute,
  MarketplaceIndexRoute,
  MarketplaceRequestsRequestIdRoute,
  MarketplaceRequestsIndexRoute
};
const MarketplaceRouteWithChildren = MarketplaceRoute._addFileChildren(
  MarketplaceRouteChildren
);
const rootRouteChildren = {
  IndexRoute,
  AdminRoute: AdminRouteWithChildren,
  MarketplaceRoute: MarketplaceRouteWithChildren,
  ServerErrorRoute
};
const routeTree = Route$p._addFileChildren(rootRouteChildren)._addFileTypes();
function DefaultErrorComponent({ error, reset }) {
  const router2 = useRouter();
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10", children: /* @__PURE__ */ jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        className: "h-8 w-8 text-destructive",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: 2,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            d: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          }
        )
      }
    ) }),
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight text-foreground", children: "Something went wrong" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "An unexpected error occurred. Please try again." }),
    false,
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex items-center justify-center gap-3", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultErrorComponent
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$i as R,
  SPECIALTY_IMAGES as S,
  providers as a,
  Route$h as b,
  Route$g as c,
  Route$f as d,
  listUserBilling as e,
  Route$b as f,
  loginAdmin as g,
  Route$5 as h,
  Route$4 as i,
  providerGallery as j,
  getMarketplaceSession as k,
  loginMarketplace as l,
  clearMarketplaceSession as m,
  Route$3 as n,
  api as o,
  providerCover as p,
  getAdminSession as q,
  recordPayment as r,
  specialties as s,
  useAdminSession as t,
  useMarketplaceSession as u,
  clearAdminSession as v,
  Route$2 as w,
  Route$1 as x,
  Route as y,
  router as z
};
