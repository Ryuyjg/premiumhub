"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/marketing/reveal";

const proofCards = [
  { icon: ShieldCheck, label: "Secure backend verification" },
  { icon: Zap, label: "Instant account delivery" },
  { icon: Sparkles, label: "Premium conversion-focused UI" }
];

export function HeroSection() {
  return (
    <section className="page-grid relative overflow-hidden py-20 md:py-28">
      <div className="absolute left-1/2 top-0 -z-10 h-72 w-[65rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-sky-400/30 via-blue-500/20 to-cyan-400/30 blur-3xl" />
      <div className="container grid items-center gap-12 lg:grid-cols-[1.06fr_0.94fr]">
        <Reveal>
          <div className="space-y-8">
            <Badge>Live-ready OTT commerce stack</Badge>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight md:text-7xl">
                Sell premium OTT subscriptions with the polish of a real SaaS brand.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                Automated credential delivery, secure Razorpay checkout, Firebase-backed access control, and a
                conversion-first storefront designed to feel premium.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/products"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition hover:bg-primary/90"
              >
                Explore plans <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/admin"
                className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-white/70 px-6 text-sm font-semibold transition hover:border-primary/30 hover:bg-white dark:bg-white/5"
              >
                View platform admin
              </Link>
            </div>
            <div className="grid gap-4 pt-2 sm:grid-cols-3">
              {proofCards.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.08 * index, duration: 0.45 }}
                  whileHover={{ y: -6 }}
                  className="surface-interactive rounded-2xl p-4"
                >
                  <item.icon className="mb-3 h-5 w-5 text-primary" />
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="section-shell relative overflow-hidden p-6 md:p-8"
          >
            <div className="absolute inset-x-12 top-0 h-36 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative grid gap-5">
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="surface rounded-[1.75rem] p-6"
              >
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Revenue pulse</p>
                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                    +24.6%
                  </span>
                </div>
                <div className="flex items-end gap-3">
                  {[34, 42, 39, 67, 72, 94, 112].map((height, index) => (
                    <motion.div
                      key={height}
                      className="flex-1"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.05 * index, duration: 0.4 }}
                    >
                      <motion.div
                        className="rounded-t-2xl bg-gradient-to-t from-primary to-accent"
                        style={{ height: `${height}px`, opacity: 0.58 + index * 0.05 }}
                        whileHover={{ scaleY: 1.05 }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              <div className="grid gap-5 md:grid-cols-2">
                <motion.div whileHover={{ y: -4 }} className="surface rounded-[1.5rem] p-5">
                  <p className="text-sm text-muted-foreground">Conversion uplift</p>
                  <p className="mt-3 text-3xl font-semibold">+32%</p>
                  <p className="mt-2 text-sm text-success">Higher checkout completion with secure delivery.</p>
                </motion.div>
                <motion.div whileHover={{ y: -4 }} className="surface rounded-[1.5rem] p-5">
                  <p className="text-sm text-muted-foreground">Fulfillment latency</p>
                  <p className="mt-3 text-3xl font-semibold">&lt; 15 sec</p>
                  <p className="mt-2 text-sm text-muted-foreground">Automatic account assignment after verification.</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
