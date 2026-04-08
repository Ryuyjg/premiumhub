"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, LayoutDashboard, ShieldCheck, Sparkles } from "lucide-react";
import type { Product } from "@/types";
import { ProductCard } from "@/components/products/product-card";
import { Reveal } from "@/components/marketing/reveal";

const resetSteps = [
  {
    icon: Sparkles,
    title: "Add the right categories",
    text: "Build a tighter catalog structure before you start listing individual items."
  },
  {
    icon: ShieldCheck,
    title: "Publish stronger product pages",
    text: "Use real images, direct copy, and delivery notes that answer obvious questions."
  },
  {
    icon: LayoutDashboard,
    title: "Keep support and delivery clean",
    text: "Use the dashboard and contact pages to make post-purchase handling feel reliable."
  }
];

export function ProductShowcase({ products }: { products: Product[] }) {
  return (
    <section className="container py-18 md:py-24">
      <Reveal>
        <div className="section-shell mb-10 p-7 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <span className="glow-badge">
                <Sparkles className="h-3 w-3" />
                Catalog spotlight
              </span>
              <h2 className="text-3xl font-black tracking-tight md:text-4xl lg:text-5xl">
                {products.length ? (
                  <>
                    Live listings ready for
                    <span className="gradient-text block">your storefront.</span>
                  </>
                ) : (
                  <>
                    The storefront is clean and
                    <span className="gradient-text block">ready to restock.</span>
                  </>
                )}
              </h2>
              <p className="max-w-2xl text-muted-foreground">
                {products.length
                  ? "Featured products appear here once you choose them for the storefront."
                  : "Use this reset to add better products, better visuals, and better delivery details instead of reviving the old starter catalog."}
              </p>
            </div>

            <Link href="/products" className="btn-ghost inline-flex shrink-0 items-center gap-2 self-start md:self-auto">
              Browse catalog
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Reveal>

      {products.length ? (
        <>
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
              View all products <ArrowUpRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </>
      ) : (
        <div className="grid gap-5 md:grid-cols-3">
          {resetSteps.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.05}>
              <div className="surface-interactive rounded-[1.75rem] p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <step.icon className="h-5 w-5" />
                </div>
                <p className="text-lg font-semibold">{step.title}</p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{step.text}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  <CheckCircle2 className="h-4 w-4" />
                  Better foundation for the next launch
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
