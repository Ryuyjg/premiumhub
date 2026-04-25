"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useState } from "react";
import { ArrowRight, CheckCircle2, Clock3, ShoppingBag, Sparkles } from "lucide-react";
import type { MouseEvent } from "react";
import { toast } from "sonner";
import type { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/use-app-store";

export function ProductCard({
  product,
  variant = "grid",
  onPreview
}: {
  product: Product;
  variant?: "grid" | "list";
  onPreview?: (product: Product) => void;
}) {
  const addToCart = useAppStore((state) => state.addToCart);
  const cartItems = useAppStore((state) => state.cartItems);
  const [isAdding, setIsAdding] = useState(false);
  const isOutOfStock = Boolean(product.isOutOfStock);
  const isAlreadyInCart = cartItems.some((item) => item.productId === product.id);

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

  async function handleAddToCart() {
    if (isOutOfStock) {
      toast.error("No stock available for this item.");
      return;
    }

    if (isAlreadyInCart) {
      toast.message("Already in cart", {
        description: "This product is already in your cart."
      });
      return;
    }

    setIsAdding(true);

    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.salePrice || product.price,
      imageUrl: product.imageUrls[0] || "",
      categoryName: product.categoryName
    });

    toast.success(`${product.name} added to cart`, {
      description: "Complete checkout when you are ready.",
      icon: <ShoppingBag className="h-4 w-4 text-primary" />,
      duration: 2600
    });
    setIsAdding(false);
  }

  function handlePreview(event: MouseEvent<HTMLAnchorElement>) {
    if (!onPreview) {
      return;
    }
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
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Plan price</p>
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

          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5 text-success" />
            Instant dashboard tracking after purchase
          </div>

          <div className="mt-auto pt-5">
            <Button type="button" onClick={handleAddToCart} className="h-12 w-full" disabled={isOutOfStock || isAdding}>
            {isOutOfStock ? "No stock" : isAdding ? "Adding..." : isAlreadyInCart ? "In cart" : "Add to cart"}
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
