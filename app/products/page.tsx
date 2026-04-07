import { Metadata } from "next";
import { ProductCatalog } from "@/components/products/product-catalog";
import { getCategories, getOffers, getProducts } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "OTT Plans",
  description: "Browse premium OTT subscriptions with instant delivery and an INR-ready buying flow."
};

export default async function ProductsPage() {
  const [products, categories, offers] = await Promise.all([
    getProducts().catch(() => []),
    getCategories().catch(() => []),
    getOffers().catch(() => [])
  ]);

  return (
    <div className="container py-12 md:py-16">
      <div className="mb-10 rounded-[2rem] border border-border/55 bg-white/70 p-7 shadow-[0_22px_58px_rgba(2,6,23,0.05)] backdrop-blur-xl dark:bg-white/4 md:p-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Premium digital catalog</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
          Discover plans with a cleaner,
          <span className="gradient-text block">faster buying flow.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Filter by category, search instantly, compare in grid or list mode, and complete checkout with confidence.
        </p>
      </div>
      <ProductCatalog products={products} categories={categories} offers={offers} />
    </div>
  );
}
