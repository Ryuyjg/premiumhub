"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Reveal } from "@/components/marketing/reveal";

const reviews = [
  {
    name: "Priya Sharma",
    handle: "@priya_s",
    avatar: "PS",
    rating: 5,
    text: "Honestly shocked at how fast the delivery was. Got my Netflix credentials literally 10 seconds after payment. This is the real deal.",
    plan: "Netflix 4K · 1 month",
    gradient: "from-violet-500 to-purple-600"
  },
  {
    name: "Rahul Mehta",
    handle: "@rahulmehta",
    avatar: "RM",
    rating: 5,
    text: "Clean UI, no nonsense. The dashboard shows my subscription status and expiry clearly. Way better than WhatsApp group sellers.",
    plan: "Disney+ · 3 months",
    gradient: "from-blue-500 to-cyan-600"
  },
  {
    name: "Ananya Reddy",
    handle: "@ananya.r",
    avatar: "AR",
    rating: 5,
    text: "Used the coupon code and got 20% off. Checkout was smooth, got a confirmation email instantly. Will definitely buy again.",
    plan: "Prime Video · 6 months",
    gradient: "from-amber-500 to-orange-600"
  },
  {
    name: "Kiran Patel",
    handle: "@kiranp",
    avatar: "KP",
    rating: 5,
    text: "I run a small reselling business and this platform handles everything. The admin panel is incredibly detailed.",
    plan: "Bundle Pack · 1 year",
    gradient: "from-emerald-500 to-teal-600"
  },
  {
    name: "Deepa Nair",
    handle: "@deepanair",
    avatar: "DN",
    rating: 5,
    text: "Payment was super secure, I can see the Razorpay badge. Credentials came with the email exactly as promised. 10/10.",
    plan: "Hotstar Premium",
    gradient: "from-pink-500 to-rose-600"
  },
  {
    name: "Sanjay Kumar",
    handle: "@sanjayk",
    avatar: "SK",
    rating: 5,
    text: "The support team responded in minutes through the dashboard. Most platforms don't even have a support system this polished.",
    plan: "ZEE5 · 3 months",
    gradient: "from-indigo-500 to-blue-600"
  }
];

export function TestimonialsSection() {
  return (
    <section className="container py-20 md:py-24">
      <Reveal>
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="glow-badge mb-5">Social proof</span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight md:text-5xl">
            Loved by{" "}
            <span className="gradient-text">thousands of customers.</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Real people, real subscriptions — see what they say about StreamVault.
          </p>
        </div>
      </Reveal>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review, index) => (
          <Reveal key={review.name} delay={index * 0.06}>
            <motion.div
              whileHover={{ y: -5, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="surface h-full rounded-[1.75rem] p-6 transition-all"
            >
              {/* Stars */}
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Review text */}
              <p className="text-sm leading-7 text-foreground/80 mb-5">
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Plan badge */}
              <span className="inline-flex items-center rounded-full border border-border/60 bg-muted/50 px-3 py-1 text-xs font-semibold text-muted-foreground mb-5">
                {review.plan}
              </span>

              {/* Author */}
              <div className="flex items-center gap-3 border-t border-border/50 pt-4">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${review.gradient} text-xs font-bold text-white`}
                >
                  {review.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.handle}</p>
                </div>
              </div>
            </motion.div>
          </Reveal>
        ))}
      </div>

      {/* Overall rating */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-12 flex flex-col items-center gap-3 text-center"
      >
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-6 w-6 fill-amber-400 text-amber-400" />
          ))}
        </div>
        <p className="text-2xl font-bold">4.9 out of 5</p>
        <p className="text-sm text-muted-foreground">Based on 1,200+ verified customer reviews</p>
      </motion.div>
    </section>
  );
}
