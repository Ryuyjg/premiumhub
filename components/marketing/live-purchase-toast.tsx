"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Star } from "lucide-react";

const mockPurchases = [
  { name: "Rahul from Mumbai", plan: "Netflix 4K", time: "2 mins ago" },
  { name: "Sneha from Bangalore", plan: "Disney+ Premium", time: "5 mins ago" },
  { name: "Amit from Delhi", plan: "Prime Video", time: "1 min ago" },
  { name: "Priya from Hyderabad", plan: "SonyLIV", time: "8 mins ago" },
  { name: "Vikram from Chennai", plan: "Crunchyroll", time: "3 mins ago" },
];

export function LivePurchaseToast() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showInterval = setInterval(() => {
      setIndex((prev) => (prev + 1) % mockPurchases.length);
      setVisible(true);
      
      // Hide after 5 seconds
      setTimeout(() => setVisible(false), 5000);
    }, 25000); // Show every 25 seconds

    // Initial show
    const initialTimeout = setTimeout(() => setVisible(true), 10000);
    const initialHide = setTimeout(() => setVisible(false), 15000);

    return () => {
      clearInterval(showInterval);
      clearTimeout(initialTimeout);
      clearTimeout(initialHide);
    };
  }, []);

  const purchase = mockPurchases[index];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -100, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          className="fixed bottom-24 left-4 z-50 md:bottom-8 md:left-8"
        >
          <div className="flex items-center gap-4 rounded-3xl border border-white/20 bg-background/80 p-4 pr-6 shadow-2xl shadow-primary/10 backdrop-blur-2xl dark:border-white/10 dark:bg-black/80">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Recent Purchase</p>
              <p className="text-sm font-bold truncate">{purchase.name}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Bought <span className="font-bold text-primary">{purchase.plan}</span> · {purchase.time}
              </p>
            </div>
            <div className="ml-2 flex items-center justify-center rounded-full bg-emerald-500/10 p-1.5 text-emerald-500">
                <Star className="h-3 w-3 fill-emerald-500" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
