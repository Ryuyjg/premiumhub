import { Metadata } from "next";
import { ProductCatalog } from "@/components/products/product-catalog";
import { getCategories, getProducts } from "@/lib/db";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Catalog",
  description: "Browse premium OTT SHOP plans with clean pricing hierarchy, trust-first layout, and smooth buying flow."
};

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts().catch(() => []),
    getCategories().catch(() => [])
  ]);

  return (
    <div className="container py-12 md:py-16">
      <ProductCatalog products={products} categories={categories} />
    </div>
  );
}
