"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Zap, Tag } from "lucide-react";
import { useAppStore } from "@/store/use-app-store";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const cartItems = useAppStore((state) => state.cartItems);
  const removeFromCart = useAppStore((state) => state.removeFromCart);
  const clearCart = useAppStore((state) => state.clearCart);

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="container py-16">
      {/* Header */}
      <div className="mb-10 space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">Your cart</p>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {cartItems.length > 0 ? (
            <>Review your <span className="gradient-text">selected plans</span></>
          ) : (
            "Your cart is empty"
          )}
        </h1>
        {cartItems.length > 0 && (
          <p className="text-muted-foreground">{cartItems.length} plan{cartItems.length > 1 ? "s" : ""} selected</p>
        )}
      </div>

      {cartItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="surface flex flex-col items-center gap-5 rounded-[2rem] py-20 text-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-muted/60">
            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-lg font-semibold">Nothing here yet</p>
            <p className="text-sm text-muted-foreground">Browse our plans and add something to your cart.</p>
          </div>
          <Link href="/products" className="btn-primary">
            Browse plans <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
          {/* Cart items */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {cartItems.map((item, i) => (
                <motion.div
                  key={item.productId}
                  layout
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16, scale: 0.97 }}
                  transition={{ delay: i * 0.04 }}
                  className="surface flex items-center gap-4 rounded-[1.75rem] p-4 transition-all hover:shadow-md"
                >
                  {/* Image */}
                  <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl bg-muted">
                    <Image
                      src={item.imageUrl || "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=600&q=80"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{item.name}</p>
                        <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/40 px-2 py-0.5 text-xs text-muted-foreground mt-1">
                          <Tag className="h-3 w-3" />
                          {item.categoryName}
                        </span>
                      </div>
                      <p className="shrink-0 text-lg font-bold text-primary">{formatCurrency(item.price)}</p>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <Link
                        href={`/products/${item.slug}`}
                        className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/10"
                      >
                        Checkout this plan →
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId)}
                        className="rounded-full border border-rose-500/25 bg-rose-500/5 p-1.5 text-rose-500 transition hover:bg-rose-500/15"
                        aria-label="Remove"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <button
              type="button"
              onClick={clearCart}
              className="mt-2 text-sm text-muted-foreground hover:text-rose-500 transition-colors"
            >
              Clear all items
            </button>
          </div>

          {/* Summary panel */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="surface sticky top-24 rounded-[1.75rem] p-6"
            >
              <h2 className="text-lg font-bold mb-5">Order summary</h2>

              <div className="space-y-3 border-b border-border/50 pb-4 mb-4">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between text-sm">
                    <span className="truncate text-muted-foreground max-w-[160px]">{item.name}</span>
                    <span className="font-semibold">{formatCurrency(item.price)}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">Estimated total</p>
                <p className="text-2xl font-bold gradient-text">{formatCurrency(total)}</p>
              </div>

              <div className="space-y-2">
                {cartItems.map((item) => (
                  <Link
                    key={item.productId}
                    href={`/products/${item.slug}`}
                    className="btn-primary flex w-full justify-center text-sm"
                  >
                    Buy {item.name.split(" ").slice(0, 2).join(" ")}
                  </Link>
                ))}
              </div>

              {/* Trust */}
              <div className="mt-5 space-y-2 rounded-2xl border border-border/50 bg-muted/20 p-4">
                {[
                  { icon: ShieldCheck, text: "Secure Razorpay checkout" },
                  { icon: Zap, text: "Instant credential delivery" }
                ].map((t) => (
                  <div key={t.text} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <t.icon className="h-3.5 w-3.5 text-primary" />
                    {t.text}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}
