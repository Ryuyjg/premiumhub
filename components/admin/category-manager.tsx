"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Box, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Category, Product } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FEATURED_CATEGORY_SLUG } from "@/lib/catalog";
import { ImageUploader } from "@/components/admin/image-uploader";

type CategoryForm = {
  id?: string;
  name: string;
  description: string;
  imageUrl: string;
  order: string;
};

const initialForm: CategoryForm = {
  name: "",
  description: "",
  imageUrl: "",
  order: ""
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
  const [reorderingId, setReorderingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryForm>(initialForm);

  const categoryUsage = useMemo(() => {
    const usageMap = new Map<string, number>();
    products.forEach((product) => {
      usageMap.set(product.categoryId, (usageMap.get(product.categoryId) || 0) + 1);
    });
    return usageMap;
  }, [products]);

  const orderedCategories = useMemo(() => {
    return [...categories].sort((a, b) => {
      const aOrder = typeof a.order === "number" ? a.order : Number.MAX_SAFE_INTEGER;
      const bOrder = typeof b.order === "number" ? b.order : Number.MAX_SAFE_INTEGER;
      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }
      return a.name.localeCompare(b.name);
    });
  }, [categories]);

  function resetForm() {
    setForm(initialForm);
  }

  function editCategory(category: Category) {
    setForm({
      id: category.id,
      name: category.name,
      description: category.description || "",
      imageUrl: category.imageUrl || "",
      order: String(category.order ?? 0)
    });
  }

  async function saveCategory() {
    setSubmitting(true);
    try {
      const payload = {
        id: form.id,
        name: form.name.trim(),
        description: form.description.trim(),
        imageUrl: form.imageUrl.trim(),
        order: form.order === "" ? undefined : Number(form.order)
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

  async function reorderCategory(category: Category, direction: "up" | "down") {
    const currentIndex = categories.findIndex((item) => item.id === category.id);
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const target = categories[targetIndex];

    if (currentIndex < 0 || !target) {
      return;
    }

    const currentOrder = Number(category.order ?? currentIndex);
    const targetOrder = Number(target.order ?? targetIndex);

    setReorderingId(category.id);
    try {
      const response = await fetch("/api/admin/categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          updates: [
            { id: category.id, order: targetOrder },
            { id: target.id, order: currentOrder }
          ]
        })
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Unable to reorder categories.");
      }

      toast.success("Category order updated.");
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Category reorder failed.");
    } finally {
      setReorderingId(null);
    }
  }

  async function deleteCategory(category: Category) {
    const productCount = categoryUsage.get(category.id) || 0;
    if (productCount > 0) {
      toast.error(`Move or delete ${productCount} product${productCount === 1 ? "" : "s"} from ${category.name} first.`);
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
      setConfirmDelete(null);
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
        <Input
          type="number"
          min="0"
          value={form.order}
          onChange={(event) => setForm((current) => ({ ...current, order: event.target.value }))}
          placeholder="Sort order"
        />
        <p className="text-xs text-muted-foreground">Lower numbers appear first. Use `0` for the top category.</p>
        <textarea
          value={form.description}
          onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
          placeholder="Category description"
          className="min-h-28 w-full rounded-[1.25rem] border border-border/80 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15 dark:bg-white/5"
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
              <div className="relative h-36 overflow-hidden rounded-[1.15rem]">
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

      <div className="mt-6 max-h-[34rem] space-y-2 overflow-y-auto pr-1">
        {orderedCategories.map((category, index) => {
          const productCount = categoryUsage.get(category.id) || 0;
          const inUse = productCount > 0;
          const isDeleting = deletingId === category.id;
          const highlighted = category.slug === FEATURED_CATEGORY_SLUG;
          const isReordering = reorderingId === category.id;

          return (
            <div key={category.id} className="rounded-2xl border border-border/80 px-3 py-3 md:px-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-border/70 bg-muted/30">
                    {category.imageUrl ? (
                      <Image src={category.imageUrl} alt={category.name} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <Box className="h-4 w-4" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{category.name}</p>
                      {highlighted ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
                          Main product
                        </span>
                      ) : null}
                      <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-background/65 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        Order {category.order ?? index}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-muted/35 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        <Box className="h-3 w-3" />
                        {productCount} product{productCount === 1 ? "" : "s"}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {category.description || "No description added."}
                    </p>
                    {inUse ? (
                      <p className="mt-1 text-[11px] text-amber-600 dark:text-amber-300">In use, delete disabled.</p>
                    ) : highlighted ? (
                      <p className="mt-1 text-[11px] text-primary">Keep this lane for flagship Telegram automation listings.</p>
                    ) : (
                      <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-300">Safe to delete.</p>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-1.5 lg:justify-end">
                  <button
                    type="button"
                    onClick={() => void reorderCategory(category, "up")}
                    disabled={index === 0 || isReordering}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/70 text-foreground transition hover:bg-muted/40 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label={`Move ${category.name} up`}
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void reorderCategory(category, "down")}
                    disabled={index === orderedCategories.length - 1 || isReordering}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/70 text-foreground transition hover:bg-muted/40 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label={`Move ${category.name} down`}
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => editCategory(category)}
                    className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full border border-border/70 px-2.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-foreground transition hover:bg-muted/40"
                    aria-label={`Edit ${category.name}`}
                    title="Edit category"
                  >
                    <Pencil className="h-3 w-3" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(category)}
                    disabled={inUse || isDeleting}
                    className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full border border-rose-500/30 px-2.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-rose-600 transition hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:border-border/60 disabled:text-muted-foreground"
                    aria-label={`Delete ${category.name}`}
                    title={inUse ? "Move linked products first" : "Delete category"}
                  >
                    <Trash2 className="h-3 w-3" />
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        title="Delete category?"
        description={
          confirmDelete
            ? `Delete "${confirmDelete.name}"? Products must already be moved out before this can be confirmed.`
            : ""
        }
        confirmLabel="Yes, delete"
        cancelLabel="No"
        busy={Boolean(confirmDelete && deletingId === confirmDelete.id)}
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => {
          if (confirmDelete) {
            void deleteCategory(confirmDelete);
          }
        }}
      />
    </Card>
  );
}
