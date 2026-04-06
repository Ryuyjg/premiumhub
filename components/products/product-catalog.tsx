"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Grid2X2, List, Search, Sparkles, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Category, Offer, Product } from "@/types";
import { ProductCard } from "@/components/products/product-card";
import { Input } from "@/components/ui/input";
import { resolveOfferTheme } from "@/lib/offer-themes";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";

export function ProductCatalog({
  products,
  categories,
  offers
}: {
  products: Product[];
  categories: Category[];
  offers: Offer[];
}) {
  const { search, category, setSearch, setCategory } = useAppStore();
  const [visibleCount, setVisibleCount] = useState(6);
  const [layout, setLayout] = useState<"grid" | "list">("grid");

  const categorySummaries = useMemo(() => {
    const counts = new Map<string, number>();

    products.forEach((product) => {
      counts.set(product.categoryId, (counts.get(product.categoryId) || 0) + 1);
    });

    return categories.map((item) => ({
      ...item,
      count: counts.get(item.id) || 0
    }));
  }, [categories, products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        search.length === 0 ||
        `${product.name} ${product.shortDescription} ${product.categoryName}`.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "all" || product.categoryId === category;

      return matchesSearch && matchesCategory;
    });
  }, [category, products, search]);

  const activeCategory = useMemo(() => {
    if (category === "all") {
      return null;
    }

    return categories.find((item) => item.id === category) || null;
  }, [categories, category]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const bestSellerCount = filteredProducts.filter((product) => product.bestSelling).length;

  useEffect(() => {
    setVisibleCount(6);
  }, [search, category]);

  return (
    <div className="space-y-8">
      {offers.length ? (
        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Live offers</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">Admin-curated promotions</h2>
            </div>
            <p className="hidden text-sm text-muted-foreground md:block">Fresh banners and cards surfaced directly from the admin panel.</p>
          </div>
          <div className="grid gap-4 xl:grid-cols-3">
            {offers.slice(0, 3).map((offer, index) => {
              const theme = resolveOfferTheme(offer.accent);
              const isFeaturedOffer = index === 0 && offers.length > 1;

              return (
                <motion.article
                  key={offer.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06, duration: 0.34 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className={cn(
                    "relative overflow-hidden rounded-[1.85rem] border border-white/12 p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)]",
                    isFeaturedOffer ? "xl:col-span-2 xl:min-h-[260px]" : "min-h-[220px]"
                  )}
                  style={{ backgroundImage: theme.gradient }}
                >
                  <div
                    className="absolute -left-8 top-8 h-28 w-28 rounded-full blur-3xl"
                    style={{ backgroundColor: theme.glow }}
                  />
                  <div className="absolute -right-12 top-0 h-36 w-36 rounded-full bg-white/12 blur-3xl" />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/30 to-transparent" />

                  <div className="relative flex h-full flex-col justify-between gap-8">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        {offer.badge ? (
                          <span className="inline-flex rounded-full border border-white/20 bg-white/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
                            {offer.badge}
                          </span>
                        ) : null}
                        <span className="inline-flex items-center gap-2 text-xs font-medium text-white/75">
                          <Sparkles className="h-3.5 w-3.5" />
                          Premium catalog offer
                        </span>
                      </div>
                      <div className={isFeaturedOffer ? "max-w-2xl" : "max-w-lg"}>
                        <h3 className={cn("font-semibold tracking-tight", isFeaturedOffer ? "text-2xl md:text-3xl" : "text-xl")}>
                          {offer.title}
                        </h3>
                        <p className="mt-3 max-w-xl text-sm leading-7 text-white/78 md:text-base">
                          {offer.description}
                        </p>
                      </div>
                    </div>

                    {offer.ctaLabel && offer.ctaUrl ? (
                      <Link
                        href={offer.ctaUrl}
                        className="inline-flex w-fit items-center gap-2 rounded-full border border-white/18 bg-white/12 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/18"
                      >
                        {offer.ctaLabel}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    ) : null}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="section-shell relative overflow-hidden p-4 md:p-6">
        <div className="absolute inset-x-8 top-0 h-24 rounded-full bg-primary/8 blur-3xl" />
        <div className="relative flex flex-col gap-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Category rail</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">Scroll, tap, and filter without breaking flow.</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
                All categories stay in a horizontal row so visitors can move through the catalog quickly on desktop and mobile.
              </p>
            </div>

            <div className="grid gap-3 lg:grid-cols-[minmax(0,23rem)_auto] lg:items-center">
              <div className="relative w-full lg:min-w-[23rem]">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search plans, providers, bundles..."
                  className="pl-10"
                />
              </div>
              <div className="flex items-center justify-between gap-3 lg:justify-end">
                <div className="hidden rounded-full border border-border/70 bg-background/65 px-4 py-2 text-sm text-muted-foreground md:inline-flex">
                  <span className="font-semibold text-foreground">{filteredProducts.length}</span>&nbsp;plans
                </div>
                <div className="flex items-center gap-2 rounded-full border border-border/70 bg-background/70 p-1">
                  <button
                    type="button"
                    onClick={() => setLayout("grid")}
                    className={layout === "grid" ? "pill-filter-active !px-3 !py-1.5" : "pill-filter !border-transparent !bg-transparent !px-3 !py-1.5"}
                    aria-label="Grid layout"
                  >
                    <Grid2X2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setLayout("list")}
                    className={layout === "list" ? "pill-filter-active !px-3 !py-1.5" : "pill-filter !border-transparent !bg-transparent !px-3 !py-1.5"}
                    aria-label="List layout"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto pb-2 scrollbar-none">
            <div className="flex min-w-max gap-3">
              <motion.button
                type="button"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => setCategory("all")}
                className={cn(
                  "min-w-[220px] rounded-[1.6rem] border p-4 text-left transition duration-300",
                  category === "all"
                    ? "border-primary/20 bg-primary text-primary-foreground shadow-[0_18px_45px_rgba(8,145,178,0.22)]"
                    : "bg-white/75 text-foreground shadow-[0_14px_32px_rgba(15,23,42,0.06)] hover:border-primary/20 hover:bg-white dark:bg-white/5"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className={cn("text-sm font-semibold", category === "all" ? "text-white" : "text-foreground")}>All categories</p>
                    <p className={cn("mt-1 text-xs", category === "all" ? "text-white/78" : "text-muted-foreground")}>
                      {products.length} plans
                    </p>
                  </div>
                  <div className={cn(
                    "rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
                    category === "all" ? "bg-white/14 text-white/80" : "bg-primary/10 text-primary"
                  )}>
                    View all
                  </div>
                </div>
                <p className={cn("mt-4 text-sm leading-6", category === "all" ? "text-white/82" : "text-muted-foreground")}>
                  Switch across every catalog segment without leaving the current page.
                </p>
              </motion.button>

              {categorySummaries.map((item, index) => {
                const isActive = category === item.id;

                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.985 }}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03, duration: 0.28 }}
                    onClick={() => setCategory(item.id)}
                    className={cn(
                      "min-w-[220px] rounded-[1.6rem] border p-4 text-left transition duration-300",
                      isActive
                        ? "border-primary/18 bg-slate-950 text-white shadow-[0_18px_45px_rgba(15,23,42,0.18)] dark:bg-primary/90"
                        : "bg-white/75 text-foreground shadow-[0_14px_32px_rgba(15,23,42,0.06)] hover:border-primary/20 hover:bg-white dark:bg-white/5"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">{item.name}</p>
                        <p className={cn("mt-1 text-xs", isActive ? "text-white/70" : "text-muted-foreground")}>
                          {item.count} plans
                        </p>
                      </div>
                      <div className={cn(
                        "rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
                        isActive ? "bg-white/12 text-white/75" : "bg-primary/10 text-primary"
                      )}>
                        {item.count}
                      </div>
                    </div>
                    <p className={cn("mt-4 text-sm leading-6", isActive ? "text-white/78" : "text-muted-foreground")}>
                      {item.description || "Curated subscription bundles with instant delivery and clear pricing."}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 rounded-[1.65rem] border border-border/70 bg-background/55 p-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {activeCategory ? "Selected category" : "All products"}
              </p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight md:text-2xl">
                {activeCategory?.name || "Premium subscription catalog"}
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
                {activeCategory?.description ||
                  "A fast, conversion-focused browsing experience with structured pricing, clean cards, and subtle motion."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="rounded-2xl border border-border/70 bg-white/70 px-4 py-3 dark:bg-white/5">
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Showing</p>
                <p className="mt-1 text-lg font-semibold">{filteredProducts.length} plans</p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-white/70 px-4 py-3 dark:bg-white/5">
                <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  <TrendingUp className="h-3.5 w-3.5 text-primary" />
                  Best sellers
                </p>
                <p className="mt-1 text-lg font-semibold">{bestSellerCount}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              {layout === "grid" ? "Grid layout" : "Line layout"}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">Product picks for your current filters</h2>
          </div>
          {search ? (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="text-sm font-semibold text-primary transition hover:text-primary/80"
            >
              Clear search
            </button>
          ) : null}
        </div>

        {filteredProducts.length ? (
          <>
            <motion.div
              layout
              className={layout === "grid" ? "grid gap-6 md:grid-cols-2 xl:grid-cols-3" : "grid gap-4"}
            >
              <AnimatePresence mode="popLayout">
                {visibleProducts.map((product) => (
                  <motion.div
                    layout
                    key={product.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.26 }}
                  >
                    <ProductCard product={product} variant={layout} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {visibleProducts.length < filteredProducts.length ? (
              <div className="flex justify-center pt-2">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.985 }}
                  whileHover={{ y: -2 }}
                  onClick={() => setVisibleCount((count) => count + 6)}
                  className="rounded-full border border-border/70 bg-white/80 px-5 py-3 text-sm font-semibold transition hover:border-primary/25 hover:bg-white dark:bg-white/5"
                >
                  Load more plans
                </motion.button>
              </div>
            ) : null}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-shell flex flex-col items-start gap-4 rounded-[1.85rem] p-6 md:p-8"
          >
            <div className="rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              No results
            </div>
            <div>
              <h3 className="text-2xl font-semibold tracking-tight">No products match the current search.</h3>
              <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                Try another keyword or jump back to all categories to view the full product list again.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("all");
              }}
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90"
            >
              Reset filters
            </button>
          </motion.div>
        )}
      </section>
    </div>
  );
}
