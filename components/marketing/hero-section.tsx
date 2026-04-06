"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles, Zap, Star, TrendingUp, Users, MessageCircleHeart } from "lucide-react";
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

      {/* Floating Elements */}
      <motion.div 
        className="absolute left-10 top-20 hidden md:flex items-center gap-2 surface px-4 py-2 text-sm font-semibold shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        style={{ animation: "float 6s ease-in-out infinite" }}
      >
        <Star className="h-5 w-5 fill-amber-400 text-amber-500" />
        <span>4.9/5 Average Rating</span>
      </motion.div>

      <motion.div 
        className="absolute right-10 bottom-40 hidden md:flex items-center gap-3 surface rounded-full pr-6 pl-2 py-2 text-sm font-semibold shadow-xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        style={{ animation: "float 8s ease-in-out infinite reverse" }}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20">
          <MessageCircleHeart className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <span>24/7 Premium Support</span>
      </motion.div>

      <motion.div 
        className="absolute left-1/4 top-10 hidden lg:flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 shadow-lg backdrop-blur-md"
        initial={{ opacity: 0, rotate: -20 }}
        animate={{ opacity: 1, rotate: 10 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        style={{ animation: "float 5s ease-in-out infinite 1s" }}
      >
        <Star className="h-6 w-6 fill-amber-400 text-amber-500 drop-shadow-md" />
      </motion.div>

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
              className="space-y-4 relative"
            >
              <h1 className="text-5xl font-bold tracking-tight md:text-6xl xl:text-7xl leading-[1.08]">
                Sell OTT subs like a{" "}
                <span className="gradient-text relative inline-block">
                  real SaaS brand.
                  <motion.span 
                    className="absolute -right-12 -top-10"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1, rotate: [0, 15, -5, 0] }}
                    transition={{ delay: 1, duration: 0.8 }}
                  >
                    ✨
                  </motion.span>
                </span>
              </h1>
              <p className="max-w-xl text-lg leading-8 text-muted-foreground">
                Automated credential delivery, secure Razorpay checkout, highly-trusted access control,
                and a conversion-first storefront built for scale.
              </p>
            </motion.div>

            {/* CTAs and Trusted By */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/products" className="btn-primary">
                  Browse plans <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/dashboard" className="btn-ghost">
                  My dashboard
                </Link>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[
                    "https://i.pravatar.cc/100?img=1",
                    "https://i.pravatar.cc/100?img=2",
                    "https://i.pravatar.cc/100?img=3",
                    "https://i.pravatar.cc/100?img=4",
                    "https://i.pravatar.cc/100?img=5",
                  ].map((url, i) => (
                    <img 
                      key={i} 
                      src={url} 
                      alt="User avatar" 
                      className="h-10 w-10 rounded-full border-2 border-background shadow-sm"
                    />
                  ))}
                </div>
                <div className="flex flex-col">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                    ))}
                  </div>
                  <p className="text-xs font-medium text-muted-foreground mt-0.5">
                    Trusted by <span className="font-bold text-foreground">10,000+</span> users
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-3 gap-4 border-t border-border/50 pt-8 relative"
            >
              <motion.div 
                className="absolute -right-6 top-4 hidden lg:flex surface rounded-xl p-3 shadow-lg"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
                style={{ animation: "float 7s ease-in-out infinite 2s" }}
              >
                <div className="flex items-center gap-3">
                  <img src="https://i.pravatar.cc/100?img=9" className="h-8 w-8 rounded-full" />
                  <div>
                    <div className="flex gap-0.5">
                      <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-500" />
                      <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-500" />
                      <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-500" />
                      <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-500" />
                      <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-500" />
                    </div>
                    <p className="text-[10px] font-medium leading-tight">"Instant delivery!"</p>
                  </div>
                </div>
              </motion.div>

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
                  className={`rounded-2xl bg-gradient-to-br ${item.color} border border-white/10 p-4 backdrop-blur-sm relative overflow-hidden`}
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
              <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }} className="surface rounded-[1.75rem] p-5 relative overflow-visible">
                <motion.div 
                  className="absolute -right-4 -top-4 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20 p-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, type: "spring" }}
                >
                  <ShieldCheck className="h-5 w-5 text-white" />
                </motion.div>

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
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Live orders</p>
                  </div>
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">VERIFIED</span>
                </div>
                <div className="space-y-2">
                  {[
                    { plan: "Netflix 4K", amount: "₹349", time: "2m ago" },
                    { plan: "Disney+ Bundle", amount: "₹199", time: "8m ago" },
                    { plan: "Prime + Hotstar", amount: "₹449", time: "15m ago" }
                  ].map((order, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="font-medium flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                        {order.plan}
                      </span>
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
          Trusted globally · Secure checkout · 24/7 Support
        </p>
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
          <div className="flex animate-marquee gap-8 whitespace-nowrap">
            {[...brands, ...brands].map((brand, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-white/60 px-5 py-2 text-sm font-semibold text-muted-foreground backdrop-blur-sm dark:bg-white/4"
              >
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
