"use client";

import { BadgeCheck, CreditCard, DatabaseZap, LockKeyhole, MonitorSmartphone, Search } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/marketing/reveal";

const features = [
  {
    icon: CreditCard,
    title: "Live-ready Razorpay",
    description: "Backend-created orders, signature verification, failure recovery, and retry-safe persistence."
  },
  {
    icon: LockKeyhole,
    title: "Encrypted credential vault",
    description: "OTT account emails and passwords are AES-encrypted before storage and only decrypted on secure reads."
  },
  {
    icon: DatabaseZap,
    title: "Firebase-native scale",
    description: "Firestore, Auth, and Storage wired for modular growth across catalog, orders, and fulfillment."
  },
  {
    icon: Search,
    title: "Smart discovery",
    description: "Search, category filters, animated cards, and fast product navigation for higher conversion."
  },
  {
    icon: MonitorSmartphone,
    title: "Responsive by default",
    description: "Mobile-first layouts, sticky CTAs, skeleton states, and polished motion on every screen size."
  },
  {
    icon: BadgeCheck,
    title: "Admin operating system",
    description: "Analytics, coupons, product management, and OTT account allocation in one high-end workspace."
  }
];

export function FeatureGrid() {
  return (
    <section className="container py-16 md:py-24">
      <Reveal>
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Built for real operations</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
            Every layer is ready for production, not just presentation.
          </h2>
        </div>
      </Reveal>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature, index) => (
          <Reveal key={feature.title} delay={index * 0.06}>
            <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.2 }} className="surface-interactive h-full rounded-[1.75rem] p-6">
              <feature.icon className="h-10 w-10 rounded-2xl bg-primary/10 p-2 text-primary" />
              <h3 className="mt-5 text-xl font-semibold">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{feature.description}</p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
