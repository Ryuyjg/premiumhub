"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import type { Product } from "@/types";
import { ProductCard } from "@/components/products/product-card";
import { Reveal } from "@/components/marketing/reveal";

export function ProductShowcase({ products }: { products: Product[] }) {
  if (!products.length) return null;

  return (
    <section className="container py-16 md:py-24">
      <Reveal>
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <span className="glow-badge">
              <Sparkles className="h-3 w-3" />
              Featured inventory
            </span>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              Top plans, ready to{" "}
              <span className="gradient-text">sell instantly.</span>
            </h2>
            <p className="max-w-xl text-muted-foreground">
              Handpicked subscriptions with verified stock, instant delivery, and secure checkout.
            </p>
          </div>
          <Link
            href="/products"
            className="btn-ghost inline-flex shrink-0 items-center gap-2 self-start md:self-auto"
          >
            Browse all plans
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </Reveal>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: index * 0.07, duration: 0.45 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mt-10 text-center"
      >
        <Link href="/products" className="btn-primary inline-flex">
          View all plans <ArrowUpRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </section>
  );
}
