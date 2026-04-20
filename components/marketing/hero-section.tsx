"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/marketing/reveal";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

export function HeroSection({ products = [] }: { products?: Product[] }) {
  const pricing = products
    .map((product) => product.salePrice || product.price)
    .filter((price) => Number.isFinite(price))
    .sort((a, b) => a - b);

  const startingPrice = pricing[0] ?? null;

  return (
    <section className="relative overflow-hidden pb-12 pt-12 md:pb-16 md:pt-16">
      <div className="container">
        <Reveal>
          <div className="section-shell mx-auto max-w-4xl px-6 py-10 text-center md:px-10 md:py-12">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Trusted subscription store
            </motion.span>

            <h1 className="mt-6 text-3xl font-extrabold leading-tight md:text-5xl">
              Buy digital subscriptions
              <span className="gradient-text block">fast and safely</span>
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
              Clear pricing, verified plans, and direct support.
              {startingPrice ? ` Plans start from ${formatCurrency(startingPrice)}.` : ""}
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link href="/products" className="btn-primary">
                Browse plans <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/support-channels" className="btn-ghost">
                Need support?
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
