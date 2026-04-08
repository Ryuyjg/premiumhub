"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Grid2X2, List, Search, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Category, Offer, Product } from "@/types";
import { ProductCard } from "@/components/products/product-card";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store/use-app-store";
import { FEATURED_CATEGORY_SLUG, getStarterCategoryMeta, isFeaturedCategory } from "@/lib/catalog";
import { formatCurrency } from "@/lib/utils";

const offerGlowTones = ["bg-primary/20", "bg-accent/18", "bg-white/10"];

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
  const featuredCategory = useMemo(
    () => categories.find((item) => item.slug === FEATURED_CATEGORY_SLUG) || null,
    [categories]
  );
  const featuredMeta = featuredCategory ? getStarterCategoryMeta(featuredCategory.slug) : null;
  const categoryStats = useMemo(() => {
    return categories.map((item) => {
      const matchingProducts = products.filter((product) => product.categoryId === item.id);
      const startingPrice = matchingProducts.length
        ? Math.min(...matchingProducts.map((product) => product.salePrice || product.price))
        : null;

      return {
        category: item,
        count: matchingProducts.length,
        startingPrice
      };
    });
  }, [categories, products]);

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
              className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(160deg,rgba(15,23,42,0.98),rgba(30,41,59,0.96))] p-5 text-white shadow-[0_18px_48px_rgba(15,23,42,0.14)]"
            >
              <div className={`absolute -right-10 -top-10 h-36 w-36 rounded-full ${offerGlowTones[index % offerGlowTones.length]} blur-3xl`} />
              {offer.badge ? (
                <p className="relative inline-flex rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em]">
                  {offer.badge}
                </p>
              ) : null}
              <h3 className="relative mt-3 text-lg font-black">{offer.title}</h3>
              <p className="relative mt-2 text-sm leading-6 text-white/82">{offer.description}</p>
              {offer.ctaLabel && offer.ctaUrl ? (
                <Link href={offer.ctaUrl} className="relative mt-4 inline-flex text-sm font-semibold text-white underline-offset-4 hover:underline">
                  {offer.ctaLabel}
                </Link>
              ) : null}
            </motion.div>
          ))}
        </div>
      ) : null}

      {featuredCategory ? (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,rgba(5,12,26,0.98),rgba(18,44,95,0.96),rgba(14,116,144,0.92))] p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.18)] md:p-7"
        >
          {featuredCategory.imageUrl ? (
            <div className="absolute inset-y-0 right-0 hidden w-[38%] overflow-hidden lg:block">
              <Image
                src={featuredCategory.imageUrl}
                alt={featuredCategory.name}
                fill
                className="object-cover opacity-28"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-slate-950/50 to-slate-950/85" />
            </div>
          ) : null}
          <div className="absolute -right-16 top-0 h-40 w-40 rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="absolute -left-12 bottom-0 h-36 w-36 rounded-full bg-blue-400/18 blur-3xl" />
          <div className="relative grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-4">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.18em]">
                <Sparkles className="h-3.5 w-3.5" />
                Main product category
              </span>
              <div>
                <h3 className="text-2xl font-black tracking-tight md:text-3xl">{featuredCategory.name}</h3>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/84 md:text-base">
                  {featuredMeta?.description || featuredCategory.description || "Built for your flagship Telegram automation products."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCategory(featuredCategory.id)}
                className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/16"
              >
                Focus this category <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {[
                "Use longer descriptions and setup notes here",
                "Keep your best automation tools in this lane",
                "Make this the category you lead the catalog with"
              ].map((item) => (
                <div key={item} className="rounded-[1.4rem] border border-white/12 bg-white/8 px-4 py-4 text-sm leading-6 text-white/88">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ) : null}

      {categoryStats.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {categoryStats.map(({ category: item, count, startingPrice }, index) => {
            const highlighted = isFeaturedCategory(item);
            const active = category === item.id;

            return (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => setCategory(item.id)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className={`group relative overflow-hidden rounded-[1.75rem] border text-left transition-all duration-300 hover:-translate-y-1 ${
                  highlighted
                    ? "border-primary/22 bg-[linear-gradient(145deg,rgba(5,12,26,0.98),rgba(18,44,95,0.96),rgba(14,116,144,0.92))] text-white shadow-[0_22px_48px_rgba(15,23,42,0.14)] xl:col-span-2"
                    : "border-border/70 bg-[hsl(var(--surface)/0.9)] text-foreground shadow-[0_16px_36px_rgba(15,23,42,0.06)]"
                } ${active ? "ring-2 ring-primary/35" : ""}`}
              >
                {item.imageUrl ? (
                  <div className={`relative ${highlighted ? "aspect-[16/7]" : "aspect-[16/9]"}`}>
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover transition duration-500 group-hover:scale-105" />
                    <div
                      className={`absolute inset-0 ${
                        highlighted
                          ? "bg-gradient-to-t from-slate-950/85 via-slate-950/28 to-transparent"
                          : "bg-gradient-to-t from-slate-950/72 via-slate-950/12 to-transparent"
                      }`}
                    />
                  </div>
                ) : (
                  <div
                    className={`flex ${highlighted ? "aspect-[16/7]" : "aspect-[16/9]"} items-center justify-center ${
                      highlighted ? "bg-white/8" : "bg-primary/8"
                    }`}
                  >
                    <span className={`text-3xl font-black tracking-tight ${highlighted ? "text-white/92" : "text-foreground/75"}`}>
                      {item.name
                        .split(" ")
                        .slice(0, 2)
                        .map((word) => word[0])
                        .join("")}
                    </span>
                  </div>
                )}

                <div className="space-y-3 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className={`text-lg font-black tracking-tight ${highlighted ? "text-white" : "text-foreground"}`}>{item.name}</p>
                      <p className={`mt-1 text-xs uppercase tracking-[0.14em] ${highlighted ? "text-white/62" : "text-muted-foreground"}`}>
                        {count > 0 ? `${count} live item${count === 1 ? "" : "s"}` : "Ready for products"}
                      </p>
                    </div>
                    {highlighted ? (
                      <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white">
                        Main lane
                      </span>
                    ) : null}
                  </div>

                  <p className={`line-clamp-3 text-sm leading-6 ${highlighted ? "text-white/82" : "text-muted-foreground"}`}>
                    {item.description || "Category ready for manual uploads and stronger descriptions."}
                  </p>

                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className={highlighted ? "text-white/78" : "text-muted-foreground"}>
                      {startingPrice ? `Starts at ${formatCurrency(startingPrice)}` : "Add products to activate"}
                    </span>
                    <span className={`inline-flex items-center gap-1 font-semibold ${highlighted ? "text-white" : "text-primary"}`}>
                      Open category <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      ) : null}

      <div className="section-shell p-5 md:p-6">
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
                className={
                  category === item.id
                    ? "pill-filter-active whitespace-nowrap"
                    : isFeaturedCategory(item)
                      ? "pill-filter whitespace-nowrap border-primary/35 bg-primary/10 text-foreground"
                      : "pill-filter whitespace-nowrap"
                }
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
            <div className="control-surface rounded-full px-3 py-1.5 text-sm text-muted-foreground">
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
                className="control-surface rounded-full px-5 py-2.5 text-sm font-semibold"
              >
                Load more items
              </motion.button>
            </div>
          ) : null}
        </>
      ) : catalogIsEmpty ? (
        <div className="section-shell rounded-[2.25rem] border-dashed p-8 md:p-10">
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

            <div className="grid gap-3 sm:grid-cols-2">
              {categories.length
                ? categories.map((item) => {
                    const highlighted = isFeaturedCategory(item);
                    return (
                      <div
                        key={item.id}
                        className={
                          highlighted
                            ? "sm:col-span-2 rounded-[1.6rem] border border-primary/20 bg-[linear-gradient(145deg,rgba(5,12,26,0.98),rgba(18,44,95,0.96),rgba(14,116,144,0.92))] px-5 py-4 text-white shadow-[0_20px_42px_rgba(15,23,42,0.14)]"
                            : "rounded-[1.5rem] border border-border/70 bg-background/72 px-5 py-4"
                        }
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className={`text-sm font-bold ${highlighted ? "text-white" : "text-foreground"}`}>{item.name}</p>
                          {highlighted ? (
                            <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white">
                              Main
                            </span>
                          ) : null}
                        </div>
                        <p className={`mt-2 text-sm leading-6 ${highlighted ? "text-white/82" : "text-muted-foreground"}`}>
                          {item.description || "Category ready for your manual product uploads."}
                        </p>
                      </div>
                    );
                  })
                : [
                    "Create your core categories first",
                    "Use real images and delivery notes",
                    "Publish featured items only after quality check"
                  ].map((item) => (
                    <div key={item} className="rounded-[1.5rem] border border-border/70 bg-background/72 px-5 py-4 text-sm font-medium">
                      {item}
                    </div>
                  ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="section-shell p-8 text-center">
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
