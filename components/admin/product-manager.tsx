"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Pencil, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Category, Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImageUploader } from "@/components/admin/image-uploader";

type ProductForm = {
  id?: string;
  name: string;
  description: string;
  categoryId: string;
  imageUrl: string;
  price: string;
  discount: string;
  bestSelling: boolean;
  deliveryMode: "direct_credentials" | "otp_manual" | "email_invite";
  otpSupportNumber: string;
  deliveryNotes: string;
};

const initialForm: ProductForm = {
  name: "",
  description: "",
  categoryId: "",
  imageUrl: "",
  price: "",
  discount: "0",
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

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      `${product.name} ${product.categoryName} ${product.stockStatus}`.toLowerCase().includes(query.toLowerCase())
    );
  }, [products, query]);

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
      const payload = {
        id: form.id,
        name: form.name.trim(),
        description: form.description.trim(),
        categoryId: form.categoryId,
        imageUrl: form.imageUrl.trim(),
        price: Number(form.price),
        discount: Number(form.discount || "0"),
        bestSelling: form.bestSelling,
        deliveryMode: form.deliveryMode,
        otpSupportNumber: form.otpSupportNumber.trim(),
        deliveryNotes: form.deliveryNotes.trim(),
        stockStatus: "active"
      };

      if (!payload.name || !payload.description || !payload.imageUrl || !payload.categoryId || !payload.price) {
        throw new Error("Please fill all required product fields.");
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
    if (!confirm("Delete this product?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE"
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "Unable to delete product.");
      }
      toast.success("Product deleted.");
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed.");
    }
  }

  function editProduct(product: Product) {
    const discount = product.price > 0 && product.salePrice
      ? Math.max(Math.round(((product.price - product.salePrice) / product.price) * 100), 0)
      : 0;

    setForm({
      id: product.id,
      name: product.name,
      description: product.description,
      categoryId: product.categoryId,
      imageUrl: product.imageUrls[0] || "",
      price: String(product.price),
      discount: String(discount),
      bestSelling: Boolean(product.bestSelling),
      deliveryMode: product.deliveryMode || "direct_credentials",
      otpSupportNumber: product.otpSupportNumber || "",
      deliveryNotes: product.deliveryNotes || ""
    });
  }

  return (
    <Card className="h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{form.id ? "Edit product" : "Add product"}</h2>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{products.length} products</p>
      </div>
      <div className="mt-5 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={saveProduct} className="grid gap-4">
          <select
            value={form.categoryId}
            onChange={(event) => setForm((current) => ({ ...current, categoryId: event.target.value }))}
            className="h-11 rounded-2xl border border-border/80 bg-white/80 px-4 text-sm dark:bg-white/5"
            required
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <Input
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            placeholder="Product name"
            required
          />
          <textarea
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            placeholder="Product description"
            className="min-h-24 rounded-[1.25rem] border border-border/80 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15 dark:bg-white/5"
            required
          />
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Product image</p>
            <ImageUploader onUploaded={(url) => setForm((current) => ({ ...current, imageUrl: url }))} />
            {form.imageUrl ? (
              <div className="rounded-xl border border-border/80 bg-muted/30 p-3 text-xs text-muted-foreground">
                Uploaded image ready.
              </div>
            ) : (
              <p className="text-xs text-rose-600">Please upload an image before saving.</p>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              type="number"
              min="1"
              value={form.price}
              onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
              placeholder="Price"
              required
            />
            <Input
              type="number"
              min="0"
              max="99"
              value={form.discount}
              onChange={(event) => setForm((current) => ({ ...current, discount: event.target.value }))}
              placeholder="Discount %"
              required
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={form.bestSelling}
              onChange={(event) => setForm((current) => ({ ...current, bestSelling: event.target.checked }))}
              className="h-4 w-4"
            />
            Mark as best-selling
          </label>
          <select
            value={form.deliveryMode}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                deliveryMode: event.target.value as ProductForm["deliveryMode"]
              }))
            }
            className="h-11 rounded-2xl border border-border/80 bg-white/80 px-4 text-sm dark:bg-white/5"
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
              required
            />
          ) : null}
          {form.deliveryMode !== "direct_credentials" ? (
            <textarea
              value={form.deliveryNotes}
              onChange={(event) => setForm((current) => ({ ...current, deliveryNotes: event.target.value }))}
              placeholder="Delivery instructions for admin/user"
              className="min-h-20 rounded-[1.25rem] border border-border/80 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15 dark:bg-white/5"
            />
          ) : null}
          <div className="flex gap-3">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : form.id ? "Update product" : "Create product"}
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
              placeholder="Search products"
              className="pl-10"
            />
          </div>
          <div className="overflow-hidden rounded-2xl border border-border/80">
            <div className="grid grid-cols-[1fr_auto_auto] gap-3 bg-muted/60 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <p>Product</p>
              <p>Status</p>
              <p className="text-right">Actions</p>
            </div>
            <div className="max-h-[26rem] divide-y divide-border/70 overflow-y-auto">
              {filteredProducts.map((product) => (
                <div key={product.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-4 py-3">
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.categoryName} • {formatCurrency(product.salePrice || product.price)}
                    </p>
                  </div>
                  <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{product.stockStatus}</p>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => editProduct(product)}
                      className="rounded-full border border-border/70 p-2 text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteProduct(product.id)}
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
    </Card>
  );
}
