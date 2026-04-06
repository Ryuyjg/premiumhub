"use client";

import {
  BadgeCheck,
  CreditCard,
  DatabaseZap,
  LockKeyhole,
  MonitorSmartphone,
  Search,
  Rocket,
  HeadphonesIcon
} from "lucide-react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/marketing/reveal";

const features = [
  {
    icon: CreditCard,
    title: "Live-ready Razorpay",
    description: "Backend-created orders, signature verification, failure recovery, and retry-safe persistence.",
    gradient: "from-blue-500/15 to-cyan-500/10",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
    number: "01"
  },
  {
    icon: LockKeyhole,
    title: "Encrypted credential vault",
    description: "OTT account emails and passwords are AES-encrypted before storage and only decrypted on secure reads.",
    gradient: "from-violet-500/15 to-purple-500/10",
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-500",
    number: "02"
  },
  {
    icon: DatabaseZap,
    title: "Firebase-native scale",
    description: "Firestore, Auth, and Storage wired for modular growth across catalog, orders, and fulfillment.",
    gradient: "from-amber-500/15 to-orange-500/10",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
    number: "03"
  },
  {
    icon: Search,
    title: "Smart discovery",
    description: "Search, category filters, animated cards, and fast product navigation for higher conversion.",
    gradient: "from-emerald-500/15 to-teal-500/10",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
    number: "04"
  },
  {
    icon: MonitorSmartphone,
    title: "Responsive by default",
    description: "Mobile-first layouts, sticky CTAs, skeleton states, and polished motion on every screen size.",
    gradient: "from-pink-500/15 to-rose-500/10",
    iconBg: "bg-pink-500/10",
    iconColor: "text-pink-500",
    number: "05"
  },
  {
    icon: BadgeCheck,
    title: "Admin command center",
    description: "Analytics, coupons, product management, and OTT account allocation in one high-end workspace.",
    gradient: "from-indigo-500/15 to-blue-500/10",
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-500",
    number: "06"
  },
  {
    icon: Rocket,
    title: "Instant delivery engine",
    description: "Subscriptions activate in under 15 seconds with automated credential assignment and email delivery.",
    gradient: "from-sky-500/15 to-blue-500/10",
    iconBg: "bg-sky-500/10",
    iconColor: "text-sky-500",
    number: "07"
  },
  {
    icon: HeadphonesIcon,
    title: "Built-in support center",
    description: "Customers can raise tickets directly from their dashboard. Admins resolve from one command panel.",
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
