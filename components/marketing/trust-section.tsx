"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BadgeCheck, HeadphonesIcon, ShieldCheck, Wallet } from "lucide-react";
import { Reveal } from "@/components/marketing/reveal";

const trustCards = [
  {
    icon: ShieldCheck,
    title: "Clear policies",
    description: "Refund, privacy, FAQ, and terms pages are now visible so customers can verify how the store operates.",
    href: "/refund-policy",
    cta: "Read policies"
  },
  {
    icon: HeadphonesIcon,
    title: "Direct support",
    description: "Customers can find WhatsApp, Telegram, and dashboard support without hunting through the site.",
    href: "/contact",
    cta: "Open contact"
  },
  {
    icon: BadgeCheck,
    title: "Tracked delivery",
    description: "Orders, renewals, and support history stay tied to the customer account instead of disappearing in chat.",
    href: "/login",
    cta: "View account flow"
  },
  {
    icon: Wallet,
    title: "Safer rollout",
    description: "Checkout is intentionally paused until the next gateway is ready, which is better than forcing a weak payment flow live.",
    href: "/faq",
    cta: "See how it works"
  }
];

export function TrustSection() {
  return (
    <section className="container py-18 md:py-24">
      <Reveal>
        <div className="mb-10 rounded-[2rem] border border-border/55 bg-white/72 p-7 shadow-[0_20px_55px_rgba(2,6,23,0.05)] backdrop-blur-xl dark:bg-white/4 md:p-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Trust layer</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
            A buyer should be able to trust the store
            <span className="gradient-text block">before paying.</span>
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground">
            Strong support visibility, cleaner policies, and organized account delivery matter more than flashy claims.
            This section makes those signals obvious from the home page.
          </p>
        </div>
      </Reveal>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {trustCards.map((card, index) => (
          <Reveal key={card.title} delay={index * 0.05}>
            <motion.div whileHover={{ y: -5 }} className="surface-interactive rounded-[1.75rem] p-6">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <card.icon className="h-5 w-5" />
              </div>
              <p className="text-lg font-semibold">{card.title}</p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{card.description}</p>
              <Link href={card.href} className="mt-5 inline-flex text-sm font-semibold text-primary">
                {card.cta}
              </Link>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
