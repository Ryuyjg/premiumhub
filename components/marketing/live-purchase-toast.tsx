"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Star, Sparkles, Gamepad2, Laptop, Cpu } from "lucide-react";

const NAMES = ["Rahul", "Priya", "Amit", "Sneha", "Vikram", "Anjali", "Suresh", "Ishita", "Arjun", "Kavya", "Manish", "Meera"];
const CITIES = ["Mumbai", "Bangalore", "Delhi", "Jaipur", "Pune", "Chennai", "Hyderabad", "Kolkata", "Ahmedabad", "Surat"];

const PRODUCTS = [
  // OTT
  { name: "Netflix 4K Premium", icon: ShoppingBag, color: "text-rose-500" },
  { name: "Disney+ Hotstar", icon: ShoppingBag, color: "text-sky-500" },
  { name: "Prime Video (Annual)", icon: ShoppingBag, color: "text-blue-500" },
  { name: "Crunchyroll Mega Fan", icon: ShoppingBag, color: "text-orange-500" },
  { name: "Spotify Premium", icon: ShoppingBag, color: "text-emerald-500" },
  // AI
  { name: "ChatGPT Plus (GPT-4)", icon: Sparkles, color: "text-teal-500" },
  { name: "Midjourney Pro", icon: Sparkles, color: "text-cyan-600" },
  { name: "Claude 3.5 Opus", icon: Sparkles, color: "text-cyan-500" },
  // Games
  { name: "GTA V Premium Edition", icon: Gamepad2, color: "text-amber-500" },
  { name: "Minecraft Java + Bedrock", icon: Gamepad2, color: "text-green-500" },
  { name: "Elden Ring (Steam)", icon: Gamepad2, color: "text-stone-500" },
  { name: "Valorant VP (10k)", icon: Gamepad2, color: "text-rose-400" },
  // Software
  { name: "Windows 11 Pro Key", icon: Laptop, color: "text-blue-600" },
  { name: "Adobe Creative Cloud", icon: Laptop, color: "text-red-500" },
  { name: "Microsoft Office 2021", icon: Laptop, color: "text-orange-600" }
];

export function LivePurchaseToast() {
  const [purchase, setPurchase] = useState<{name: string, plan: string, time: string, icon: any, color: string} | null>(null);
  const [visible, setVisible] = useState(false);

  function generateRandomPurchase() {
    const name = NAMES[Math.floor(Math.random() * NAMES.length)];
    const city = CITIES[Math.floor(Math.random() * CITIES.length)];
    const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
    const mins = Math.floor(Math.random() * 15) + 1;
    
    return {
      name: `${name} from ${city}`,
      plan: product.name,
      time: `${mins} mins ago`,
      icon: product.icon,
      color: product.color
    };
  }

  useEffect(() => {
    const showRandomToast = () => {
      setPurchase(generateRandomPurchase());
      setVisible(true);
      
      // Hide after 6 seconds
      setTimeout(() => setVisible(false), 6000);
    };

    // Show initial toast after 5 seconds
    const initialTimeout = setTimeout(showRandomToast, 5000);

    // Set interval for subsequent toasts (every 25-40 seconds randomly)
    const interval = setInterval(() => {
        if (!visible) showRandomToast();
    }, 30000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [visible]);

  if (!purchase) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -100, scale: 0.9, filter: "blur(10px)" }}
          animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)", transition: { duration: 0.3 } }}
          className="fixed bottom-24 left-4 z-50 md:bottom-12 md:left-12"
        >
          <div className="flex items-center gap-4 rounded-[2rem] border border-white/20 bg-background/80 p-4 pr-7 shadow-2xl shadow-primary/10 backdrop-blur-3xl dark:border-white/10 dark:bg-black/80">
            <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-muted/50 ${purchase.color}`}>
              <purchase.icon className="h-7 w-7" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">Recent Fulfillment</p>
              </div>
              <p className="text-sm font-bold truncate leading-tight">{purchase.name}</p>
              <p className="text-[11px] text-muted-foreground mt-1">
                Purchased <span className={`font-bold ${purchase.color}`}>{purchase.plan}</span> · {purchase.time}
              </p>
            </div>
            <div className="ml-4 flex items-center justify-center rounded-full bg-emerald-500/10 p-2 text-emerald-500 shadow-inner">
                <Star className="h-3.5 w-3.5 fill-emerald-500" />
            </div>
          </div>
          
          {/* Progress bar for visibility duration */}
          <motion.div 
            className="absolute bottom-0 left-6 right-6 h-1 rounded-full bg-primary/20 overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: "calc(100% - 3rem)" }}
            transition={{ duration: 6, ease: "linear" }}
          >
            <div className="h-full bg-primary" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

