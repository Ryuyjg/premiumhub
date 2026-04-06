"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImageUploader } from "@/components/admin/image-uploader";

export function ProductManager({ products }: { products: Product[] }) {
  const [submitting, setSubmitting] = useState(false);
  const [imageUrls, setImageUrls] = useState("");
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      `${product.name} ${product.categoryName} ${product.stockStatus}`.toLowerCase().includes(query.toLowerCase())
    );
  }, [products, query]);

  async function createProduct(formData: FormData) {
    setSubmitting(true);
    try {
      const payload = {
        name: String(formData.get("name")),
        shortDescription: String(formData.get("shortDescription")),
        description: String(formData.get("description")),
        price: Number(formData.get("price")),
        salePrice: Number(formData.get("salePrice")) || undefined,
        categoryId: String(formData.get("categoryId")),
        categoryName: String(formData.get("categoryName")),
        durationInDays: Number(formData.get("durationInDays")),
        imageUrls: imageUrls
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean),
        features: String(formData.get("features"))
          .split("\n")
          .map((value) => value.trim())
          .filter(Boolean),
        featured: formData.get("featured") === "on",
        stockStatus: String(formData.get("stockStatus"))
      };

      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Unable to save product.");
      }

      toast.success("Product saved. Refresh to view the new record.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Product save failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Catalog manager</h2>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{products.length} products</p>
      </div>
      <div className="mt-5 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <form action={createProduct} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input name="name" placeholder="Netflix Premium 30 Days" required />
            <Input name="categoryName" placeholder="Category name" required />
            <Input name="categoryId" placeholder="Category id" required />
            <Input name="price" type="number" placeholder="Base price" required />
            <Input name="salePrice" type="number" placeholder="Sale price" />
            <Input name="durationInDays" type="number" placeholder="Duration in days" required />
          </div>
          <Input name="shortDescription" placeholder="Short description" required />
          <textarea
            name="description"
            placeholder="Detailed description"
            className="min-h-28 rounded-[1.25rem] border border-border/80 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15 dark:bg-white/5"
            required
          />
          <div className="space-y-3">
            <Input
              name="imageUrls"
              placeholder="Comma-separated image URLs"
              value={imageUrls}
              onChange={(event) => setImageUrls(event.target.value)}
              required
            />
            <ImageUploader onUploaded={(url) => setImageUrls((current) => (current ? `${current}, ${url}` : url))} />
          </div>
          <textarea
            name="features"
            placeholder="One feature per line"
            className="min-h-24 rounded-[1.25rem] border border-border/80 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15 dark:bg-white/5"
            required
          />
          <div className="grid gap-4 md:grid-cols-[1fr_auto_auto] md:items-center">
            <select name="stockStatus" className="h-11 rounded-2xl border border-border/80 bg-white/80 px-4 text-sm dark:bg-white/5">
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input name="featured" type="checkbox" className="h-4 w-4" />
              Featured
            </label>
            <Button disabled={submitting}>{submitting ? "Saving..." : "Save product"}</Button>
          </div>
        </form>
        <div className="space-y-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search inventory"
              className="pl-10"
            />
          </div>
          <div className="overflow-hidden rounded-2xl border border-border/80">
            <div className="grid grid-cols-[1fr_auto_auto] gap-3 bg-muted/60 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <p>Product</p>
              <p>Status</p>
              <p className="text-right">Price</p>
            </div>
            <div className="max-h-[26rem] divide-y divide-border/70 overflow-y-auto">
              {filteredProducts.map((product) => (
                <div key={product.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-4 py-3">
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.categoryName}</p>
                  </div>
                  <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{product.stockStatus}</p>
                  <p className="text-right text-sm font-semibold">{formatCurrency(product.salePrice || product.price)}</p>
                </div>
              ))}
              {filteredProducts.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-muted-foreground">No products match this search.</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
