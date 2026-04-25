"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import type { Category, Product } from "@/types";
import { MEGA_SALES_CATEGORY_SLUG } from "@/lib/catalog";
import { formatCurrency } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";

export function ProductCatalog({
  products,
  categories
}: {
  products: Product[];
  categories: Category[];
}) {
  const searchParams = useSearchParams();
  const { category, setCategory, addToCart, cartItems } = useAppStore();

  useEffect(() => {
    const slug = searchParams.get("category");
    if (!slug) {
      return;
    }

    if (slug === MEGA_SALES_CATEGORY_SLUG && category !== MEGA_SALES_CATEGORY_SLUG) {
      setCategory(MEGA_SALES_CATEGORY_SLUG);
      return;
    }

    const matched = categories.find((item) => item.slug === slug);
    if (matched && category !== matched.id) {
      setCategory(matched.id);
    }
  }, [searchParams, categories, category, setCategory]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (category === "all") {
        return true;
      }

      if (category === MEGA_SALES_CATEGORY_SLUG) {
        const hasSalePrice = typeof product.salePrice === "number" && product.salePrice < product.price;
        const promotional = hasSalePrice || Boolean(product.featured) || Boolean(product.bestSelling);
        return promotional;
      }

      return product.categoryId === category;
    });
  }, [products, category]);

  function handleInlineAddToCart(product: Product) {
    if (product.isOutOfStock) {
      toast.error("No stock available for this item.");
      return;
    }

    const alreadyInCart = cartItems.some((item) => item.productId === product.id);
    if (alreadyInCart) {
      toast.message("Already in cart", {
        description: "This product is already in your cart."
      });
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
    <div className="space-y-5">
      {filteredProducts.length ? (
        <div className="grid grid-cols-3 gap-3 md:gap-4 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="overflow-hidden rounded-2xl border border-border/70 bg-[hsl(var(--surface)/0.94)]"
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
                    className="bg-black object-contain transition duration-300 hover:scale-[1.03]"
                  />
                </div>
              </Link>

              <div className="space-y-2 p-3">
                <Link href={`/products/${product.slug}`} className="block">
                  <p className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-5">{product.name}</p>
                </Link>

                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-black">{formatCurrency(product.salePrice || product.price)}</p>
                  <p className="text-[11px] text-muted-foreground">{product.durationInDays}d</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleInlineAddToCart(product)}
                  className="btn-primary h-9 w-full px-3 text-xs"
                  disabled={Boolean(product.isOutOfStock)}
                >
                  {product.isOutOfStock ? "No stock" : "Add to cart"}
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border/70 bg-[hsl(var(--surface)/0.9)] p-6 text-center text-sm text-muted-foreground">
          {category === MEGA_SALES_CATEGORY_SLUG
            ? "Mega sale products will appear here soon. Browse the regular categories for active items."
            : "Products for this category will appear here soon. Try another category or contact support."}
        </div>
      )}
    </div>
  );
}
