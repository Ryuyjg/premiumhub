"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles, Zap, Star, TrendingUp, Users, MessageCircleHeart, Gamepad2, BrainCircuit, AppWindow } from "lucide-react";
import { Reveal } from "@/components/marketing/reveal";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

const stats = [
  { icon: Users, value: "8000+", label: "Active customers" },
  { icon: Star, value: "600+", label: "Resellers" },
  { icon: TrendingUp, value: "12000+", label: "Orders delivered" }
];

const proofCards = [
  { icon: ShieldCheck, label: "Safe and verified payments", color: "from-emerald-500/20 to-teal-500/10", iconColor: "text-emerald-500" },
  { icon: Zap, label: "Instant credentials after checkout", color: "from-amber-500/20 to-orange-500/10", iconColor: "text-amber-500" },
  { icon: Sparkles, label: "Best-in-class client dashboard", color: "from-primary/20 to-accent/10", iconColor: "text-primary" }
];

const brands = ["ChatGPT Plus", "Creative Cloud", "Midjourney", "Telegram", "WhatsApp", "Netflix", "Xbox", "Canva Pro"];

export function HeroSection({ products = [] }: { products?: Product[] }) {
  const [index, setIndex] = useState(0);

  const allAvailable = products.length > 0 ? products : [
    { name: "ChatGPT Plus (Shared)", salePrice: 499, price: 599, categoryName: "AI" },
    { name: "Telegram Premium Number", salePrice: 199, price: 299, categoryName: "Apps" },
    { name: "Adobe Creative Cloud", salePrice: 899, price: 1299, categoryName: "Software" },
    { name: "Minecraft Java Edition", salePrice: 399, price: 699, categoryName: "Gaming" },
    { name: "Midjourney Private", salePrice: 799, price: 999, categoryName: "AI" },
    { name: "Netflix 4K (Private Account)", salePrice: 349, price: 349, categoryName: "OTT" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % allAvailable.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [allAvailable.length]);

  const displayProducts = [
    allAvailable[index % allAvailable.length],
    allAvailable[(index + 1) % allAvailable.length],
    allAvailable[(index + 2) % allAvailable.length]
  ];

  const getIcon = (category?: string) => {
    switch (category?.toLowerCase()) {
      case "ai":
        return <BrainCircuit className="h-3.5 w-3.5 text-primary" />;
      case "gaming":
        return <Gamepad2 className="h-3.5 w-3.5 text-rose-500" />;
      case "software":
        return <AppWindow className="h-3.5 w-3.5 text-sky-500" />;
      case "apps":
        return <Sparkles className="h-3.5 w-3.5 text-amber-500" />;
      default:
        return <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />;
    }
  };

  return (
    <section className="page-grid relative overflow-hidden py-16 md:py-24">
      <div className="orb -left-20 -top-20 h-[420px] w-[420px] bg-primary/12" />
      <div className="orb -right-20 top-20 h-[420px] w-[420px] bg-accent/12" />

      <div className="container grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <Reveal>
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glow-badge w-fit">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
              Trusted by 10,000+ buyers
            </motion.div>

            <div className="space-y-4">
              <h1 className="max-w-2xl text-5xl font-black leading-[1.03] tracking-tight md:text-6xl xl:text-7xl">
                Premium subscriptions,
                <span className="gradient-text block">delivered in seconds.</span>
              </h1>
              <p className="max-w-xl text-lg leading-8 text-muted-foreground">
                Sell and buy OTT, AI, software, and virtual number plans from a storefront built for trust, speed, and repeat purchases.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/products" className="btn-primary">
                Browse plans <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/dashboard" className="btn-ghost">
                Open dashboard
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-3 rounded-[1.5rem] border border-border/50 bg-white/70 p-4 shadow-[0_14px_34px_rgba(2,6,23,0.05)] dark:bg-white/5">
              {stats.map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <p className="text-xl font-black md:text-2xl">{stat.value}</p>
                  <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {proofCards.map((item, idx) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className={`rounded-2xl border border-white/20 bg-gradient-to-br ${item.color} p-4`}
                >
                  <item.icon className={`mb-2 h-5 w-5 ${item.iconColor}`} />
                  <p className="text-sm font-semibold">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[2rem] border border-border/55 bg-white/75 p-6 shadow-[0_24px_70px_rgba(2,6,23,0.09)] backdrop-blur-xl dark:bg-white/4 md:p-7"
          >
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-primary/12 to-transparent" />
            <div className="relative space-y-5">
              <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-muted/35 px-4 py-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Fulfillment status</p>
                  <p className="text-sm font-semibold">All systems operational</p>
                </div>
                <span className="rounded-full bg-emerald-500/14 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">99.9% SLA</span>
              </div>

              <div className="surface rounded-[1.5rem] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Live purchases</p>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary">VERIFIED</span>
                </div>
                <div className="space-y-2.5">
                  <AnimatePresence mode="popLayout">
                    {displayProducts.map((order, i) => (
                      <motion.div
                        key={`${order.name}-${index + i}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center justify-between rounded-xl border border-border/45 px-3 py-2"
                      >
                        <span className="flex min-w-0 items-center gap-2 truncate text-sm font-medium">
                          {getIcon(order.categoryName)}
                          <span className="truncate">{order.name}</span>
                        </span>
                        <span className="text-sm font-bold text-primary">{formatCurrency(order.salePrice || order.price)}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-border/50 bg-white/80 p-4 dark:bg-white/10">
                  <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Average delivery</p>
                  <p className="mt-1 text-3xl font-black text-primary">&lt;15s</p>
                </div>
                <div className="rounded-2xl border border-border/50 bg-white/80 p-4 dark:bg-white/10">
                  <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Support response</p>
                  <p className="mt-1 text-3xl font-black text-accent">24/7</p>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-white/75 px-3 py-1.5 text-xs font-semibold text-muted-foreground dark:bg-white/10">
                <MessageCircleHeart className="h-3.5 w-3.5 text-emerald-500" />
                Real human support available
              </div>
            </div>
          </motion.div>
        </Reveal>
      </div>

      <div className="container mt-14">
        <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-white/60 py-3 dark:bg-white/5">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent" />
          <div className="flex animate-marquee gap-6 whitespace-nowrap px-6">
            {[...brands, ...brands].map((brand, i) => (
              <span key={i} className="text-sm font-semibold text-muted-foreground">{brand}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
