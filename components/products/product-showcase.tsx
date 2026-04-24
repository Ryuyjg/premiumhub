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
    title: "Clear plan details",
    text: "Each plan shows duration, pricing, and delivery details before you buy."
  },
  {
    icon: ShieldCheck,
    title: "Trusted checkout flow",
    text: "Add to cart, checkout quickly, and track your order from your account."
  },
  {
    icon: LayoutDashboard,
    title: "Support after purchase",
    text: "If you need help, support channels are available directly from the store."
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
                Top picks
              </span>
              <h2 className="text-3xl font-black tracking-tight md:text-4xl lg:text-5xl">
                {products.length ? (
                  <>
                    Popular plans selected
                    <span className="gradient-text block">for customers.</span>
                  </>
                ) : (
                  <>
                    Trusted digital plans
                    <span className="gradient-text block">in one place.</span>
                  </>
                )}
              </h2>
              <p className="max-w-2xl text-muted-foreground">
                {products.length
                  ? "Browse customer-favorite plans with clear pricing and fast add-to-cart flow."
                  : "New plans are being updated. You can still browse the full catalog right now."}
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
                  Customer-first standard
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
