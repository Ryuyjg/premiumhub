"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Pencil, Search, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Category, Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ImageUploader } from "@/components/admin/image-uploader";
import { FEATURED_CATEGORY_SLUG } from "@/lib/catalog";

type ProductForm = {
  id?: string;
  name: string;
  shortDescription: string;
  description: string;
  featuresText: string;
  categoryId: string;
  imageUrl: string;
  price: string;
  discount: string;
  durationInDays: string;
  stockCount: string;
  featured: boolean;
  bestSelling: boolean;
  deliveryMode: "direct_credentials" | "otp_manual" | "email_invite";
  otpSupportNumber: string;
  deliveryNotes: string;
};

const initialForm: ProductForm = {
  name: "",
  shortDescription: "",
  description: "",
  featuresText: "",
  categoryId: "",
  imageUrl: "",
  price: "",
  discount: "0",
  durationInDays: "30",
  stockCount: "10",
  featured: false,
  bestSelling: false,
  deliveryMode: "direct_credentials",
  otpSupportNumber: "",
  deliveryNotes: ""
};

export function ProductManager({
  products,
  categories
}: {
  products: Product[];
  categories: Category[];
}) {
  const [submitting, setSubmitting] = useState(false);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<ProductForm>({
    ...initialForm,
    categoryId: categories[0]?.id || ""
  });
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);
  const selectedCategory = categories.find((category) => category.id === form.categoryId) || null;

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      `${product.name} ${product.categoryName} ${product.stockStatus}`.toLowerCase().includes(query.toLowerCase())
    );
  }, [products, query]);
  const inputToneClass =
    "border-zinc-700/90 bg-zinc-900/80 text-zinc-100 placeholder:text-zinc-500 focus:border-orange-500/60 focus:bg-zinc-900";
  const fieldLabelClass = "grid gap-2 text-sm text-zinc-200";

  function resetForm() {
    setForm({
      ...initialForm,
      categoryId: categories[0]?.id || ""
    });
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const features = form.featuresText
        .split("\n")
        .map((line) => line.replace(/^(?:[-*]|\d+\.)\s*/, "").trim())
        .filter(Boolean);

      const payload = {
        id: form.id,
        name: form.name.trim(),
        shortDescription: form.shortDescription.trim(),
        description: form.description.trim(),
        features,
        categoryId: form.categoryId,
        imageUrl: form.imageUrl.trim(),
        price: Number(form.price),
        discount: Number(form.discount || "0"),
        durationInDays: Number(form.durationInDays || "30"),
        stockCount: Number(form.stockCount || "0"),
        featured: form.featured,
        bestSelling: form.bestSelling,
        deliveryMode: form.deliveryMode,
        otpSupportNumber: form.otpSupportNumber.trim(),
        deliveryNotes: form.deliveryNotes.trim(),
        stockStatus: "active"
      };

      if (
        !payload.name ||
        !payload.shortDescription ||
        !payload.description ||
        !payload.imageUrl ||
        !payload.categoryId ||
        !payload.price ||
        !payload.durationInDays ||
        features.length === 0
      ) {
        throw new Error("Please fill all required product fields, including at least one feature bullet.");
      }

      const response = await fetch("/api/admin/products", {
        method: form.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "Unable to save product.");
      }

      toast.success(form.id ? "Product updated." : "Product created.");
      resetForm();
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Product save failed.");
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteProduct(id: string) {
    try {
      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE"
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "Unable to delete product.");
      }
      toast.success("Product deleted.");
      setConfirmDelete(null);
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed.");
    }
  }

  function editProduct(product: Product) {
    const discount =
      product.price > 0 && product.salePrice
        ? Math.max(Math.round(((product.price - product.salePrice) / product.price) * 100), 0)
        : 0;

    setForm({
      id: product.id,
      name: product.name,
      shortDescription: product.shortDescription,
      description: product.description,
      featuresText: product.features.join("\n"),
      categoryId: product.categoryId,
      imageUrl: product.imageUrls[0] || "",
      price: String(product.price),
      discount: String(discount),
      durationInDays: String(product.durationInDays || 30),
      stockCount: String(product.stockCount ?? 10),
      featured: Boolean(product.featured),
      bestSelling: Boolean(product.bestSelling),
      deliveryMode: product.deliveryMode || "direct_credentials",
      otpSupportNumber: product.otpSupportNumber || "",
      deliveryNotes: product.deliveryNotes || ""
    });
  }

  return (
    <Card className="mx-auto h-full w-full max-w-7xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black tracking-tight">{form.id ? "Edit product" : "Add product"}</h2>
          <p className="mt-1 text-sm text-zinc-400">Create a clean product listing with strong copy and complete details.</p>
        </div>
        <p className="rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">
          {products.length} products
        </p>
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <form
          onSubmit={saveProduct}
          className="grid gap-5 rounded-[1.75rem] border border-amber-500/20 bg-zinc-950/70 p-5 shadow-[0_20px_45px_rgba(0,0,0,0.35)] md:p-6"
        >
          <label className={fieldLabelClass}>
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">Category</span>
            <select
              value={form.categoryId}
              onChange={(event) => setForm((current) => ({ ...current, categoryId: event.target.value }))}
              className={`field ${inputToneClass}`}
              required
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          {selectedCategory?.slug === FEATURED_CATEGORY_SLUG ? (
            <div className="rounded-[1.25rem] border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
              Telegram auto software is your featured lane. Use fuller descriptions, stronger bullet points, and mark
              the best products as featured so they can lead the homepage.
            </div>
          ) : null}

          <label className={fieldLabelClass}>
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">Product name</span>
            <Input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Product name"
              className={inputToneClass}
              required
            />
          </label>

          <label className={fieldLabelClass}>
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">Short description</span>
            <Input
              value={form.shortDescription}
              onChange={(event) => setForm((current) => ({ ...current, shortDescription: event.target.value }))}
              placeholder="Short description for cards and quick previews"
              className={inputToneClass}
              required
            />
          </label>

          <label className={fieldLabelClass}>
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">Full description</span>
            <textarea
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              placeholder="Full product description"
              className={`field h-auto min-h-32 py-3 ${inputToneClass}`}
              required
            />
          </label>

          <label className={fieldLabelClass}>
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">Features (bullets)</span>
            <textarea
              value={form.featuresText}
              onChange={(event) => setForm((current) => ({ ...current, featuresText: event.target.value }))}
              placeholder={"Feature bullets, one per line\nInstant delivery\nSafe support\nPrivate setup notes"}
              className={`field h-auto min-h-28 py-3 ${inputToneClass}`}
              required
            />
          </label>

          <div className="space-y-3 rounded-[1.25rem] border border-zinc-700/80 bg-zinc-900/45 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-zinc-400">Product image</p>
            <div className="flex flex-wrap items-center gap-3">
              <ImageUploader onUploaded={(url) => setForm((current) => ({ ...current, imageUrl: url }))} />
              {form.imageUrl ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="border border-zinc-700/80 bg-zinc-900/80 text-zinc-100 hover:bg-zinc-800"
                  onClick={() => setForm((current) => ({ ...current, imageUrl: "" }))}
                >
                  Remove image
                </Button>
              ) : null}
            </div>
            {form.imageUrl ? (
              <div className="overflow-hidden rounded-[1.25rem] border border-zinc-700/80 bg-zinc-900/80 p-3">
                <div className="relative aspect-[16/8] overflow-hidden rounded-[1.15rem]">
                  <Image src={form.imageUrl} alt={form.name || "Product preview"} fill className="object-cover" />
                </div>
                <p className="mt-3 text-xs text-zinc-400">Uploaded image ready.</p>
              </div>
            ) : (
              <p className="text-xs text-rose-600">Please upload an image before saving.</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Input
              type="number"
              min="1"
              value={form.price}
              onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
              placeholder="Price"
              className={inputToneClass}
              required
            />
            <Input
              type="number"
              min="0"
              max="99"
              value={form.discount}
              onChange={(event) => setForm((current) => ({ ...current, discount: event.target.value }))}
              placeholder="Discount %"
              className={inputToneClass}
              required
            />
            <Input
              type="number"
              min="1"
              value={form.durationInDays}
              onChange={(event) => setForm((current) => ({ ...current, durationInDays: event.target.value }))}
              placeholder="Duration in days"
              className={inputToneClass}
              required
            />
            <Input
              type="number"
              min="0"
              value={form.stockCount}
              onChange={(event) => setForm((current) => ({ ...current, stockCount: event.target.value }))}
              placeholder="Stock count"
              className={inputToneClass}
              required
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="flex items-center gap-2 rounded-[1.25rem] border border-zinc-700/80 bg-zinc-900/65 px-4 py-3 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) => setForm((current) => ({ ...current, featured: event.target.checked }))}
                className="h-4 w-4"
              />
              Feature on storefront
            </label>
            <label className="flex items-center gap-2 rounded-[1.25rem] border border-zinc-700/80 bg-zinc-900/65 px-4 py-3 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={form.bestSelling}
                onChange={(event) => setForm((current) => ({ ...current, bestSelling: event.target.checked }))}
                className="h-4 w-4"
              />
              Mark as best-selling
            </label>
          </div>

          <select
            value={form.deliveryMode}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                deliveryMode: event.target.value as ProductForm["deliveryMode"]
              }))
            }
            className={`field ${inputToneClass}`}
          >
            <option value="direct_credentials">Direct ID &amp; Password</option>
            <option value="otp_manual">OTP Login (manual OTP from admin)</option>
            <option value="email_invite">Email/Invitation Activation</option>
          </select>

          {form.deliveryMode === "otp_manual" ? (
            <Input
              value={form.otpSupportNumber}
              onChange={(event) => setForm((current) => ({ ...current, otpSupportNumber: event.target.value }))}
              placeholder="OTP support number (shown to user)"
              className={inputToneClass}
              required
            />
          ) : null}

          {form.deliveryMode !== "direct_credentials" ? (
            <textarea
              value={form.deliveryNotes}
              onChange={(event) => setForm((current) => ({ ...current, deliveryNotes: event.target.value }))}
              placeholder="Delivery instructions for admin or user"
              className={`field h-auto min-h-24 py-3 ${inputToneClass}`}
            />
          ) : null}

          <div className="flex gap-3">
            <Button type="submit" className="btn-primary px-6" disabled={submitting}>
              {submitting ? "Saving..." : form.id ? "Update product" : "Create product"}
            </Button>
            {form.id ? (
              <Button
                type="button"
                variant="ghost"
                className="border border-zinc-700/80 bg-zinc-900/80 text-zinc-100 hover:bg-zinc-800"
                onClick={resetForm}
              >
                Cancel edit
              </Button>
            ) : null}
          </div>
        </form>

        <div className="space-y-4 rounded-[1.75rem] border border-zinc-700/80 bg-zinc-950/70 p-5 shadow-[0_18px_40px_rgba(0,0,0,0.28)] md:p-6">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products"
              className={`pl-10 ${inputToneClass}`}
            />
          </div>
          <div className="overflow-hidden rounded-2xl border border-zinc-700/80">
            <div className="grid grid-cols-[1fr_auto_auto] gap-3 bg-zinc-900/80 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">
              <p>Product</p>
              <p>Status</p>
              <p className="text-right">Actions</p>
            </div>
            <div className="max-h-[28rem] divide-y divide-border/70 overflow-y-auto">
              {filteredProducts.map((product) => (
                <div key={product.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-semibold">{product.name}</p>
                      {product.featured ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
                          <Sparkles className="h-3 w-3" />
                          Featured
                        </span>
                      ) : null}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {product.categoryName} - {formatCurrency(product.salePrice || product.price)} - {product.durationInDays}d
                    </p>
                  </div>
                  <p className="text-xs uppercase tracking-[0.14em] text-zinc-400">{product.stockStatus}</p>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => editProduct(product)}
                      className="rounded-full border border-zinc-700/80 p-2 text-zinc-400 hover:text-zinc-100"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete({ id: product.id, name: product.name })}
                      className="rounded-full border border-rose-500/20 p-2 text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              {filteredProducts.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-muted-foreground">No products available.</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        title="Delete product?"
        description={
          confirmDelete
            ? `Delete "${confirmDelete.name}" from the catalog? This action cannot be undone.`
            : ""
        }
        confirmLabel="Yes, delete"
        cancelLabel="No"
        busy={submitting}
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => {
          if (confirmDelete) {
            void deleteProduct(confirmDelete.id);
          }
        }}
      />
    </Card>
  );
}
