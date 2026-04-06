"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Pencil, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Offer } from "@/types";
import { OFFER_THEMES, resolveOfferTheme } from "@/lib/offer-themes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type OfferForm = {
  id?: string;
  title: string;
  description: string;
  badge: string;
  accent: string;
  ctaLabel: string;
  ctaUrl: string;
  order: string;
  active: boolean;
};

const initialForm: OfferForm = {
  title: "",
  description: "",
  badge: "",
  accent: "ocean",
  ctaLabel: "Explore",
  ctaUrl: "/products",
  order: "0",
  active: true
};

export function OfferManager({ offers }: { offers: Offer[] }) {
  const [query, setQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<OfferForm>(initialForm);

  const filteredOffers = useMemo(
    () =>
      offers.filter((offer) =>
        `${offer.title} ${offer.description}`.toLowerCase().includes(query.toLowerCase())
      ),
    [offers, query]
  );

  function resetForm() {
    setForm(initialForm);
  }

  async function saveOffer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        id: form.id,
        title: form.title.trim(),
        description: form.description.trim(),
        badge: form.badge.trim(),
        accent: form.accent.trim(),
        ctaLabel: form.ctaLabel.trim(),
        ctaUrl: form.ctaUrl.trim(),
        order: Number(form.order || "0"),
        active: form.active
      };

      if (!payload.title || !payload.description) {
        throw new Error("Title and description are required.");
      }

      const response = await fetch("/api/admin/offers", {
        method: form.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Unable to save offer.");
      }

      toast.success(form.id ? "Offer updated." : "Offer created.");
      resetForm();
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Offer save failed.");
    } finally {
      setSubmitting(false);
    }
  }

  function editOffer(offer: Offer) {
    const theme = resolveOfferTheme(offer.accent);

    setForm({
      id: offer.id,
      title: offer.title,
      description: offer.description,
      badge: offer.badge || "",
      accent: theme.id,
      ctaLabel: offer.ctaLabel || "Explore",
      ctaUrl: offer.ctaUrl || "/products",
      order: String(offer.order ?? 0),
      active: offer.active !== false
    });
  }

  async function deleteOffer(id: string) {
    if (!confirm("Delete this offer?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/offers?id=${id}`, {
        method: "DELETE"
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "Unable to delete offer.");
      }
      toast.success("Offer deleted.");
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed.");
    }
  }

  return (
    <Card className="h-full">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">{form.id ? "Edit offer" : "Offers section"}</h2>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{offers.length} offers</p>
      </div>

      <div className="mt-5 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <form onSubmit={saveOffer} className="grid gap-4">
          <Input
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            placeholder="Offer title"
            required
          />
          <textarea
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            placeholder="Offer description"
            className="min-h-24 rounded-[1.25rem] border border-border/80 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15 dark:bg-white/5"
            required
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              value={form.badge}
              onChange={(event) => setForm((current) => ({ ...current, badge: event.target.value }))}
              placeholder="Badge (optional)"
            />
            <Input
              value={form.order}
              onChange={(event) => setForm((current) => ({ ...current, order: event.target.value }))}
              type="number"
              min="0"
              placeholder="Sort order"
            />
            <Input
              value={form.ctaLabel}
              onChange={(event) => setForm((current) => ({ ...current, ctaLabel: event.target.value }))}
              placeholder="CTA label"
            />
            <Input
              value={form.ctaUrl}
              onChange={(event) => setForm((current) => ({ ...current, ctaUrl: event.target.value }))}
              placeholder="CTA URL"
            />
          </div>
          <label className="grid gap-2 text-sm text-muted-foreground">
            <span>Offer theme</span>
            <select
              value={form.accent}
              onChange={(event) => setForm((current) => ({ ...current, accent: event.target.value }))}
              className="h-11 rounded-2xl border border-border/80 bg-white/80 px-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15 dark:bg-white/5"
            >
              {OFFER_THEMES.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.name} - {theme.description}
                </option>
              ))}
            </select>
          </label>
          <div
            className="relative overflow-hidden rounded-[1.35rem] border border-white/15 p-4 text-white shadow-[0_18px_50px_rgba(15,23,42,0.18)]"
            style={{ backgroundImage: resolveOfferTheme(form.accent).gradient }}
          >
            <div className="absolute -right-10 top-0 h-24 w-24 rounded-full bg-white/15 blur-2xl" />
            <p className="relative text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Preview</p>
            <p className="relative mt-2 text-lg font-semibold">{form.title || "Premium launch offer"}</p>
            <p className="relative mt-2 text-sm text-white/78">
              {form.description || "Your selected theme will be used in the storefront offers section."}
            </p>
          </div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(event) => setForm((current) => ({ ...current, active: event.target.checked }))}
              className="h-4 w-4"
            />
            Active offer
          </label>
          <div className="flex gap-3">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : form.id ? "Update offer" : "Create offer"}
            </Button>
            {form.id ? (
              <Button type="button" variant="ghost" onClick={resetForm}>
                Cancel edit
              </Button>
            ) : null}
          </div>
        </form>

        <div className="space-y-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search offers"
              className="pl-10"
            />
          </div>
          <div className="max-h-[32rem] space-y-3 overflow-y-auto rounded-2xl border border-border/80 p-3">
            {filteredOffers.map((offer) => (
              <div key={offer.id} className="rounded-2xl border border-border/80 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{offer.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{offer.description}</p>
                  </div>
                  <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    #{offer.order ?? 0}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${
                      offer.active
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                        : "bg-slate-500/10 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {offer.active ? "active" : "inactive"}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => editOffer(offer)}
                      className="rounded-full border border-border/70 p-2 text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteOffer(offer.id)}
                      className="rounded-full border border-rose-500/20 p-2 text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredOffers.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">No offers found.</p>
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  );
}
