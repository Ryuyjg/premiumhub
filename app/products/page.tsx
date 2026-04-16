import { Metadata } from "next";
import { ProductCatalog } from "@/components/products/product-catalog";
import { getCategories, getOffers, getProducts } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catalog",
  description: "Browse premium OTT SHOP plans with clean pricing hierarchy, trust-first layout, and smooth buying flow."
};

export default async function ProductsPage() {
  const [products, categories, offers] = await Promise.all([
    getProducts().catch(() => []),
    getCategories().catch(() => []),
    getOffers().catch(() => [])
  ]);

  return (
    <div className="container py-12 md:py-16">
      <div className="section-shell mb-10 p-7 md:p-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Premium plan catalog</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
          Compare plans with
          <span className="gradient-text block">clarity and confidence.</span>
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
          Explore AI plans, OTT plans, games, software, virtual numbers, Telegram sessions, and Telegram automation
          products in one conversion-focused browsing experience.
        </p>
      </div>
      <ProductCatalog products={products} categories={categories} offers={offers} />
    </div>
  );
}
