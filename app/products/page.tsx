import { Metadata } from "next";
import { ProductCatalog } from "@/components/products/product-catalog";
import { getCategories, getOffers, getProducts } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catalog",
  description: "Browse the live OTT SHOP catalog with manual curation, cleaner product pages, and a better buying flow."
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
        <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Curated digital catalog</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
          Browse what is live,
          <span className="gradient-text block">skip what is not ready.</span>
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
          The storefront now starts with AI plans, OTT plans, games, softwares, virtual numbers, Telegram sessions,
          and a featured Telegram auto software lane. Add products only when they are ready to sell.
        </p>
      </div>
      <ProductCatalog products={products} categories={categories} offers={offers} />
    </div>
  );
}
