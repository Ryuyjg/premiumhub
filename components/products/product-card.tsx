"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, Clock3, MessageCircle, Sparkles } from "lucide-react";
import type { MouseEvent } from "react";
import type { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getWhatsAppOrderUrl } from "@/lib/whatsapp";

export function ProductCard({
  product,
  variant = "grid",
  onPreview
}: {
  product: Product;
  variant?: "grid" | "list";
  onPreview?: (product: Product) => void;
}) {
  const isOutOfStock = Boolean(product.isOutOfStock) || product.stockCount === 0;
  const stockCount = product.stockCount;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(y, { stiffness: 180, damping: 18, mass: 0.5 });
  const ry = useSpring(x, { stiffness: 180, damping: 18, mass: 0.5 });

  function onMove(event: MouseEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    x.set((px - 0.5) * 8);
    y.set((0.5 - py) * 8);
  }

  function resetTilt() {
    x.set(0);
    y.set(0);
  }

  function handleOrderNow() {
    if (isOutOfStock) return;
    const url = getWhatsAppOrderUrl(product, 1);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function handlePreview(event: MouseEvent<HTMLAnchorElement>) {
    if (!onPreview) return;
    event.preventDefault();
    onPreview(product);
  }

  return (
    <motion.article
      onMouseMove={onMove}
      onMouseLeave={resetTilt}
      style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
      className="relative"
    >
      <div
        className={`group relative flex h-full flex-col overflow-hidden rounded-[1.2rem] border border-border/70 bg-[hsl(var(--surface)/0.94)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:border-primary/45 hover:shadow-[0_24px_52px_rgba(239,68,68,0.18)] ${
          variant === "list" ? "md:rounded-[1.35rem]" : ""
        }`}
      >
        {product.bestSelling ? (
          <div className="absolute left-4 top-4 z-20 inline-flex items-center gap-1 rounded-full border border-primary/22 bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
            <Sparkles className="h-3 w-3" />
            Best seller
          </div>
        ) : null}

        <Link href={`/products/${product.slug}`} className="block" onClick={handlePreview}>
          <div
            className={`relative overflow-hidden ${variant === "list" ? "aspect-[16/7] md:aspect-[16/6]" : "aspect-[16/10]"}`}
          >
            <Image
              src={
                product.imageUrls[0] ||
                "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=1200&q=80"
              }
              alt={product.name}
              fill
              unoptimized
              className="bg-white object-contain p-5 transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/26 to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-2">
              <div className="space-y-2">
                <span className="inline-flex rounded-full border border-white/20 bg-black/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/90 backdrop-blur-sm">
                  {product.categoryName}
                </span>
                <p className="text-lg font-bold text-white">{product.name}</p>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-white/90 transition group-hover:translate-x-1" />
            </div>
          </div>
        </Link>

        <div className={`${variant === "list" ? "p-5 md:p-6" : "p-6"} flex flex-1 flex-col`}>
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-background/72 px-4 py-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Price</p>
              <p className="mt-1 text-3xl font-extrabold">{formatCurrency(product.salePrice || product.price)}</p>
              {product.salePrice ? (
                <p className="text-sm text-muted-foreground line-through">{formatCurrency(product.price)}</p>
              ) : null}
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-3 py-1.5 text-xs text-muted-foreground">
              <Clock3 className="h-3.5 w-3.5" />
              {product.durationInDays} days
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
              isOutOfStock
                ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                : stockCount && stockCount <= 5
                ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
            }`}>
              <span className={`h-2 w-2 rounded-full ${
                isOutOfStock ? "bg-rose-500" : stockCount && stockCount <= 5 ? "bg-amber-500" : "bg-emerald-500"
              }`} />
              {isOutOfStock
                ? "Out of stock"
                : stockCount !== undefined
                ? `⚡ ${stockCount} left in stock`
                : "In stock"}
            </span>
          </div>

          <div className="mt-auto pt-5">
            <Button
              type="button"
              onClick={handleOrderNow}
              className="h-12 w-full gap-2 rounded-xl bg-emerald-600 font-bold text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700"
              disabled={isOutOfStock}
            >
              <MessageCircle className="h-5 w-5 fill-white text-emerald-600" />
              {isOutOfStock ? "Out of Stock" : "Order Now on WhatsApp"}
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
