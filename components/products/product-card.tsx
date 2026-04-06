"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Clock3, Sparkles, Zap } from "lucide-react";
import type { MouseEvent } from "react";
import { toast } from "sonner";
import type { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/use-app-store";

export function ProductCard({
  product,
  variant = "grid"
}: {
  product: Product;
  variant?: "grid" | "list";
}) {
  const addToCart = useAppStore((state) => state.addToCart);
  const isOutOfStock = Boolean(product.isOutOfStock);
  const currentPrice = product.salePrice || product.price;
  const discountPercentage = product.salePrice
    ? Math.max(Math.round(((product.price - product.salePrice) / product.price) * 100), 0)
    : 0;
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 180, damping: 18 });
  const springY = useSpring(rotateY, { stiffness: 180, damping: 18 });
  const shadow = useTransform(
    springY,
    [-8, 8],
    ["0 18px 45px rgba(15, 23, 42, 0.10)", "0 26px 60px rgba(8, 145, 178, 0.22)"]
  );

  function onMove(event: MouseEvent<HTMLElement>) {
    if (variant === "list") {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const xPct = (x / rect.width - 0.5) * 2;
    const yPct = (y / rect.height - 0.5) * 2;

    rotateX.set(-yPct * 5);
    rotateY.set(xPct * 5);
  }

  function resetTilt() {
    rotateX.set(0);
    rotateY.set(0);
  }

  function handleAddToCart() {
    if (isOutOfStock) {
      toast.error("No stock available for this item.");
      return;
    }

    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: currentPrice,
      imageUrl: product.imageUrls[0] || "",
      categoryName: product.categoryName
    });
    toast.success(`${product.name} added to cart.`);
  }

  if (variant === "list") {
    return (
      <motion.article
        onMouseLeave={resetTilt}
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.995 }}
        style={{ boxShadow: shadow }}
        className="relative"
      >
        <div className="group relative overflow-hidden rounded-[1.8rem] border border-border/70 bg-[hsl(var(--surface)/0.94)] shadow-[0_18px_52px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="absolute inset-x-10 top-0 h-16 rounded-full bg-primary/8 blur-3xl" />
          <div className="relative grid md:grid-cols-[280px_minmax(0,1fr)_220px]">
            <Link href={`/products/${product.slug}`} className="relative block h-full overflow-hidden">
              <div className="relative h-full min-h-[220px] overflow-hidden md:min-h-[100%]">
                <Image
                  src={product.imageUrls[0] || "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=1200&q=80"}
                  alt={product.name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />
                <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                  <Badge className="bg-white/16 text-white shadow-none">{product.categoryName}</Badge>
                  {product.bestSelling ? (
                    <span className="rounded-full border border-amber-300/25 bg-amber-400/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-950">
                      Best seller
                    </span>
                  ) : null}
                </div>
                <div className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/10 px-3 py-1.5 text-xs text-white/82 backdrop-blur-md">
                  <Clock3 className="h-3.5 w-3.5" />
                  {product.durationInDays} day access
                </div>
              </div>
            </Link>

            <Link href={`/products/${product.slug}`} className="flex min-w-0 flex-col justify-between p-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  Premium plan
                </div>
                <div className="mt-3 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-2xl font-semibold tracking-tight">{product.name}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{product.shortDescription}</p>
                  </div>
                  <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-primary transition duration-300 group-hover:translate-x-1" />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {product.features.slice(0, 3).map((feature) => (
                  <span
                    key={feature}
                    className="rounded-full border border-border/70 bg-background/75 px-3 py-1 text-xs font-medium text-muted-foreground dark:bg-white/5"
                  >
                    {feature}
                  </span>
                ))}
                {isOutOfStock ? (
                  <span className="rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-600 dark:text-rose-300">
                    Out of stock
                  </span>
                ) : (
                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                    Instant activation
                  </span>
                )}
              </div>
            </Link>

            <div className="flex flex-col justify-between gap-5 border-t border-border/70 p-6 md:border-l md:border-t-0">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Starting at</p>
                <div>
                  <p className="text-3xl font-semibold tracking-tight">{formatCurrency(currentPrice)}</p>
                  {product.salePrice ? (
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="line-through">{formatCurrency(product.price)}</span>
                      <span className="rounded-full border border-primary/15 bg-primary/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                        {discountPercentage}% off
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="space-y-3">
                <Button type="button" onClick={handleAddToCart} className="w-full" disabled={isOutOfStock}>
                  {isOutOfStock ? "No stock" : "Add to cart"}
                </Button>
                <Link
                  href={`/products/${product.slug}`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border/80 bg-background/70 px-5 py-2.5 text-sm font-semibold transition hover:border-primary/20 hover:text-foreground dark:bg-white/5"
                >
                  View details
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      onMouseMove={onMove}
      onMouseLeave={resetTilt}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.992 }}
      style={{ rotateX: springX, rotateY: springY, boxShadow: shadow, transformStyle: "preserve-3d" }}
      className="relative h-full"
    >
      <div className="group relative flex h-full flex-col overflow-hidden rounded-[1.8rem] border border-border/70 bg-[hsl(var(--surface)/0.94)] shadow-[0_18px_52px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <div className="absolute inset-x-10 top-0 h-16 rounded-full bg-primary/8 blur-3xl" />

        <Link href={`/products/${product.slug}`} className="block">
          <div className="relative aspect-[16/11] overflow-hidden">
            <Image
              src={product.imageUrls[0] || "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=1200&q=80"}
              alt={product.name}
              fill
              className="object-cover transition duration-700 group-hover:scale-105 group-hover:brightness-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/78 via-slate-950/16 to-transparent" />
            <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
              <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white/15 to-transparent blur-xl" />
            </div>
            <div className="absolute left-5 top-5 flex flex-wrap gap-2">
              <Badge className="bg-white/16 text-white shadow-none">{product.categoryName}</Badge>
              {discountPercentage > 0 ? (
                <span className="rounded-full border border-white/16 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/82">
                  {discountPercentage}% off
                </span>
              ) : null}
            </div>
            {product.bestSelling ? (
              <div className="absolute right-5 top-5 rounded-full border border-amber-300/20 bg-amber-400/92 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-950 shadow-lg shadow-amber-500/20">
                Best seller
              </div>
            ) : null}
            <div className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/10 px-3 py-1.5 text-xs text-white/82 backdrop-blur-md">
              <Clock3 className="h-3.5 w-3.5" />
              {product.durationInDays} days
            </div>
          </div>
        </Link>

        <div className="relative flex flex-1 flex-col p-6">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-primary">
            <Zap className="h-3.5 w-3.5" />
            Instant-ready access
          </div>

          <div className="mt-4 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <Link href={`/products/${product.slug}`} className="block">
                <h3 className="text-xl font-semibold tracking-tight">{product.name}</h3>
              </Link>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{product.shortDescription}</p>
            </div>
            <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-primary transition duration-300 group-hover:translate-x-1" />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {product.features.slice(0, 2).map((feature) => (
              <span
                key={feature}
                className="rounded-full border border-border/70 bg-background/75 px-3 py-1 text-xs font-medium text-muted-foreground dark:bg-white/5"
              >
                {feature}
              </span>
            ))}
          </div>

          <div className="mt-6 rounded-[1.35rem] border border-border/70 bg-background/70 p-4 dark:bg-white/5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Price</p>
            <div className="mt-2 flex items-end justify-between gap-3">
              <div>
                <p className="text-3xl font-semibold tracking-tight">{formatCurrency(currentPrice)}</p>
                {product.salePrice ? (
                  <p className="mt-1 text-sm text-muted-foreground line-through">{formatCurrency(product.price)}</p>
                ) : null}
              </div>
              {isOutOfStock ? (
                <span className="rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-rose-600 dark:text-rose-300">
                  No stock
                </span>
              ) : (
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
                  Active
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="relative flex items-center gap-3 px-6 pb-6">
          <Button type="button" onClick={handleAddToCart} className="flex-1" disabled={isOutOfStock}>
            {isOutOfStock ? "No stock" : "Add to cart"}
          </Button>
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex h-11 items-center justify-center rounded-full border border-border/80 bg-background/70 px-4 text-sm font-semibold transition hover:border-primary/20 hover:text-foreground dark:bg-white/5"
          >
            Details
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
