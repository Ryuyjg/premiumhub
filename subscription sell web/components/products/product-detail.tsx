"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Check, ShieldCheck } from "lucide-react";
import type { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { CheckoutButton } from "@/components/products/purchase-panel";
import { Badge } from "@/components/ui/badge";

export function ProductDetail({ product }: { product: Product }) {
  const [activeImage, setActiveImage] = useState(product.imageUrls[0]);

  return (
    <div className="grid gap-10 lg:grid-cols-[1.06fr_0.94fr]">
      <div className="space-y-5">
        <div className="surface relative aspect-[16/10] overflow-hidden rounded-[2rem]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeImage}
              initial={{ opacity: 0.4, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.3, scale: 0.98 }}
              transition={{ duration: 0.34 }}
              className="absolute inset-0"
            >
              <Image src={activeImage || product.imageUrls[0]} alt={product.name} fill className="object-cover" />
            </motion.div>
          </AnimatePresence>
          <div className="pointer-events-none absolute inset-x-10 top-0 h-24 rounded-full bg-primary/25 blur-3xl" />
        </div>
        <div className="grid grid-cols-4 gap-3">
          {product.imageUrls.map((image) => (
            <motion.button
              key={image}
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveImage(image)}
              className={`relative aspect-square overflow-hidden rounded-2xl border transition ${
                activeImage === image ? "border-primary shadow-lg shadow-primary/20" : "border-border/70"
              }`}
            >
              <Image src={image} alt={product.name} fill className="object-cover" />
            </motion.button>
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <Badge>{product.categoryName}</Badge>
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">{product.name}</h1>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">{product.description}</p>
        </div>
        <motion.div whileHover={{ y: -4 }} className="surface rounded-[1.75rem] p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-4xl font-semibold">{formatCurrency(product.salePrice || product.price)}</p>
              {product.salePrice ? (
                <p className="mt-2 text-sm text-muted-foreground line-through">{formatCurrency(product.price)}</p>
              ) : null}
            </div>
            <p className="rounded-full border border-border/70 px-3 py-1 text-xs text-muted-foreground">
              {product.durationInDays} day access
            </p>
          </div>
          <div className="mt-6">
            <CheckoutButton product={product} />
          </div>
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
            <ShieldCheck className="h-4 w-4" />
            Secure backend verification with instant delivery after payment confirmation.
          </div>
        </motion.div>
        <motion.div whileHover={{ y: -4 }} className="surface rounded-[1.75rem] p-6">
          <h2 className="text-lg font-semibold">What is included</h2>
          <div className="mt-5 grid gap-3">
            {product.features.map((feature) => (
              <div key={feature} className="flex items-start gap-3">
                <span className="mt-1 rounded-full bg-primary/10 p-1 text-primary">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <p className="text-sm text-muted-foreground">{feature}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
