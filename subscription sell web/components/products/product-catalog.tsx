"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { Category, Product } from "@/types";
import { ProductCard } from "@/components/products/product-card";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store/use-app-store";

export function ProductCatalog({
  products,
  categories
}: {
  products: Product[];
  categories: Category[];
}) {
  const { search, category, setSearch, setCategory } = useAppStore();
  const [visibleCount, setVisibleCount] = useState(6);

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

  return (
    <div className="space-y-8">
      <div className="surface rounded-[1.75rem] p-5">
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
          <div className="flex flex-wrap gap-2">
            <motion.button
              type="button"
              onClick={() => setCategory("all")}
              whileTap={{ scale: 0.98 }}
              className={category === "all" ? "pill-filter-active" : "pill-filter"}
            >
              All plans
            </motion.button>
            {categories.map((item) => (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => setCategory(item.id)}
                whileTap={{ scale: 0.98 }}
                className={category === item.id ? "pill-filter-active" : "pill-filter"}
              >
                {item.name}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
      <motion.div layout className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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
              <ProductCard product={product} />
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
