"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { MessageCircle } from "lucide-react";
import type { Category, Product } from "@/types";
import { MEGA_SALES_CATEGORY_SLUG } from "@/lib/catalog";
import { formatCurrency } from "@/lib/utils";
import { getWhatsAppOrderUrl } from "@/lib/whatsapp";
import {
  CATALOG_UPDATED_EVENT,
  getStoredCategories,
  getStoredProducts
} from "@/lib/client-catalog";

export function ProductCatalog({
  products = [],
  categories = []
}: {
  products?: Product[];
  categories?: Category[];
}) {
  const searchParams = useSearchParams();

  const [catalogCategories, setCatalogCategories] = useState<Category[]>(() =>
    getStoredCategories(categories)
  );
  const [catalogProducts, setCatalogProducts] = useState<Product[]>(() =>
    getStoredProducts(products)
  );

  useEffect(() => {
    function syncCatalog() {
      setCatalogCategories(getStoredCategories(categories));
      setCatalogProducts(getStoredProducts(products));
    }
    syncCatalog();
    window.addEventListener(CATALOG_UPDATED_EVENT, syncCatalog);
    return () => window.removeEventListener(CATALOG_UPDATED_EVENT, syncCatalog);
  }, [categories, products]);

  const selectedCategory = useMemo(() => {
    const slug = searchParams.get("category");
    if (!slug) {
      return "all";
    }

    if (slug === MEGA_SALES_CATEGORY_SLUG) {
      return MEGA_SALES_CATEGORY_SLUG;
    }

    const matched = catalogCategories.find((item) => item.slug === slug);
    return matched ? matched.slug : "all";
  }, [searchParams, catalogCategories]);

  const filteredProducts = useMemo(() => {
    return catalogProducts.filter((product) => {
      if (selectedCategory === "all") {
        return true;
      }

      if (selectedCategory === MEGA_SALES_CATEGORY_SLUG) {
        const hasSalePrice = typeof product.salePrice === "number" && product.salePrice < product.price;
        const promotional = hasSalePrice || Boolean(product.featured) || Boolean(product.bestSelling);
        return promotional;
      }

      return (
        product.categoryId === selectedCategory ||
        product.categoryName.toLowerCase() === selectedCategory.replace(/-/g, " ")
      );
    });
  }, [catalogProducts, selectedCategory]);

  function handleInlineOrderNow(product: Product) {
    if (product.isOutOfStock || product.stockCount === 0) return;
    const url = getWhatsAppOrderUrl(product, 1);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="space-y-5">
      {filteredProducts.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {filteredProducts.map((product) => {
            const isOutOfStock = Boolean(product.isOutOfStock) || product.stockCount === 0;
            const stockCount = product.stockCount;

            return (
              <article
                key={product.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-[hsl(var(--surface)/0.94)] transition duration-300 hover:border-primary/40 hover:shadow-lg"
              >
                <Link href={`/products/${product.slug}`} className="block">
                  <div className="relative aspect-square overflow-hidden bg-white">
                    <Image
                      src={
                        product.imageUrls[0] ||
                        "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=1200&q=80"
                      }
                      alt={product.name}
                      fill
                      unoptimized
                      className="bg-white object-contain p-3 transition duration-300 group-hover:scale-105"
                    />
                  </div>
                </Link>

                <div className="flex flex-1 flex-col justify-between space-y-3 p-3.5">
                  <div>
                    <Link href={`/products/${product.slug}`} className="block">
                      <p className="line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-5 transition hover:text-primary">
                        {product.name}
                      </p>
                    </Link>

                    <div className="mt-2 flex items-center justify-between gap-2">
                      <p className="text-base font-extrabold text-foreground">
                        {formatCurrency(product.salePrice || product.price)}
                      </p>
                      <span className="text-[11px] font-medium text-muted-foreground">{product.durationInDays}d</span>
                    </div>

                    <div className="mt-2">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        isOutOfStock
                          ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                          : stockCount && stockCount <= 5
                          ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                          : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      }`}>
                        {isOutOfStock
                          ? "Out of stock"
                          : stockCount !== undefined
                          ? `⚡ ${stockCount} left`
                          : "In stock"}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleInlineOrderNow(product)}
                    className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-700"
                    disabled={isOutOfStock}
                  >
                    <MessageCircle className="h-4 w-4 fill-white text-emerald-600" />
                    {isOutOfStock ? "No Stock" : "Order Now"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-border/70 bg-[hsl(var(--surface)/0.9)] p-6 text-center text-sm text-muted-foreground">
          {selectedCategory === MEGA_SALES_CATEGORY_SLUG
            ? "Mega sale products will appear here soon. Browse the regular categories for active items."
            : "Products for this category will appear here soon. Try another category or contact support."}
        </div>
      )}
    </div>
  );
}
