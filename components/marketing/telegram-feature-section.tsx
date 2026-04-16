"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Layers3, Sparkles, Zap } from "lucide-react";
import type { Category, Product } from "@/types";
import { Reveal } from "@/components/marketing/reveal";
import { formatCurrency } from "@/lib/utils";

const defaultPoints = [
  "Long-form product descriptions and setup notes fit naturally here.",
  "Use this lane for automation, growth systems, scraping tools, and utility packs.",
  "Keep your strongest products here and let this category lead your storefront."
];

export function TelegramFeatureSection({
  category,
  products
}: {
  category: Category | null;
  products: Product[];
}) {
  if (!category) {
    return null;
  }

  const spotlightProducts = products.slice(0, 3);

  return (
    <section className="container py-18 md:py-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,rgba(17,24,39,0.96),rgba(30,41,59,0.94),rgba(51,65,85,0.9))] p-7 text-white shadow-[0_26px_62px_rgba(15,23,42,0.16)] md:p-8">
          <div className="absolute -left-14 top-0 h-40 w-40 rounded-full bg-emerald-300/18 blur-3xl" />
          <div className="absolute -right-12 bottom-0 h-44 w-44 rounded-full bg-amber-200/12 blur-3xl" />
          {category.imageUrl ? (
            <div className="absolute inset-y-0 right-0 hidden w-[34%] overflow-hidden lg:block">
              <Image src={category.imageUrl} alt={category.name} fill className="object-cover opacity-30" />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-slate-950/55 to-slate-950/92" />
            </div>
          ) : null}

          <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-5">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.18em]">
                <Sparkles className="h-3.5 w-3.5" />
                Homepage feature lane
              </span>

              <div>
                <h2 className="text-3xl font-black tracking-tight md:text-4xl lg:text-5xl">
                  {category.name}
                  <span className="block text-white/82">should feel like the hero category.</span>
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-8 text-white/80">
                  {category.description ||
                    "This is your flagship category for Telegram automation, sender tools, scrapers, growth systems, and deeper product pages."}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { icon: Bot, label: "Automation-first" },
                  { icon: Layers3, label: "Built for larger listings" },
                  { icon: Zap, label: "Best place for premium offers" }
                ].map((item) => (
                  <div key={item.label} className="rounded-[1.4rem] border border-white/12 bg-white/8 px-4 py-4">
                    <item.icon className="h-5 w-5 text-white" />
                    <p className="mt-3 text-sm font-semibold text-white">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/products" className="btn-primary">
                  Browse this lane <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/contact" className="btn-ghost border-white/18 bg-white/8 text-white hover:bg-white/14">
                  Ask about setup
                </Link>
              </div>
            </div>

            <div className="grid gap-3">
              {spotlightProducts.length ? (
                spotlightProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: 14 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.07 }}
                    className="rounded-[1.5rem] border border-white/12 bg-white/8 p-4 backdrop-blur-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-base font-bold text-white">{product.name}</p>
                        <p className="mt-2 text-sm leading-6 text-white/72">{product.shortDescription}</p>
                      </div>
                      <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                        {product.durationInDays}d
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <p className="text-lg font-black text-white">{formatCurrency(product.salePrice || product.price)}</p>
                      <Link href={`/products/${product.slug}`} className="text-sm font-semibold text-white/88 transition hover:text-white">
                        Open product
                      </Link>
                    </div>
                  </motion.div>
                ))
              ) : (
                defaultPoints.map((item) => (
                  <div key={item} className="rounded-[1.5rem] border border-white/12 bg-white/8 p-4 text-sm leading-7 text-white/82">
                    {item}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
