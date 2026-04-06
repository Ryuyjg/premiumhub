"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CtaBanner() {
  return (
    <section className="container pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="section-shell relative overflow-hidden px-6 py-10 md:px-10 md:py-14"
      >
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-primary/20 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Launch faster</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              From storefront to fulfillment, the full stack is already structured for scale.
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90"
          >
            Start selling <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
