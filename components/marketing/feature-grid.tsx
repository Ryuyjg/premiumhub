"use client";

import {
  Gamepad2,
  BrainCircuit,
  AppWindow,
  Phone,
  ShieldCheck,
  Zap,
  HeadphonesIcon,
  CreditCard
} from "lucide-react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/marketing/reveal";

const features = [
  {
    icon: AppWindow,
    title: "Software Licenses",
    description: "Original license keys for Windows, Office, Adobe, and professional editing tools delivered instantly.",
    gradient: "from-blue-500/15 to-cyan-500/10",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
    number: "01"
  },
  {
    icon: BrainCircuit,
    title: "Premium AI Subscriptions",
    description: "Access shared or private accounts for ChatGPT Plus, Midjourney, Claude, and more AI assistants.",
    gradient: "from-primary/18 to-accent/10",
    iconBg: "bg-primary/15",
    iconColor: "text-primary",
    number: "02"
  },
  {
    icon: Gamepad2,
    title: "Gaming Accounts",
    description: "Premium access to Minecraft, Xbox Game Pass, PlayStation Plus, and other popular gaming networks.",
    gradient: "from-amber-500/15 to-orange-500/10",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
    number: "03"
  },
  {
    icon: Phone,
    title: "Virtual Numbers",
    description: "Verified active numbers for Telegram, WhatsApp, and SMS bypass, ready for immediate use.",
    gradient: "from-emerald-500/15 to-teal-500/10",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
    number: "04"
  },
  {
    icon: ShieldCheck,
    title: "Encrypted credential vault",
    description: "All purchased accounts, keys, and credentials are AES-encrypted before storage and decrypted on read.",
    gradient: "from-pink-500/15 to-rose-500/10",
    iconBg: "bg-pink-500/10",
    iconColor: "text-pink-500",
    number: "05"
  },
  {
    icon: Zap,
    title: "Instant delivery engine",
    description: "Subscriptions activate in under 15 seconds with automated credential allocation and delivery.",
    gradient: "from-cyan-500/18 to-primary/10",
    iconBg: "bg-cyan-500/10",
    iconColor: "text-cyan-600",
    number: "06"
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "Guaranteed failure recovery and secure wallet balance system for safe and reliable checkouts.",
    gradient: "from-sky-500/15 to-blue-500/10",
    iconBg: "bg-sky-500/10",
    iconColor: "text-sky-500",
    number: "07"
  },
  {
    icon: HeadphonesIcon,
    title: "Built-in support center",
    description: "Direct 24/7 access to customer support and ticket resolution tools directly from your user dashboard.",
    gradient: "from-fuchsia-500/15 to-pink-500/10",
    iconBg: "bg-fuchsia-500/10",
    iconColor: "text-fuchsia-500",
    number: "08"
  }
];

export function FeatureGrid() {
  return (
    <section className="container py-20 md:py-28">
      <Reveal>
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="glow-badge mb-5">Built for real operations</span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight md:text-5xl">
            Every layer is ready for{" "}
            <span className="gradient-text">production.</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Not just a demo — a complete, battle-tested infrastructure for selling subscriptions at scale.
          </p>
        </div>
      </Reveal>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature, index) => (
          <Reveal key={feature.title} delay={index * 0.05}>
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className={`group relative h-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br ${feature.gradient} p-6 backdrop-blur-sm transition-all dark:border-white/6`}
            >
              {/* Number watermark */}
              <span className="absolute -right-1 -top-2 text-7xl font-black text-foreground/4 select-none">
                {feature.number}
              </span>

              {/* Icon */}
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

