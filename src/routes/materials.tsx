import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { ArrowRight, Clock, MapPin, PackageCheck, Search, Truck } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { materialCategories, materials, type MaterialCategory } from "@/data/materials";
import type { Specialty } from "@/data/providers";

const searchSchema = z.object({
  category: z.string().optional(),
  q: z.string().optional(),
});

const materialToSpecialty: Record<MaterialCategory, Specialty> = {
  Plumbing: "Plumbing",
  Electrical: "Electrical",
  Paint: "Painting",
  Cleaning: "Cleaning",
  Hardware: "Structural",
  Garden: "Landscaping",
};

export const Route = createFileRoute("/materials")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Materials market — Casmara Systems" },
      {
        name: "description",
        content:
          "Buy repair materials from local suppliers and request a vetted provider to install them.",
      },
    ],
  }),
  component: MaterialsPage,
});

function MaterialsPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/materials" });
  const [q, setQ] = useState(search.q ?? "");
  const active = (search.category ?? "All") as MaterialCategory | "All";

  const list = useMemo(() => {
    return materials.filter((item) => {
      const okCategory = active === "All" || item.category === active;
      const term = q.toLowerCase();
      const okQ =
        !term ||
        item.name.toLowerCase().includes(term) ||
        item.supplier.toLowerCase().includes(term) ||
        item.location.toLowerCase().includes(term);
      return okCategory && okQ;
    });
  }, [active, q]);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-10">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  Materials market
                </h1>
                <p className="mt-2 max-w-2xl text-muted-foreground">
                  Source approved facility repair materials, then request a provider to deliver,
                  install or use them on-site.
                </p>
              </div>
              <Button asChild>
                <Link to="/request">
                  Request installation <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search materials, supplier or location"
                  className="pl-9"
                />
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {(["All", ...materialCategories] as const).map((category) => {
                const isActive = active === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() =>
                      navigate({
                        search: (prev: { category?: string; q?: string }) => ({
                          ...prev,
                          category: category === "All" ? undefined : category,
                        }),
                      })
                    }
                    className={
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors " +
                      (isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-foreground hover:border-primary hover:text-primary")
                    }
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10">
          {list.length === 0 ? (
            <p className="text-muted-foreground">No materials match those filters.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {list.map((item) => (
                <Card
                  key={item.id}
                  className="border-border transition-shadow hover:shadow-[var(--shadow-card)]"
                >
                  <CardContent className="flex h-full flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Badge variant="outline">{item.category}</Badge>
                        <h3 className="mt-3 text-lg font-semibold text-foreground">{item.name}</h3>
                      </div>
                      <PackageCheck className="h-5 w-5 text-primary" />
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">{item.description}</p>
                    <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5" /> {item.supplier} • {item.location}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5" /> {item.stock}
                      </span>
                      <span className="flex items-center gap-2">
                        <Truck className="h-3.5 w-3.5" /> Delivery: {item.deliveryTime}
                      </span>
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                      <p className="text-sm">
                        <span className="font-semibold text-foreground">
                          USh {item.price.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground"> / {item.unit}</span>
                      </p>
                      <Button asChild size="sm" variant="outline">
                        <Link
                          to="/request"
                          search={
                            {
                              specialty: materialToSpecialty[item.category],
                            } as never
                          }
                        >
                          Request
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
