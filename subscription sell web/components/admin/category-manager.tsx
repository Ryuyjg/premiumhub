"use client";

import { useMemo, useState } from "react";
import { Box, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Category, Product } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function CategoryManager({
  categories,
  products
}: {
  categories: Category[];
  products: Product[];
}) {
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const categoryUsage = useMemo(() => {
    const usageMap = new Map<string, number>();
    products.forEach((product) => {
      usageMap.set(product.categoryId, (usageMap.get(product.categoryId) || 0) + 1);
    });
    return usageMap;
  }, [products]);

  async function createCategory(formData: FormData) {
    setSubmitting(true);
    try {
      const payload = {
        name: String(formData.get("name")),
        description: String(formData.get("description")),
        accent: String(formData.get("accent"))
      };

      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Unable to create category.");
      }

      toast.success("Category created.");
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Category creation failed.");
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteCategory(category: Category) {
    const productCount = categoryUsage.get(category.id) || 0;
    if (productCount > 0) {
      toast.error(`Move or delete ${productCount} product${productCount === 1 ? "" : "s"} from ${category.name} first.`);
      return;
    }

    if (!confirm(`Delete "${category.name}" category?`)) {
      return;
    }

    setDeletingId(category.id);
    try {
      const response = await fetch(`/api/admin/categories?id=${category.id}`, { method: "DELETE" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "Unable to delete category.");
      }
      toast.success("Category deleted.");
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Category delete failed.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <Card className="h-full">
      <h2 className="text-xl font-semibold">Category architecture</h2>
      <p className="mt-1 text-sm text-muted-foreground">Organize product families and safely remove unused categories.</p>
      <form action={createCategory} className="mt-5 grid gap-4">
        <Input name="name" placeholder="Movies and Entertainment" required />
        <Input name="accent" placeholder="sky" />
        <textarea
          name="description"
          placeholder="Category description"
          className="min-h-24 rounded-[1.25rem] border border-border/80 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15 dark:bg-white/5"
        />
        <Button disabled={submitting}>{submitting ? "Saving..." : "Create category"}</Button>
      </form>
      <div className="mt-6 grid gap-3">
        {categories.map((category) => {
          const productCount = categoryUsage.get(category.id) || 0;
          const inUse = productCount > 0;
          const isDeleting = deletingId === category.id;

          return (
            <div key={category.id} className="rounded-2xl border border-border/80 px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{category.name}</p>
                    <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-muted/35 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      <Box className="h-3.5 w-3.5" />
                      {productCount} product{productCount === 1 ? "" : "s"}
                    </span>
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">{category.accent || "default"}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{category.slug}</p>
                  {inUse ? (
                    <p className="mt-1 text-xs text-amber-600 dark:text-amber-300">In use, delete disabled.</p>
                  ) : (
                    <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-300">Safe to delete.</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => void deleteCategory(category)}
                  disabled={inUse || isDeleting}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-rose-500/25 text-rose-600 transition hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:border-border/60 disabled:text-muted-foreground"
                  aria-label={`Delete ${category.name}`}
                  title={inUse ? "Move linked products first" : "Delete category"}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
