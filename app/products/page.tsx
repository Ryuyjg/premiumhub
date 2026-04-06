import { Metadata } from "next";
import { Layers3, Sparkles, Tags, TrendingUp } from "lucide-react";
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
  const bestSellerCount = products.filter((product) => product.bestSelling).length;
  const spotlightItems = [
    { icon: Layers3, label: "Categories", value: categories.length },
    { icon: Tags, label: "Live offers", value: offers.length },
    { icon: TrendingUp, label: "Best sellers", value: bestSellerCount }
  ];

  return (
    <div className="container py-8 md:py-12">
      <section className="section-shell relative overflow-hidden px-6 py-8 md:px-8 md:py-10">
        <div className="absolute inset-x-8 top-0 h-32 rounded-full bg-primary/12 blur-3xl" />
        <div className="absolute -right-10 top-12 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Premium storefront
            </div>
            <div className="space-y-4">
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl xl:text-6xl">
                Browse subscriptions in a cleaner, faster catalog built to feel high-end on every screen.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                Explore categories in a horizontal rail, switch between grid and line views, and surface admin-set
                offers and best sellers with a more polished storefront experience.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {spotlightItems.map((item) => (
              <div
                key={item.label}
                className="surface relative overflow-hidden rounded-[1.6rem] border-white/40 p-5"
              >
                <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-primary/10 blur-2xl" />
                <item.icon className="relative h-5 w-5 text-primary" />
                <p className="relative mt-4 text-3xl font-semibold">{item.value}</p>
                <p className="relative mt-1 text-sm text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-8 md:mt-10">
        <ProductCatalog products={products} categories={categories} offers={offers} />
      </div>
    </div>
  );
}
