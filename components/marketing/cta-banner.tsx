"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const checklist = [
  "Prioritize best-selling plans on top",
  "Use clear plan inclusions and durations",
  "Keep support and legal pages one click away",
  "Launch paid traffic only after trust stack is complete"
];

export function CtaBanner() {
  return (
    <section className="container pb-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-foreground via-[hsl(var(--gradient-start))] to-accent p-[1px]"
      >
        <div className="relative overflow-hidden rounded-[calc(2.5rem-1px)] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_35%),linear-gradient(135deg,rgba(15,23,42,0.98),rgba(30,41,59,0.96))] px-8 py-14 md:px-14 md:py-16">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/18 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-accent/18 blur-3xl" />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "40px 40px"
            }}
          />

          <div className="relative flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                Conversion launch checklist
              </span>
              <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl xl:text-5xl">
                Turn design quality into
                <span className="block">consistent sales confidence.</span>
              </h2>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {checklist.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-white/82">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-white" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row md:flex-col">
              <Link
                href="/products"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-bold text-foreground shadow-xl transition-all hover:-translate-y-0.5 hover:shadow-2xl"
              >
                Browse premium plans <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/6 px-7 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/12"
              >
                Open support links
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
