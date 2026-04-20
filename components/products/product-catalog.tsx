"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Grid2X2, List, Search, Sparkles } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { Category, Offer, Product } from "@/types";
import { ProductCard } from "@/components/products/product-card";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store/use-app-store";
import { getStarterCategoryMeta } from "@/lib/catalog";
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
  const searchParams = useSearchParams();
  const { search, category, setSearch, setCategory, addToCart } = useAppStore();
  const [visibleCount, setVisibleCount] = useState(6);
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const activeOffers = useMemo(() => offers.filter((offer) => offer.active).slice(0, 3), [offers]);

  const categoryStats = useMemo(() => {
    return categories.map((item) => {
      const matchingProducts = products.filter((product) => product.categoryId === item.id);
      const startingPrice = matchingProducts.length
        ? Math.min(...matchingProducts.map((product) => product.salePrice || product.price))
        : null;

      return {
        category: item,
        count: matchingProducts.length,
        startingPrice,
        bestSellingCount: matchingProducts.filter((product) => product.bestSelling).length
      };
    });
  }, [categories, products]);

  const selectedCategoryStat = useMemo(
    () => categoryStats.find((item) => item.category.id === category) || null,
    [category, categoryStats]
  );
  const selectedCategoryMeta = selectedCategoryStat
    ? getStarterCategoryMeta(selectedCategoryStat.category.slug)
    : null;

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

  useEffect(() => {
    if (!selectedProduct) {
      return;
    }
    const stillVisible = filteredProducts.some((item) => item.id === selectedProduct.id);
    if (!stillVisible) {
      setSelectedProduct(null);
    }
  }, [filteredProducts, selectedProduct]);

  useEffect(() => {
    const slug = searchParams.get("category");
    if (!slug) {
      if (category !== "all") {
        setCategory("all");
      }
      return;
    }

    const matched = categories.find((item) => item.slug === slug);
    if (matched && category !== matched.id) {
      setCategory(matched.id);
    }
  }, [searchParams, categories, category, setCategory]);

  function resetFilters() {
    setSearch("");
    setCategory("all");
  }

  function scrollToResults() {
    if (typeof document === "undefined") {
      return;
    }

    document.getElementById("catalog-results")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  function handleInlineAddToCart(product: Product) {
    if (product.isOutOfStock) {
      toast.error("No stock available for this item.");
      return;
    }

    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.salePrice || product.price,
      imageUrl: product.imageUrls[0] || "",
      categoryName: product.categoryName
    });
    toast.success(`${product.name} added to cart`);
  }

  return (
    <div className="space-y-8">
      {activeOffers.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {activeOffers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="relative h-full overflow-hidden rounded-[1.25rem] border border-white/10 bg-[linear-gradient(160deg,rgba(17,24,39,0.96),rgba(30,41,59,0.92))] p-5 text-white shadow-[0_18px_42px_rgba(0,0,0,0.25)]"
            >
              <div
                className={`absolute -right-10 -top-10 h-36 w-36 rounded-full ${
                  offerGlowTones[index % offerGlowTones.length]
                } blur-3xl`}
              />
              {offer.badge ? (
                <p className="relative inline-flex rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em]">
                  {offer.badge}
                </p>
              ) : null}
              <h3 className="relative mt-3 text-lg font-black">{offer.title}</h3>
              <p className="relative mt-2 text-sm leading-6 text-white/82">{offer.description}</p>
              {offer.ctaLabel && offer.ctaUrl ? (
                <Link
                  href={offer.ctaUrl}
                  className="relative mt-4 inline-flex text-sm font-semibold text-white underline-offset-4 hover:underline"
                >
                  {offer.ctaLabel}
                </Link>
              ) : null}
            </motion.div>
          ))}
        </div>
      ) : null}

      {selectedCategoryStat ? (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,rgba(17,24,39,0.96),rgba(30,41,59,0.94),rgba(51,65,85,0.92))] p-6 text-white shadow-[0_24px_56px_rgba(15,23,42,0.18)] md:p-7"
        >
          {selectedCategoryStat.category.imageUrl ? (
            <div className="absolute inset-y-0 right-0 hidden w-[40%] overflow-hidden lg:block">
              <Image
                src={selectedCategoryStat.category.imageUrl}
                alt={selectedCategoryStat.category.name}
                fill
                className="object-cover opacity-28"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-slate-950/55 to-slate-950/88" />
            </div>
          ) : null}

          <div className="absolute -right-16 top-0 h-40 w-40 rounded-full bg-emerald-300/20 blur-3xl" />
          <div className="absolute -left-12 bottom-0 h-36 w-36 rounded-full bg-amber-300/14 blur-3xl" />

          <div className="relative grid gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.18em]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Active category
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black tracking-tight md:text-3xl">
                  {selectedCategoryStat.category.name}
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/84 md:text-base">
                  {selectedCategoryMeta?.description ||
                    selectedCategoryStat.category.description ||
                    "This category is ready for stronger products, sharper positioning, and a cleaner buying flow."}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={scrollToResults}
                  className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/16"
                >
                  Browse products <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-black/12 px-5 py-2.5 text-sm font-semibold text-white/92 transition hover:bg-black/18"
                >
                  Back to full catalog
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <div className="rounded-[1.4rem] border border-white/12 bg-white/8 px-4 py-4 text-sm leading-6 text-white/88">
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-white/58">Live items</p>
                <p className="mt-3 text-2xl font-black">{selectedCategoryStat.count}</p>
                <p className="mt-2 text-white/72">Products currently visible in this category.</p>
              </div>
              <div className="rounded-[1.4rem] border border-white/12 bg-white/8 px-4 py-4 text-sm leading-6 text-white/88">
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-white/58">Starting price</p>
                <p className="mt-3 text-2xl font-black">
                  {selectedCategoryStat.startingPrice
                    ? formatCurrency(selectedCategoryStat.startingPrice)
                    : "--"}
                </p>
                <p className="mt-2 text-white/72">The lowest live entry point in this lane.</p>
              </div>
              <div className="rounded-[1.4rem] border border-white/12 bg-white/8 px-4 py-4 text-sm leading-6 text-white/88">
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-white/58">Best sellers</p>
                <p className="mt-3 text-2xl font-black">{selectedCategoryStat.bestSellingCount}</p>
                <p className="mt-2 text-white/72">Products already marked as your stronger picks.</p>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}

      <div id="catalog-results" className="section-shell p-5 md:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Catalog controls</p>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              {selectedCategoryStat
                ? `Showing ${filteredProducts.length} product${filteredProducts.length === 1 ? "" : "s"} in ${selectedCategoryStat.category.name}.`
                : "Showing every live product across the store."}
            </p>
          </div>
          <div className="control-surface rounded-full px-3 py-1.5 text-sm text-muted-foreground">
            Showing <span className="font-bold text-foreground">{filteredProducts.length}</span> items
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
          </div>
        </div>
      </div>

      {selectedProduct ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-shell overflow-hidden p-4 md:p-5"
        >
          <div className="grid gap-5 md:grid-cols-[220px_1fr] md:items-start">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/70 bg-muted/30">
              <Image
                src={selectedProduct.imageUrls[0] || "https://picsum.photos/seed/product-preview/900/700"}
                alt={selectedProduct.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{selectedProduct.categoryName}</p>
              <h3 className="mt-2 text-2xl font-black tracking-tight">{selectedProduct.name}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {selectedProduct.description || selectedProduct.shortDescription}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <p className="text-3xl font-black">{formatCurrency(selectedProduct.salePrice || selectedProduct.price)}</p>
                <span className="rounded-full border border-border/70 px-3 py-1 text-xs text-muted-foreground">
                  {selectedProduct.durationInDays} days
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => handleInlineAddToCart(selectedProduct)}
                  className="btn-primary"
                  disabled={Boolean(selectedProduct.isOutOfStock)}
                >
                  {selectedProduct.isOutOfStock ? "No stock" : "Add to cart"}
                </button>
                <Link href={`/products/${selectedProduct.slug}`} className="btn-ghost">
                  Full details
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}

      {visibleProducts.length ? (
        <>
          <motion.div layout className={layout === "grid" ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4" : "grid gap-5"}>
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
                  <ProductCard product={product} variant={layout} onPreview={setSelectedProduct} />
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
                    return (
                      <div
                        key={item.id}
                        className="rounded-[1.5rem] border border-border/70 bg-background/72 px-5 py-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-bold text-foreground">{item.name}</p>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
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
                    <div
                      key={item}
                      className="rounded-[1.5rem] border border-border/70 bg-background/72 px-5 py-4 text-sm font-medium"
                    >
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
