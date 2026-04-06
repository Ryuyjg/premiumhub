"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Grid2X2, List, Search } from "lucide-react";
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

  useEffect(() => {
    setVisibleCount(6);
  }, [search, category]);

  return (
    <div className="space-y-8">
      {offers.length ? (
        <div className="grid gap-4 md:grid-cols-3">
          {offers.slice(0, 3).map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`relative overflow-hidden rounded-[1.5rem] border border-white/20 bg-gradient-to-r ${offer.accent || "from-cyan-500 to-blue-600"} p-5 text-white shadow-xl`}
            >
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/20 blur-2xl" />
              {offer.badge ? (
                <p className="relative inline-flex rounded-full border border-white/40 bg-white/15 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em]">
                  {offer.badge}
                </p>
              ) : null}
              <h3 className="relative mt-3 text-lg font-semibold">{offer.title}</h3>
              <p className="relative mt-2 text-sm text-white/85">{offer.description}</p>
              {offer.ctaLabel && offer.ctaUrl ? (
                <Link href={offer.ctaUrl} className="relative mt-4 inline-flex text-sm font-semibold text-white underline-offset-4 hover:underline">
                  {offer.ctaLabel}
                </Link>
              ) : null}
            </motion.div>
          ))}
        </div>
      ) : null}

      <div className="surface rounded-[1.75rem] p-5">
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
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search plans, providers, bundles..."
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLayout("grid")}
              className={layout === "grid" ? "pill-filter-active !px-3 !py-1.5" : "pill-filter !px-3 !py-1.5"}
            >
              <Grid2X2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setLayout("list")}
              className={layout === "list" ? "pill-filter-active !px-3 !py-1.5" : "pill-filter !px-3 !py-1.5"}
            >
              <List className="h-4 w-4" />
            </button>
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span> plans
            </div>
          </div>
        </div>
      </div>
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
            className="rounded-full border border-border bg-white/75 px-5 py-2.5 text-sm font-semibold transition hover:border-primary/30 dark:bg-white/5"
          >
            Load more plans
          </motion.button>
        </div>
      ) : null}
    </div>
  );
}
