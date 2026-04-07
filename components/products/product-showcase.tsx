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
    <section className="container py-18 md:py-24">
      <Reveal>
        <div className="mb-10 rounded-[2rem] border border-border/55 bg-white/70 p-7 shadow-[0_20px_55px_rgba(2,6,23,0.05)] backdrop-blur-xl dark:bg-white/4 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <span className="glow-badge">
                <Sparkles className="h-3 w-3" />
                Featured inventory
              </span>
              <h2 className="text-3xl font-black tracking-tight md:text-4xl lg:text-5xl">
                Top plans curated for
                <span className="gradient-text block">high conversion.</span>
              </h2>
              <p className="max-w-xl text-muted-foreground">
                These plans have strong demand, verified stock, and proven checkout performance.
              </p>
            </div>

            <Link href="/products" className="btn-ghost inline-flex shrink-0 items-center gap-2 self-start md:self-auto">
              Browse all plans
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
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
