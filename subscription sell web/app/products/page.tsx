import { Metadata } from "next";
import { ProductCatalog } from "@/components/products/product-catalog";
import { getCategories, getProducts } from "@/lib/db";

export const metadata: Metadata = {
  title: "OTT Plans",
  description: "Browse premium OTT subscriptions with instant delivery and secure checkout."
};

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts().catch(() => []),
    getCategories().catch(() => [])
  ]);

  return (
    <div className="container py-16">
      <div className="mb-12 max-w-2xl space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Curated subscription plans</p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Choose the stack your audience actually wants.</h1>
        <p className="text-lg text-muted-foreground">
          Filter by category, compare pricing instantly, and convert with a premium buying experience.
        </p>
      </div>
      <ProductCatalog products={products} categories={categories} />
    </div>
  );
}
