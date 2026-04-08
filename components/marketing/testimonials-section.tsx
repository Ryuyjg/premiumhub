"use client";

import { motion } from "framer-motion";
import { CheckCircle2, HeadphonesIcon, LayoutDashboard, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import { Reveal } from "@/components/marketing/reveal";

const standards = [
  {
    icon: ShieldCheck,
    title: "No fake urgency",
    text: "The rebuild removes fake purchase popups and weak social proof so the store feels cleaner and more believable."
  },
  {
    icon: Sparkles,
    title: "Real catalog-first approach",
    text: "You now start from an empty catalog, which is better than trying to repair trust after filling the store with random starter items."
  },
  {
    icon: LayoutDashboard,
    title: "Order records stay organized",
    text: "When products come back, customers already have a polished account area for delivery details, renewals, and support."
  },
  {
    icon: HeadphonesIcon,
    title: "Visible human support",
    text: "Support links are kept easy to find, which matters more than flashy claims when buyers are deciding whether to trust you."
  },
  {
    icon: Wallet,
    title: "Payments can return later",
    text: "The storefront no longer depends on a gateway being active to look complete, which gives you time to integrate the next one properly."
  },
  {
    icon: CheckCircle2,
    title: "Cleaner launch standards",
    text: "Policies, contact pages, and empty states help the website feel intentional instead of unfinished."
  }
];

const principles = [
  "Publish fewer items, but make each one stronger",
  "Use real images and clear delivery notes",
  "Let support and policy pages do trust work for you"
];

export function TestimonialsSection() {
  return (
    <section className="container py-20 md:py-24">
      <Reveal>
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="glow-badge mb-5">Store standards</span>
          <h2 className="mt-5 text-3xl font-black tracking-tight md:text-5xl">
            The site now feels more
            <span className="gradient-text block">premium and intentional.</span>
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Instead of pretending the store is already huge, this version leans into what actually builds trust:
            control, clarity, support, and clean presentation.
          </p>
        </div>
      </Reveal>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {standards.map((item, index) => (
          <Reveal key={item.title} delay={index * 0.06}>
            <motion.div
              whileHover={{ y: -5, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="surface h-full rounded-[1.75rem] p-6"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.text}</p>
            </motion.div>
          </Reveal>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-12 rounded-[2rem] border border-border/55 bg-white/72 p-6 text-center shadow-[0_18px_48px_rgba(2,6,23,0.05)] backdrop-blur-xl dark:bg-white/4"
      >
        <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Keep these rules</p>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {principles.map((rule) => (
            <div key={rule} className="rounded-[1.25rem] border border-border/55 bg-background/70 px-4 py-4 text-sm font-medium">
              {rule}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
