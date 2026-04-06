import { Metadata } from "next";
import { ProductCatalog } from "@/components/products/product-catalog";
import { getCategories, getOffers, getProducts } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "OTT Plans",
  description: "Browse premium OTT subscriptions with instant delivery and secure checkout."
};

export default async function ProductsPage() {
  const [products, categories, offers] = await Promise.all([
    getProducts().catch(() => []),
    getCategories().catch(() => []),
    getOffers().catch(() => [])
  ]);

  return (
    <div className="container py-12 md:py-16">
      <div className="mb-10 max-w-3xl space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Premium digital catalog</p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          Discover accounts with a fast, premium buying experience.
        </h1>
        <p className="text-lg text-muted-foreground">
          Scroll categories at the top, switch layouts instantly, and grab the best deals from curated offers.
        </p>
      </div>
      <ProductCatalog products={products} categories={categories} offers={offers} />
    </div>
  );
}
