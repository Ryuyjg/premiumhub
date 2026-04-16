"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Star } from "lucide-react";
import { Reveal } from "@/components/marketing/reveal";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

export function HeroSection({ products = [] }: { products?: Product[] }) {
  const productCount = products.length;
  const categoryCount = new Set(products.map((product) => product.categoryName).filter(Boolean)).size;
  const pricing = products
    .map((product) => product.salePrice || product.price)
    .filter((price) => Number.isFinite(price))
    .sort((a, b) => a - b);

  const startingPrice = pricing[0] ?? null;
  const midPrice = pricing[Math.floor(pricing.length / 2)] ?? null;

  const proofItems = [
    { label: "Active plans", value: String(productCount).padStart(2, "0") },
    { label: "Categories", value: String(categoryCount).padStart(2, "0") },
    { label: "Entry point", value: startingPrice ? formatCurrency(startingPrice) : "Updating" }
  ];

  const planSignals = [
    {
      title: "Starter Access",
      subtitle: "For first-time buyers",
      price: startingPrice ? formatCurrency(startingPrice) : "Set first plan",
      badge: "Starter"
    },
    {
      title: "Growth Bundle",
      subtitle: "Most selected setup",
      price: midPrice ? formatCurrency(midPrice) : "Add pricing",
      badge: "Popular"
    },
    {
      title: "Elite Stack",
      subtitle: "High-value private offers",
      price: pricing.length ? formatCurrency(pricing[pricing.length - 1]) : "Configure",
      badge: "Premium"
    }
  ];

  return (
    <section className="page-grid relative overflow-hidden pb-16 pt-14 md:pb-24 md:pt-20">
      <div className="orb -left-28 -top-16 h-[380px] w-[380px] bg-primary/16" />
      <div className="orb -right-16 top-0 h-[340px] w-[340px] bg-accent/14" />

      <div className="container space-y-10">
        <Reveal>
          <div className="section-shell relative overflow-hidden px-6 py-10 md:px-10 md:py-14">
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/10 to-transparent" />
            <div className="relative mx-auto max-w-4xl text-center">
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="glow-badge"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Premium subscription marketplace
              </motion.span>

              <h1 className="mt-6 text-4xl font-extrabold leading-[1.03] md:text-6xl lg:text-7xl">
                Sell digital subscriptions
                <span className="gradient-text block">with trust built in.</span>
              </h1>

              <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
                High-conversion storefront design, clean checkout flow, and account-first delivery so buyers feel
                confident from landing to purchase.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link href="/products" className="btn-primary">
                  Explore plans <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/login" className="btn-ghost">
                  Open customer account
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
                <span className="control-surface inline-flex items-center gap-2 rounded-full px-4 py-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Secure account area
                </span>
                <span className="control-surface inline-flex items-center gap-2 rounded-full px-4 py-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Manual quality control
                </span>
                <span className="control-surface inline-flex items-center gap-2 rounded-full px-4 py-2">
                  <Star className="h-4 w-4 text-warning" />
                  Conversion-focused layout
                </span>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Reveal delay={0.03}>
            <div className="section-shell p-5 md:p-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Live pricing pulse</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {planSignals.map((plan, index) => (
                  <motion.article
                    key={plan.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className={`rounded-[1.4rem] border p-4 ${
                      plan.badge === "Popular"
                        ? "border-primary/35 bg-primary/10"
                        : "border-border/70 bg-background/72"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold">{plan.title}</p>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${
                          plan.badge === "Popular"
                            ? "bg-primary text-white"
                            : "border border-border/70 text-muted-foreground"
                        }`}
                      >
                        {plan.badge}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">{plan.subtitle}</p>
                    <p className="mt-4 text-2xl font-extrabold">{plan.price}</p>
                  </motion.article>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="section-shell p-5 md:p-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Storeproof</p>
              <div className="mt-4 space-y-3">
                {proofItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/72 px-4 py-3"
                  >
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="text-lg font-extrabold">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
