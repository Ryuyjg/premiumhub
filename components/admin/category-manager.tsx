"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Box, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Category, Product } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FEATURED_CATEGORY_SLUG } from "@/lib/catalog";
import { ImageUploader } from "@/components/admin/image-uploader";

type CategoryForm = {
  id?: string;
  name: string;
  description: string;
  imageUrl: string;
};

const initialForm: CategoryForm = {
  name: "",
  description: "",
  imageUrl: ""
};

export function CategoryManager({
  categories,
  products
}: {
  categories: Category[];
  products: Product[];
}) {
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryForm>(initialForm);

  const categoryUsage = useMemo(() => {
    const usageMap = new Map<string, number>();
    products.forEach((product) => {
      usageMap.set(product.categoryId, (usageMap.get(product.categoryId) || 0) + 1);
    });
    return usageMap;
  }, [products]);

  function resetForm() {
    setForm(initialForm);
  }

  function editCategory(category: Category) {
    setForm({
      id: category.id,
      name: category.name,
      description: category.description || "",
      imageUrl: category.imageUrl || ""
    });
  }

  async function saveCategory() {
    setSubmitting(true);
    try {
      const payload = {
        id: form.id,
        name: form.name.trim(),
        description: form.description.trim(),
        imageUrl: form.imageUrl.trim()
      };

      if (!payload.name) {
        throw new Error("Category name is required.");
      }

      const response = await fetch("/api/admin/categories", {
        method: form.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Unable to save category.");
      }

      toast.success(form.id ? "Category updated." : "Category created.");
      resetForm();
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Category save failed.");
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
      const response = await fetch(`/api/admin/categories?id=${category.id}`, {
        method: "DELETE"
      });
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
      <h2 className="text-xl font-semibold">{form.id ? "Edit category" : "Category management"}</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Create, edit, add descriptions, and set category images. Deletion stays blocked while products still use that
        category.
      </p>

      <div className="mt-5 grid gap-4">
        <Input
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          placeholder="Category name"
          required
        />
        <textarea
          value={form.description}
          onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
          placeholder="Category description"
          className="field min-h-28 py-3"
        />

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Category image</p>
          <div className="flex flex-wrap items-center gap-3">
            <ImageUploader onUploaded={(url) => setForm((current) => ({ ...current, imageUrl: url }))} />
            {form.imageUrl ? (
              <Button type="button" variant="ghost" onClick={() => setForm((current) => ({ ...current, imageUrl: "" }))}>
                Remove image
              </Button>
            ) : null}
          </div>
          {form.imageUrl ? (
            <div className="surface overflow-hidden rounded-[1.5rem] p-3">
              <div className="relative aspect-[16/8] overflow-hidden rounded-[1.15rem]">
                <Image src={form.imageUrl} alt={form.name || "Category preview"} fill className="object-cover" />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Image ready for this category.</p>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Upload an image if you want this category to have its own visual.</p>
          )}
        </div>

        <div className="flex gap-3">
          <Button type="button" onClick={() => void saveCategory()} disabled={submitting}>
            {submitting ? "Saving..." : form.id ? "Update category" : "Create category"}
          </Button>
          {form.id ? (
            <Button type="button" variant="ghost" onClick={resetForm}>
              Cancel edit
            </Button>
          ) : null}
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        {categories.map((category) => {
          const productCount = categoryUsage.get(category.id) || 0;
          const inUse = productCount > 0;
          const isDeleting = deletingId === category.id;
          const highlighted = category.slug === FEATURED_CATEGORY_SLUG;

          return (
            <div key={category.id} className="rounded-2xl border border-border/80 px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  {category.imageUrl ? (
                    <div className="relative mb-3 aspect-[16/7] overflow-hidden rounded-[1.1rem] border border-border/70">
                      <Image src={category.imageUrl} alt={category.name} fill className="object-cover" />
                    </div>
                  ) : null}
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{category.name}</p>
                    {highlighted ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                        Main product
                      </span>
                    ) : null}
                    <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-muted/35 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      <Box className="h-3.5 w-3.5" />
                      {productCount} product{productCount === 1 ? "" : "s"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{category.description || "No description added."}</p>
                  {inUse ? (
                    <p className="mt-1 text-xs text-amber-600 dark:text-amber-300">In use, delete disabled.</p>
                  ) : highlighted ? (
                    <p className="mt-1 text-xs text-primary">Keep this lane for your flagship Telegram automation listings.</p>
                  ) : (
                    <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-300">Safe to delete.</p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => editCategory(category)}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-border/70 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-foreground transition hover:bg-muted/40"
                    aria-label={`Edit ${category.name}`}
                    title="Edit category"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => void deleteCategory(category)}
                    disabled={inUse || isDeleting}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-rose-500/30 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-rose-600 transition hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:border-border/60 disabled:text-muted-foreground"
                    aria-label={`Delete ${category.name}`}
                    title={inUse ? "Move linked products first" : "Delete category"}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
