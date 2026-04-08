"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState } from "react";
import { ArrowRight, Clock3, ShoppingBag, Sparkles } from "lucide-react";
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
  const [isAdding, setIsAdding] = useState(false);
  const isOutOfStock = Boolean(product.isOutOfStock);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 180, damping: 16 });
  const springY = useSpring(rotateY, { stiffness: 180, damping: 16 });
  const shadow = useTransform(
    springY,
    [-8, 8],
    ["0 18px 38px rgba(15, 23, 42, 0.08)", "0 22px 46px rgba(15, 23, 42, 0.16)"]
  );

  function onMove(event: MouseEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const xPct = (x / rect.width - 0.5) * 2;
    const yPct = (y / rect.height - 0.5) * 2;

    rotateX.set(-yPct * 6);
    rotateY.set(xPct * 6);
  }

  function resetTilt() {
    rotateX.set(0);
    rotateY.set(0);
  }

  async function handleAddToCart() {
    if (isOutOfStock) {
      toast.error("No stock available for this item.");
      return;
    }

    setIsAdding(true);
    await new Promise((r) => setTimeout(r, 400));

    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.salePrice || product.price,
      imageUrl: product.imageUrls[0] || "",
      categoryName: product.categoryName
    });

    toast.success(`${product.name} ready in your bag!`, {
      description: "Review and checkout when you're ready.",
      icon: <ShoppingBag className="h-4 w-4 text-primary" />,
      duration: 3000
    });
    setIsAdding(false);
  }

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={resetTilt}
      style={{ rotateX: springX, rotateY: springY, boxShadow: shadow, transformStyle: "preserve-3d" }}
      className="relative"
    >
      <div className={`group overflow-hidden rounded-[1.75rem] border border-border/80 bg-[hsl(var(--surface)/0.92)] shadow-[0_16px_36px_rgba(15,23,42,0.06)] backdrop-blur-md transition-all hover:-translate-y-1 dark:bg-[hsl(var(--surface)/0.95)] ${variant === "list" ? "md:rounded-[1.35rem]" : ""}`}>
        <Link href={`/products/${product.slug}`} className="block">
          <div className={`relative overflow-hidden ${variant === "list" ? "aspect-[16/8] md:aspect-[16/6]" : "aspect-[16/10]"}`}>
            <Image
              src={product.imageUrls[0] || "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=1200&q=80"}
              alt={product.name}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />
            <div className="absolute left-4 top-4">
              <Badge>{isOutOfStock ? "No stock" : product.categoryName}</Badge>
            </div>
            {product.bestSelling ? (
              <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-white/15 bg-[hsl(var(--gradient-start)/0.92)] px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-black/20 backdrop-blur-md">
                <Sparkles className="h-3 w-3" />
                Best seller
              </div>
            ) : null}
          </div>

          <div className={`space-y-4 ${variant === "list" ? "p-5 md:p-6" : "p-6"}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <h3 className={`${variant === "list" ? "text-lg md:text-xl" : "text-xl"} font-black tracking-tight`}>{product.name}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{product.shortDescription}</p>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-primary transition group-hover:translate-x-1" />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/74 px-3 py-2.5">
              <div>
                <p className="text-2xl font-black">{formatCurrency(product.salePrice || product.price)}</p>
                {product.salePrice ? (
                  <p className="text-sm text-muted-foreground line-through">{formatCurrency(product.price)}</p>
                ) : null}
              </div>
              <div className="control-surface flex items-center gap-2 rounded-full px-3 py-1 text-xs text-muted-foreground">
                <Clock3 className="h-3.5 w-3.5" />
                {product.durationInDays} days
              </div>
            </div>
          </div>
        </Link>

        <div className="px-6 pb-6">
          <Button type="button" onClick={handleAddToCart} className="w-full" disabled={isOutOfStock || isAdding}>
            {isOutOfStock ? "No stock" : isAdding ? "Adding..." : "Add to cart"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
