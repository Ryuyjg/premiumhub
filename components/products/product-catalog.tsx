"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Grid2X2, List, Search, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Category, Offer, Product } from "@/types";
import { ProductCard } from "@/components/products/product-card";
import { Input } from "@/components/ui/input";
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

  const activeOffers = useMemo(() => offers.filter((offer) => offer.active).slice(0, 3), [offers]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        search.length === 0 ||
        `${product.name} ${product.shortDescription}`.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "all" || product.categoryId === category;
      return matchesSearch && matchesCategory;
    });
  }, [category, products, search]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const catalogIsEmpty = products.length === 0;

  useEffect(() => {
    setVisibleCount(6);
  }, [search, category]);

  function resetFilters() {
    setSearch("");
    setCategory("all");
  }

  return (
    <div className="space-y-8">
      {activeOffers.length ? (
        <div className="grid gap-4 md:grid-cols-3">
          {activeOffers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className={`relative overflow-hidden rounded-[1.75rem] border border-white/25 bg-gradient-to-br ${offer.accent || "from-primary to-accent"} p-5 text-white shadow-2xl`}
            >
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/25 blur-2xl" />
              {offer.badge ? (
                <p className="relative inline-flex rounded-full border border-white/40 bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em]">
                  {offer.badge}
                </p>
              ) : null}
              <h3 className="relative mt-3 text-lg font-black">{offer.title}</h3>
              <p className="relative mt-2 text-sm text-white/90">{offer.description}</p>
              {offer.ctaLabel && offer.ctaUrl ? (
                <Link href={offer.ctaUrl} className="relative mt-4 inline-flex text-sm font-semibold underline-offset-4 hover:underline">
                  {offer.ctaLabel}
                </Link>
              ) : null}
            </motion.div>
          ))}
        </div>
      ) : null}

      <div className="rounded-[2rem] border border-border/55 bg-white/72 p-5 shadow-[0_22px_54px_rgba(2,6,23,0.05)] backdrop-blur-xl dark:bg-white/4 md:p-6">
        <div className="mb-4 overflow-x-auto pb-1">
          <div className="flex min-w-max gap-2">
            <motion.button
              type="button"
              onClick={() => setCategory("all")}
              whileTap={{ scale: 0.98 }}
              className={category === "all" ? "pill-filter-active whitespace-nowrap" : "pill-filter whitespace-nowrap"}
            >
              All categories
            </motion.button>
            {categories.map((item) => (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => setCategory(item.id)}
                whileTap={{ scale: 0.98 }}
                className={category === item.id ? "pill-filter-active whitespace-nowrap" : "pill-filter whitespace-nowrap"}
              >
                {item.name}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products, bundles, providers..."
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            <button
              type="button"
              onClick={() => setLayout("grid")}
              className={layout === "grid" ? "pill-filter-active !px-3 !py-1.5" : "pill-filter !px-3 !py-1.5"}
              aria-label="Grid view"
            >
              <Grid2X2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setLayout("list")}
              className={layout === "list" ? "pill-filter-active !px-3 !py-1.5" : "pill-filter !px-3 !py-1.5"}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
            <div className="rounded-full border border-border/60 bg-white/75 px-3 py-1.5 text-sm text-muted-foreground dark:bg-white/5">
              Showing <span className="font-bold text-foreground">{filteredProducts.length}</span> items
            </div>
          </div>
        </div>
      </div>

      {visibleProducts.length ? (
        <>
          <motion.div layout className={layout === "grid" ? "grid gap-6 md:grid-cols-2 xl:grid-cols-3" : "grid gap-5"}>
            <AnimatePresence mode="popLayout">
              {visibleProducts.map((product) => (
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.24 }}
                >
                  <ProductCard product={product} variant={layout} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {visibleProducts.length < filteredProducts.length ? (
            <div className="flex justify-center">
              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                whileHover={{ y: -2 }}
                onClick={() => setVisibleCount((count) => count + 6)}
                className="rounded-full border border-border/65 bg-white/75 px-5 py-2.5 text-sm font-semibold transition hover:border-primary/35 hover:bg-primary/5 dark:bg-white/5"
              >
                Load more items
              </motion.button>
            </div>
          ) : null}
        </>
      ) : catalogIsEmpty ? (
        <div className="rounded-[2.25rem] border border-dashed border-border/70 bg-white/68 p-8 shadow-[0_22px_60px_rgba(2,6,23,0.05)] backdrop-blur-xl dark:bg-white/4 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div className="space-y-4">
              <span className="glow-badge">
                <Sparkles className="h-3.5 w-3.5" />
                Catalog currently empty
              </span>
              <h2 className="text-3xl font-black tracking-tight md:text-4xl">
                The storefront is ready for a
                <span className="gradient-text block">better first collection.</span>
              </h2>
              <p className="max-w-2xl text-base leading-8 text-muted-foreground">
                This is a healthy reset. Add the exact categories and products you want, then reconnect external payment
                only after the catalog and copy feel strong.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/login" className="btn-primary">
                  Open account area
                </Link>
                <Link href="/contact" className="btn-ghost">
                  View support links
                </Link>
              </div>
            </div>

            <div className="grid gap-3">
              {[
                "Create your core categories first",
                "Use real images and delivery notes",
                "Publish featured items only after quality check"
              ].map((item) => (
                <div key={item} className="rounded-[1.5rem] border border-border/55 bg-background/70 px-5 py-4 text-sm font-medium">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-[2rem] border border-border/55 bg-white/72 p-8 text-center shadow-[0_20px_55px_rgba(2,6,23,0.05)] backdrop-blur-xl dark:bg-white/4">
          <p className="text-lg font-semibold">No products match your filters</p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Try a different search term or reset the active category filter to see more results.
          </p>
          <button type="button" onClick={resetFilters} className="btn-primary mt-6">
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}
