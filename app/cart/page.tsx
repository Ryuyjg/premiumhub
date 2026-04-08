"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CreditCard, ShieldCheck, ShoppingBag, Sparkles, Trash2, Wallet } from "lucide-react";
import { toast } from "sonner";
import { useAppStore } from "@/store/use-app-store";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";

const emptyCartIdeas = [
  "Add your strongest products first, not every product at once.",
  "Write clearer delivery notes before turning traffic back on.",
  "Reconnect the next gateway only after the catalog feels premium."
];

export default function CartPage() {
  const { user } = useAuth();
  const cartItems = useAppStore((state) => state.cartItems);
  const removeFromCart = useAppStore((state) => state.removeFromCart);
  const clearCart = useAppStore((state) => state.clearCart);
  const [loading, setLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  useEffect(() => {
    if (user) {
      fetch(`/api/user/profile`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.walletBalance !== undefined) setWalletBalance(data.walletBalance);
        })
        .catch(() => setWalletBalance(0));
    }
  }, [user]);

  async function handleWalletCheckout() {
    if (!user) {
      toast.error("Please sign in to proceed.");
      window.location.href = "/login?redirect=/cart";
      return;
    }

    if (walletBalance !== null && walletBalance < total) {
      toast.error(`Insufficient balance. (Balance: ${formatCurrency(walletBalance)})`);
      return;
    }

    setLoading(true);
    toast.loading("Processing your wallet checkout...", { id: "wallet-checkout" });

    try {
      const response = await fetch("/api/cart/wallet-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productIds: cartItems.map((item) => item.productId)
        })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || "Wallet checkout failed.");
      }

      toast.success("Order complete. Delivery details are now available in your dashboard.", { id: "wallet-checkout" });
      clearCart();
      window.location.href = "/dashboard";
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Checkout failed.", { id: "wallet-checkout" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container py-16">
      <div className="mb-10 space-y-3">
        <p className="glow-badge w-fit">Your cart</p>
        <h1 className="text-3xl font-black tracking-tight md:text-5xl">
          {cartItems.length > 0 ? (
            <>
              Review your
              <span className="gradient-text block">selected products.</span>
            </>
          ) : (
            "Your cart is empty"
          )}
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
          Keep the bag focused on the products you are actually ready to deliver cleanly and support properly.
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="surface flex flex-col items-center gap-6 rounded-[2.5rem] border-2 border-dashed border-border/60 bg-muted/20 py-20 text-center"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-background shadow-xl">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <p className="text-xl font-bold">Nothing added yet</p>
              <p className="text-sm text-muted-foreground">
                Start with the items you want customers to remember your store for.
              </p>
            </div>
            <Link href="/products" className="btn-primary">
              Browse catalog <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-3">
            {emptyCartIdeas.map((idea) => (
              <div key={idea} className="rounded-[1.75rem] border border-border/55 bg-white/70 p-6 shadow-[0_16px_40px_rgba(2,6,23,0.05)] backdrop-blur-xl dark:bg-white/4">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Sparkles className="h-4 w-4" />
                </div>
                <p className="text-sm leading-7 text-muted-foreground">{idea}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_24rem]">
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.productId}
                  layout
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16, scale: 0.97 }}
                  transition={{ delay: index * 0.04 }}
                  className="surface group flex items-center gap-5 rounded-[2rem] border border-border/40 p-5 transition-all hover:shadow-xl hover:shadow-primary/5"
                >
                  <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-2xl bg-muted shadow-sm">
                    <Image
                      src={item.imageUrl || "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=600&q=80"}
                      alt={item.name}
                      fill
                      className="object-cover transition group-hover:scale-105"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-lg font-bold">{item.name}</p>
                        <span className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          {item.categoryName}
                        </span>
                      </div>
                      <p className="shrink-0 text-xl font-black text-primary">{formatCurrency(item.price)}</p>
                    </div>
                    <div className="mt-5 flex items-center gap-4">
                      <Link
                        href={`/products/${item.slug}`}
                        className="text-xs font-bold text-muted-foreground underline underline-offset-4 transition-colors hover:text-primary"
                      >
                        View details
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId)}
                        className="flex items-center gap-1.5 text-xs font-bold text-rose-500/80 transition-colors hover:text-rose-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <button
              type="button"
              onClick={clearCart}
              className="mt-6 flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-rose-500"
            >
              <Trash2 size={16} />
              Empty cart
            </button>
          </div>

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="surface sticky top-24 rounded-[2.5rem] border border-primary/10 p-8 shadow-2xl shadow-primary/5"
            >
              <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
                Order summary
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              </h2>

              <div className="mb-6 space-y-4 border-b border-border/50 pb-6">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between text-sm">
                    <span className="max-w-[180px] truncate font-medium text-muted-foreground/80">{item.name}</span>
                    <span className="font-bold">{formatCurrency(item.price)}</span>
                  </div>
                ))}
              </div>

              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total</p>
                  <p className="gradient-text text-3xl font-black">{formatCurrency(total)}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <ShieldCheck size={24} />
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-[1.5rem] border border-dashed border-border/70 bg-muted/30 p-4 text-sm text-muted-foreground">
                  External gateway checkout is paused while the store is being rebuilt. Wallet checkout stays available
                  for approved users.
                </div>

                <Button
                  onClick={handleWalletCheckout}
                  variant="outline"
                  className="h-14 w-full gap-3 rounded-[1.5rem] border-primary/20 text-base hover:bg-primary/5"
                  disabled={loading || (walletBalance !== null && walletBalance < total)}
                >
                  {loading ? (
                    "Processing..."
                  ) : (
                    <>
                      <Wallet className="h-5 w-5 text-primary" />
                      Checkout with wallet
                    </>
                  )}
                </Button>

                {walletBalance !== null ? (
                  <p className="text-center text-[11px] font-bold text-muted-foreground">
                    Available balance:{" "}
                    <span className={walletBalance >= total ? "text-emerald-500" : "text-rose-500"}>
                      {formatCurrency(walletBalance)}
                    </span>
                  </p>
                ) : null}
              </div>

              <div className="mt-8 space-y-3 rounded-[2rem] border border-border/50 bg-muted/30 p-5">
                {[
                  { icon: CreditCard, text: "Reconnect the next gateway when the catalog is ready", color: "text-amber-500" },
                  { icon: ShieldCheck, text: "Dashboard delivery and support flow stay active", color: "text-emerald-500" }
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3 text-xs font-bold text-muted-foreground">
                    <item.icon className={`h-4 w-4 ${item.color}`} />
                    {item.text}
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
