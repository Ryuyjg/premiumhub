"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const perks = [
  "Instant delivery after payment",
  "USDT-ready purchase flow",
  "24/7 customer support",
  "AES-encrypted account vault"
];

export function CtaBanner() {
  return (
    <section className="container pb-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-accent to-[hsl(var(--gradient-mid))] p-[1px]"
      >
        <div className="relative overflow-hidden rounded-[calc(2.5rem-1px)] bg-gradient-to-br from-primary/90 via-accent to-[hsl(var(--gradient-mid))] px-8 py-14 md:px-14 md:py-16">
          {/* Background decorations */}
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/8 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "40px 40px"
            }}
          />

          <div className="relative flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                Start today
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl xl:text-5xl">
                From storefront to fulfillment — fully structured for scale.
              </h2>
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-2 text-sm text-white/85">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-white" />
                    {perk}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row md:flex-col">
              <Link
                href="/products"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-bold text-primary shadow-xl transition-all hover:-translate-y-0.5 hover:shadow-2xl"
              >
                Browse plans <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                Go to dashboard
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}


