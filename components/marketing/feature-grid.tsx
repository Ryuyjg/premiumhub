"use client";

import { motion } from "framer-motion";
import {
  CreditCard,
  HeadphonesIcon,
  LayoutDashboard,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Zap
} from "lucide-react";
import { Reveal } from "@/components/marketing/reveal";

const features = [
  {
    icon: ShoppingBag,
    title: "Curated catalog",
    description: "Browse clean categories with clear digital products, prices, and delivery expectations.",
    gradient: "from-primary/14 to-primary/5",
    iconBg: "bg-primary/12",
    iconColor: "text-primary",
    number: "01"
  },
  {
    icon: Sparkles,
    title: "Flexible digital product mix",
    description: "Find subscriptions, software, games, virtual number services, and Telegram support products.",
    gradient: "from-primary/16 to-primary/6",
    iconBg: "bg-primary/12",
    iconColor: "text-primary",
    number: "02"
  },
  {
    icon: Search,
    title: "Fast browse and filter flow",
    description: "Search, filters, and premium cards help buyers find the right plan in seconds.",
    gradient: "from-foreground/8 to-primary/5",
    iconBg: "bg-foreground/8",
    iconColor: "text-foreground",
    number: "03"
  },
  {
    icon: LayoutDashboard,
    title: "Private customer workspace",
    description: "Orders, delivery notes, credentials, and renewals stay organized in one account area.",
    gradient: "from-foreground/8 to-primary/7",
    iconBg: "bg-foreground/8",
    iconColor: "text-foreground",
    number: "04"
  },
  {
    icon: ShieldCheck,
    title: "Security-first structure",
    description: "Protected sessions and clear policy pages increase trust from the first visit.",
    gradient: "from-success/14 to-success/5",
    iconBg: "bg-success/12",
    iconColor: "text-success",
    number: "05"
  },
  {
    icon: HeadphonesIcon,
    title: "Human support channels",
    description: "Direct support channels stay visible before and after purchase to reduce hesitation.",
    gradient: "from-success/14 to-primary/6",
    iconBg: "bg-success/12",
    iconColor: "text-success",
    number: "06"
  },
  {
    icon: CreditCard,
    title: "Tracked checkout",
    description: "Orders stay connected to your account so delivery details and support are easy to find.",
    gradient: "from-foreground/8 to-foreground/3",
    iconBg: "bg-foreground/8",
    iconColor: "text-foreground",
    number: "07"
  },
  {
    icon: Zap,
    title: "Launch-ready presentation",
    description: "Clean visuals, hierarchy, and copy turn your store into a premium SaaS-grade buying experience.",
    gradient: "from-primary/16 to-foreground/5",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    number: "08"
  }
];

export function FeatureGrid() {
  return (
    <section className="container py-20 md:py-28">
      <Reveal>
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="glow-badge mb-5">Built for high-conversion growth</span>
          <h2 className="mt-5 text-3xl font-black tracking-tight md:text-5xl">
            Crafted storefront UX with
            <span className="gradient-text block">enterprise-level polish.</span>
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Design, trust cues, and buyer flow are tuned to improve conversion while keeping your existing backend intact.
          </p>
        </div>
      </Reveal>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature, index) => (
          <Reveal key={feature.title} delay={index * 0.05}>
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className={`group relative h-full overflow-hidden rounded-[1.75rem] border border-border/70 bg-gradient-to-br ${feature.gradient} p-6 shadow-[0_14px_34px_rgba(15,23,42,0.04)] backdrop-blur-sm dark:border-white/6`}
            >
              <span className="absolute -right-1 -top-2 select-none text-7xl font-black text-foreground/4">
                {feature.number}
              </span>

              <div className={`relative mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl ${feature.iconBg}`}>
                <feature.icon className={`h-5 w-5 ${feature.iconColor}`} />
              </div>

              <h3 className="text-base font-semibold">{feature.title}</h3>
              <p className="mt-2.5 text-sm leading-6 text-muted-foreground">{feature.description}</p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
