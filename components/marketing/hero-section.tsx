"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  LayoutDashboard,
  MessageCircleHeart,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Wallet
} from "lucide-react";
import { Reveal } from "@/components/marketing/reveal";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

export function HeroSection({ products = [] }: { products?: Product[] }) {
  const productCount = products.length;
  const categoryCount = new Set(products.map((product) => product.categoryName).filter(Boolean)).size;
  const startingPrice = productCount
    ? Math.min(...products.map((product) => product.salePrice || product.price))
    : null;

  const quickStats = [
    { label: "Live items", value: String(productCount).padStart(2, "0") },
    { label: "Categories", value: String(categoryCount).padStart(2, "0") },
    { label: "Starting price", value: startingPrice ? formatCurrency(startingPrice) : "Ready to stock" }
  ];

  const livePreview = products.slice(0, 3);

  const launchBoard = [
    {
      title: "Catalog",
      description:
        productCount > 0
          ? `${productCount} item${productCount === 1 ? "" : "s"} are already visible on the storefront.`
          : "The catalog is empty on purpose, so you can rebuild it cleanly.",
      tone: "bg-emerald-500"
    },
    {
      title: "Fulfillment",
      description: "Dashboard delivery, notes, and support handling stay available for future orders.",
      tone: "bg-primary"
    },
    {
      title: "Payments",
      description: "Gateway checkout is intentionally paused until the next crypto integration is added.",
      tone: "bg-amber-500"
    },
    {
      title: "Support",
      description: "WhatsApp and Telegram remain wired in for fast human help.",
      tone: "bg-sky-500"
    }
  ];

  const highlights = [
    {
      icon: ShoppingBag,
      label: "Manual product control",
      description: "Only the products you approve go live."
    },
    {
      icon: LayoutDashboard,
      label: "Private customer area",
      description: "Orders, credentials, and support stay organized."
    },
    {
      icon: ShieldCheck,
      label: "Trust-first structure",
      description: "Clear policies and human support over gimmicks."
    }
  ];

  return (
    <section className="page-grid relative overflow-hidden py-16 md:py-24">
      <div className="orb -left-20 -top-16 h-[420px] w-[420px] bg-primary/12" />
      <div className="orb -right-12 top-12 h-[420px] w-[420px] bg-accent/12" />

      <div className="container grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <Reveal>
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glow-badge w-fit">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
              Rebuilt for a cleaner launch
            </motion.div>

            <div className="space-y-4">
              <h1 className="max-w-3xl text-5xl font-black leading-[1.02] md:text-6xl xl:text-7xl">
                A sharper digital storefront for
                <span className="gradient-text block">curated sales.</span>
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                The store now starts from a clean slate, with stronger branding, better trust signals, and room to add
                your own catalog before the next payment gateway comes back.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/products" className="btn-primary">
                Browse catalog <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/login" className="btn-ghost">
                Open account area
              </Link>
            </div>

            <div className="grid gap-3 rounded-[1.75rem] border border-border/55 bg-white/72 p-4 shadow-[0_16px_40px_rgba(2,6,23,0.05)] backdrop-blur-xl dark:bg-white/4 sm:grid-cols-3">
              {quickStats.map((stat) => (
                <div key={stat.label} className="rounded-[1.25rem] border border-border/50 bg-background/70 px-4 py-4">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">{stat.label}</p>
                  <p className="mt-2 text-2xl font-black">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {highlights.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="rounded-[1.5rem] border border-border/55 bg-white/70 p-4 shadow-[0_12px_32px_rgba(2,6,23,0.04)] dark:bg-white/4"
                >
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <p className="font-semibold">{item.label}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[2rem] border border-border/55 bg-white/75 p-6 shadow-[0_24px_70px_rgba(2,6,23,0.09)] backdrop-blur-xl dark:bg-white/4 md:p-7"
          >
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-primary/14 to-transparent" />
            <div className="relative space-y-5">
              <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-muted/35 px-4 py-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Store readiness</p>
                  <p className="text-sm font-semibold">Fresh foundation, premium shell, manual catalog</p>
                </div>
                <span className="rounded-full bg-emerald-500/14 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  CLEAN RESET
                </span>
              </div>

              <div className="surface rounded-[1.5rem] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Launch board</p>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary">
                    OWNER VIEW
                  </span>
                </div>
                <div className="space-y-3">
                  {launchBoard.map((item) => (
                    <div key={item.title} className="rounded-2xl border border-border/50 bg-background/70 p-3.5">
                      <div className="flex items-start gap-3">
                        <span className={`mt-1 h-2.5 w-2.5 rounded-full ${item.tone}`} />
                        <div className="space-y-1">
                          <p className="text-sm font-semibold">{item.title}</p>
                          <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {livePreview.length ? (
                <div className="grid gap-3 md:grid-cols-3">
                  {livePreview.map((product) => (
                    <div key={product.id} className="rounded-2xl border border-border/50 bg-white/80 p-4 dark:bg-white/10">
                      <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{product.categoryName}</p>
                      <p className="mt-2 line-clamp-2 text-sm font-semibold">{product.name}</p>
                      <p className="mt-3 text-lg font-black text-primary">
                        {formatCurrency(product.salePrice || product.price)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-[1.75rem] border border-dashed border-border/70 bg-muted/20 p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-lg font-black">Catalog cleared and ready for your first drop</p>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          Add real products, upload final creatives, write delivery notes, and bring payment back only
                          when the catalog feels right.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs font-semibold text-muted-foreground">
                        <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-white/80 px-3 py-1 dark:bg-white/5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          Real products only
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-white/80 px-3 py-1 dark:bg-white/5">
                          <MessageCircleHeart className="h-3.5 w-3.5 text-primary" />
                          Human support ready
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-white/80 px-3 py-1 dark:bg-white/5">
                          <Wallet className="h-3.5 w-3.5 text-amber-500" />
                          Gateway can return later
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
