"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Grid, Home, ShoppingBag, User } from "lucide-react";
import { useAppStore } from "@/store/use-app-store";
import { useEffect, useState } from "react";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Grid, label: "Catalog", href: "/products" },
  { icon: ShoppingBag, label: "Cart", href: "/cart", showBadge: true },
  { icon: User, label: "Account", href: "/dashboard" }
];

export function MobileNav() {
  const pathname = usePathname();
  const [hydrated, setHydrated] = useState(false);
  const cartItemsCount = useAppStore((state) => state.cartItems.length);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-full max-w-[calc(100%-2.5rem)] -translate-x-1/2 md:hidden">
      <motion.nav
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
        className="flex items-center justify-between rounded-[2.5rem] border border-border/70 bg-background/86 p-2.5 shadow-[0_18px_36px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:bg-black/55"
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-1 flex-col items-center justify-center gap-1 py-1.5"
            >
              <div
                className={`relative flex h-10 w-10 items-center justify-center rounded-2xl transition-colors ${
                  isActive ? "text-white" : "text-muted-foreground"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-pill"
                    className="absolute inset-0 z-[-1] rounded-2xl border border-foreground/10 bg-foreground shadow-[0_10px_24px_rgba(15,23,42,0.16)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <item.icon className={`h-5 w-5 ${isActive ? "stroke-[2.5px]" : "stroke-[1.8px]"}`} />

                {item.showBadge && hydrated && cartItemsCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-white ring-2 ring-background">
                    {cartItemsCount}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-widest ${
                  isActive ? "text-foreground" : "text-muted-foreground opacity-70"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </motion.nav>
    </div>
  );
}
