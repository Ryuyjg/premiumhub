"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Star } from "lucide-react";
import { Reveal } from "@/components/marketing/reveal";

const reviews = [
  {
    name: "Akash R.",
    role: "Telegram automation buyer",
    quote:
      "Checkout felt clean and fast. Delivery details inside dashboard made the purchase feel reliable, not risky.",
    rating: 5
  },
  {
    name: "Nisha S.",
    role: "OTT reseller",
    quote:
      "The plans are clearly presented. I could compare quickly and complete my order without confusion.",
    rating: 5
  },
  {
    name: "Rahul M.",
    role: "Software plan customer",
    quote:
      "Support links are visible and response was fast. That trust layer is why I made the second purchase too.",
    rating: 5
  }
];

const trustStats = [
  { label: "Checkout clarity", value: "99%" },
  { label: "Returning buyers", value: "84%" },
  { label: "Support response", value: "<15m" }
];

export function TestimonialsSection() {
  return (
    <section className="container py-20 md:py-24">
      <Reveal>
        <div className="mx-auto max-w-3xl text-center">
          <span className="glow-badge">
            <ShieldCheck className="h-3.5 w-3.5" />
            Trusted buying experience
          </span>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight md:text-5xl">
            Buyers stay because the
            <span className="gradient-text block">experience feels premium.</span>
          </h2>
          <p className="mt-4 text-base leading-8 text-muted-foreground md:text-lg">
            Real trust is clear pricing, visible support, and smooth fulfillment. This section turns that into proof.
          </p>
        </div>
      </Reveal>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {trustStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            className="surface rounded-[1.4rem] p-5 text-center"
          >
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-muted-foreground">{stat.label}</p>
            <p className="mt-3 text-3xl font-extrabold">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {reviews.map((review, index) => (
          <Reveal key={review.name} delay={index * 0.05}>
            <motion.article
              whileHover={{ y: -5 }}
              className={`h-full rounded-[1.75rem] border p-6 ${
                index === 1
                  ? "border-primary/30 bg-primary/10"
                  : "border-border/70 bg-[hsl(var(--surface)/0.92)]"
              }`}
            >
              <div className="flex items-center gap-1 text-warning">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={`${review.name}-${i}`} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-7 text-foreground/90">“{review.quote}”</p>
              <div className="mt-5 border-t border-border/60 pt-4">
                <p className="font-semibold">{review.name}</p>
                <p className="text-xs text-muted-foreground">{review.role}</p>
              </div>
            </motion.article>
          </Reveal>
        ))}
      </div>

      <div className="mt-6 rounded-[1.75rem] border border-border/70 bg-background/72 p-5">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
          <CheckCircle2 className="h-4 w-4 text-success" />
          Trust stack active
        </p>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          Clear legal pages, account-based delivery, and visible support channels work together to increase conversion.
        </p>
      </div>
    </section>
  );
}
