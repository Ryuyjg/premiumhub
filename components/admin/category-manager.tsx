"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Box, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Category, Product } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FEATURED_CATEGORY_SLUG } from "@/lib/catalog";
import { ImageUploader } from "@/components/admin/image-uploader";
import { slugify } from "@/lib/utils";
import {
  CATALOG_UPDATED_EVENT,
  getStoredCategories,
  recordDeletedCategory,
  saveStoredCategories
} from "@/lib/client-catalog";

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
  categories = [],
  products = []
}: {
  categories?: Category[];
  products?: Product[];
}) {
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [reorderingId, setReorderingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryForm>(initialForm);

  // Persistent Client-Side Category List
  const [categoryList, setCategoryList] = useState<Category[]>(() =>
    getStoredCategories(categories)
  );

  useEffect(() => {
    function syncCategories() {
      setCategoryList(getStoredCategories(categories));
    }
    syncCategories();
    window.addEventListener(CATALOG_UPDATED_EVENT, syncCategories);
    return () => window.removeEventListener(CATALOG_UPDATED_EVENT, syncCategories);
  }, [categories]);

  const categoryUsage = useMemo(() => {
    const usageMap = new Map<string, number>();
    products.forEach((product) => {
      usageMap.set(product.categoryId, (usageMap.get(product.categoryId) || 0) + 1);
    });
    return usageMap;
  }, [products]);

  const orderedCategories = useMemo(() => {
    return [...categoryList].sort((a, b) => {
      const aOrder = typeof a.order === "number" ? a.order : Number.MAX_SAFE_INTEGER;
      const bOrder = typeof b.order === "number" ? b.order : Number.MAX_SAFE_INTEGER;
      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }
      return a.name.localeCompare(b.name);
    });
  }, [categoryList]);

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
      const name = form.name.trim();
      if (!name) {
        throw new Error("Category name is required.");
      }

      const slug = slugify(name);
      const newCategory: Category = {
        id: form.id || slug,
        slug,
        name,
        description: form.description.trim(),
        imageUrl: form.imageUrl.trim(),
        order: form.order === "" ? categoryList.length : Number(form.order)
      };

      try {
        await fetch("/api/admin/categories", {
          method: form.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCategory)
        });
      } catch {
        // Ignore static export API error
      }

      let updatedList: Category[];
      if (form.id) {
        updatedList = categoryList.map((item) => (item.id === form.id ? newCategory : item));
      } else {
        updatedList = [...categoryList, newCategory];
      }

      saveStoredCategories(updatedList);
      setCategoryList(updatedList);
      toast.success(form.id ? "Category updated." : "Category created.");
      resetForm();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Category save failed.");
    } finally {
      setSubmitting(false);
    }
  }

  async function reorderCategory(category: Category, direction: "up" | "down") {
    const currentIndex = orderedCategories.findIndex((item) => item.id === category.id);
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const target = orderedCategories[targetIndex];

    if (currentIndex < 0 || !target) {
      return;
    }

    const currentOrder = Number(category.order ?? currentIndex);
    const targetOrder = Number(target.order ?? targetIndex);

    setReorderingId(category.id);
    try {
      try {
        await fetch("/api/admin/categories", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            updates: [
              { id: category.id, order: targetOrder },
              { id: target.id, order: currentOrder }
            ]
          })
        });
      } catch {
        // Ignore static export API error
      }

      const updated = categoryList.map((item) => {
        if (item.id === category.id) return { ...item, order: targetOrder };
        if (item.id === target.id) return { ...item, order: currentOrder };
        return item;
      });

      saveStoredCategories(updated);
      setCategoryList(updated);
      toast.success("Category order updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Category reorder failed.");
    } finally {
      setReorderingId(null);
    }
  }

  async function deleteCategory(category: Category) {
    setDeletingId(category.id);
    try {
      try {
        await fetch(`/api/admin/categories?id=${category.id}`, { method: "DELETE" });
      } catch {
        // Ignore static export API error
      }

      recordDeletedCategory(category);
      const updated = categoryList.filter(
        (item) => item.id !== category.id && item.slug !== category.slug
      );
      saveStoredCategories(updated);
      setCategoryList(updated);

      toast.success("Category deleted.");
      setConfirmDelete(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Category delete failed.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <Card className="h-full">
      <h2 className="text-xl font-bold text-slate-900">{form.id ? "Edit Category" : "Category Management"}</h2>
      <p className="mt-1 text-sm text-slate-600">
        Create, edit, reorder, or delete store categories. Changes persist across reloads.
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
          placeholder="Sort order (e.g. 0, 1, 2)"
        />
        <p className="text-xs text-slate-500">Lower numbers appear first in navigation.</p>
        <textarea
          value={form.description}
          onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
          placeholder="Category description"
          className="min-h-24 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />

        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-600">Category image</p>
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
              <p className="mt-3 text-xs text-slate-500">Image ready for this category.</p>
            </div>
          ) : (
            <p className="text-xs text-slate-500">Upload an image if you want this category to have its own visual.</p>
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
          const isDeleting = deletingId === category.id;
          const highlighted = category.slug === FEATURED_CATEGORY_SLUG;
          const isReordering = reorderingId === category.id;

          return (
            <div key={category.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                    {category.imageUrl ? (
                      <Image src={category.imageUrl} alt={category.name} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400">
                        <Box className="h-5 w-5" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-slate-900">{category.name}</p>
                      {highlighted ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-600">
                          Main category
                        </span>
                      ) : null}
                      <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                        Order {category.order ?? index}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                        <Box className="h-3 w-3" />
                        {productCount} product{productCount === 1 ? "" : "s"}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-600">
                      {category.description || "No description added."}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-1.5 lg:justify-end">
                  <button
                    type="button"
                    onClick={() => void reorderCategory(category, "up")}
                    disabled={index === 0 || isReordering}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label={`Move ${category.name} up`}
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void reorderCategory(category, "down")}
                    disabled={index === orderedCategories.length - 1 || isReordering}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label={`Move ${category.name} down`}
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => editCategory(category)}
                    className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full border border-slate-200 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-100"
                    aria-label={`Edit ${category.name}`}
                    title="Edit category"
                  >
                    <Pencil className="h-3 w-3" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(category)}
                    disabled={isDeleting}
                    className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full border border-rose-300 bg-rose-50 px-3 text-[10px] font-bold uppercase tracking-wider text-rose-600 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label={`Delete ${category.name}`}
                    title="Delete category"
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
            ? `Are you sure you want to delete "${confirmDelete.name}"?`
            : ""
        }
        confirmLabel="Yes, delete"
        cancelLabel="Cancel"
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
