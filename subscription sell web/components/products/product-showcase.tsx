"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/types";
import { ProductCard } from "@/components/products/product-card";

export function ProductShowcase({ products }: { products: Product[] }) {
  return (
    <section className="container py-12 md:py-20">
      <div className="mb-10 flex items-end justify-between gap-4">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Featured inventory</p>
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Ready-to-sell plans with premium presentation.</h2>
        </div>
        <Link href="/products" className="hidden text-sm font-semibold text-primary md:inline-flex">
          Browse all plans <ArrowUpRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
