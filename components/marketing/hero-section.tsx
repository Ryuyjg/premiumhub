"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles, Zap, Star, TrendingUp, Users } from "lucide-react";
import { Reveal } from "@/components/marketing/reveal";

const stats = [
  { icon: Users, value: "10,000+", label: "Happy customers" },
  { icon: TrendingUp, value: "₹50L+", label: "Revenue processed" },
  { icon: Star, value: "4.9/5", label: "Customer rating" }
];

const proofCards = [
  { icon: ShieldCheck, label: "Secure backend verification", color: "from-emerald-500/20 to-teal-500/10", iconColor: "text-emerald-500" },
  { icon: Zap, label: "Instant account delivery", color: "from-amber-500/20 to-orange-500/10", iconColor: "text-amber-500" },
  { icon: Sparkles, label: "Premium SaaS-grade UI", color: "from-violet-500/20 to-purple-500/10", iconColor: "text-violet-500" }
];

const brands = ["Netflix", "Disney+", "Prime", "Hotstar", "SonyLIV", "ZEE5", "JioCinema", "Crunchyroll"];

export function HeroSection() {
  return (
    <section className="page-grid relative overflow-hidden py-20 md:py-32">
      {/* Background orbs */}
      <div className="orb -left-32 -top-32 h-[600px] w-[600px] bg-primary/10" />
      <div className="orb -right-32 top-0 h-[500px] w-[500px] bg-accent/8" />
      <div className="orb bottom-0 left-1/2 h-[400px] w-[800px] -translate-x-1/2 bg-violet-500/5" />

      <div className="container relative grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal>
          <div className="space-y-10">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glow-badge w-fit"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
              Live-ready OTT commerce platform
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-4"
            >
              <h1 className="text-5xl font-bold tracking-tight md:text-6xl xl:text-7xl leading-[1.08]">
                Sell OTT subs like a{" "}
                <span className="gradient-text">real SaaS brand.</span>
              </h1>
              <p className="max-w-xl text-lg leading-8 text-muted-foreground">
                Automated credential delivery, secure Razorpay checkout, Firebase-backed access control,
                and a conversion-first storefront built for scale.
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col gap-4 sm:flex-row"
            >
              <Link href="/products" className="btn-primary">
                Browse plans <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/dashboard" className="btn-ghost">
                My dashboard
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-3 gap-4 border-t border-border/50 pt-8"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <p className="text-2xl font-bold gradient-text">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>

            {/* Proof cards */}
            <div className="grid gap-3 sm:grid-cols-3">
              {proofCards.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.08 * index, duration: 0.45 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className={`rounded-2xl bg-gradient-to-br ${item.color} border border-white/10 p-4 backdrop-blur-sm`}
                >
                  <item.icon className={`mb-2 h-5 w-5 ${item.iconColor}`} />
                  <p className="text-sm font-medium">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Right panel */}
        <Reveal delay={0.15}>
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-shell relative overflow-hidden p-6 md:p-8"
          >
            {/* Inner glow */}
            <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-primary/15 via-primary/5 to-transparent" />
            <div className="orb -right-12 -top-12 h-48 w-48 bg-primary/20" />

            <div className="relative space-y-5">
              {/* Revenue chart card */}
              <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }} className="surface rounded-[1.75rem] p-5">
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">Revenue pulse</p>
                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    ↑ 24.6%
                  </span>
                </div>
                <div className="flex items-end gap-2">
                  {[34, 42, 39, 67, 72, 94, 112].map((height, index) => (
                    <motion.div
                      key={height}
                      className="flex-1"
                      initial={{ opacity: 0, scaleY: 0 }}
                      whileInView={{ opacity: 1, scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.06 * index, duration: 0.5, ease: "easeOut" }}
                      style={{ originY: 1 }}
                    >
                      <motion.div
                        className="w-full rounded-t-xl bg-gradient-to-t from-primary to-accent"
                        style={{ height: `${height}px`, opacity: 0.55 + index * 0.07 }}
                        whileHover={{ scaleY: 1.04 }}
                      />
                    </motion.div>
                  ))}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">Last 7 months · All time high this month</p>
              </motion.div>

              {/* Two small stat cards */}
              <div className="grid gap-4 md:grid-cols-2">
                <motion.div whileHover={{ y: -3 }} className="surface rounded-[1.5rem] p-5">
                  <p className="text-sm text-muted-foreground">Conversion</p>
                  <p className="mt-2 text-3xl font-bold gradient-text-warm">+32%</p>
                  <p className="mt-1.5 text-xs text-muted-foreground">vs last quarter</p>
                </motion.div>
                <motion.div whileHover={{ y: -3 }} className="surface rounded-[1.5rem] p-5">
                  <p className="text-sm text-muted-foreground">Fulfillment</p>
                  <p className="mt-2 text-3xl font-bold gradient-text">&lt;15s</p>
                  <p className="mt-1.5 text-xs text-muted-foreground">Instant delivery</p>
                </motion.div>
              </div>

              {/* Live order ticker */}
              <motion.div whileHover={{ y: -2 }} className="surface rounded-[1.5rem] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Live orders</p>
                </div>
                <div className="space-y-2">
                  {[
                    { plan: "Netflix 4K", amount: "₹349", time: "2m ago" },
                    { plan: "Disney+ Bundle", amount: "₹199", time: "8m ago" },
                    { plan: "Prime + Hotstar", amount: "₹449", time: "15m ago" }
                  ].map((order, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="font-medium">{order.plan}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-primary">{order.amount}</span>
                        <span className="text-xs text-muted-foreground">{order.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </Reveal>
      </div>

      {/* Brand marquee */}
      <div className="container mt-20">
        <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
          Subscriptions we power
        </p>
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
          <div className="flex animate-marquee gap-8 whitespace-nowrap">
            {[...brands, ...brands].map((brand, i) => (
              <span
                key={i}
                className="inline-flex items-center rounded-full border border-border/60 bg-white/60 px-5 py-2 text-sm font-semibold text-muted-foreground backdrop-blur-sm dark:bg-white/4"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
