"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Zap, Tag, Sparkles, Loader2, TrendingUp, Cpu } from "lucide-react";
import { useAppStore } from "@/store/use-app-store";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";
import type { Product } from "@/types";
import { ProductCard } from "@/components/products/product-card";

type UroPayCheckout = {
  gatewayOrderId: string;
  qrCode: string;
  upiString: string;
  amountInRupees: string;
};

function redirectToSuccess(gatewayOrderId: string) {
  window.location.href = `/checkout/success?gatewayOrderId=${encodeURIComponent(gatewayOrderId)}`;
}

export default function CartPage() {
  const { user } = useAuth();
  const cartItems = useAppStore((state) => state.cartItems);
  const removeFromCart = useAppStore((state) => state.removeFromCart);
  const clearCart = useAppStore((state) => state.clearCart);
  const [loading, setLoading] = useState<"none" | "wallet" | "uropay" | "reference">("none");
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [trending, setTrending] = useState<Product[]>([]);
  const [fetchingTrending, setFetchingTrending] = useState(false);
  const [uroPayCheckout, setUroPayCheckout] = useState<UroPayCheckout | null>(null);
  const [referenceNumber, setReferenceNumber] = useState("");

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

  useEffect(() => {
    if (cartItems.length === 0) {
      setFetchingTrending(true);
      fetch("/api/products/all")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setTrending(data.slice(0, 3));
        })
        .finally(() => setFetchingTrending(false));
    }
  }, [cartItems.length]);

  useEffect(() => {
    if (!uroPayCheckout?.gatewayOrderId) {
      return;
    }

    const interval = window.setInterval(async () => {
      try {
        const response = await fetch(`/api/uropay/status/${encodeURIComponent(uroPayCheckout.gatewayOrderId)}`, {
          cache: "no-store"
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          return;
        }

        if (data.gatewayStatus === "COMPLETED") {
          toast.success("Payment confirmed. Your products are ready on your dashboard.");
          clearCart();
          window.clearInterval(interval);
          redirectToSuccess(uroPayCheckout.gatewayOrderId);
        }
      } catch {
        // Ignore polling errors and retry later.
      }
    }, 5000);

    return () => window.clearInterval(interval);
  }, [clearCart, uroPayCheckout]);

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

    setLoading("wallet");
    toast.loading("Processing your wallet payment...", { id: "wallet-checkout" });

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

      toast.success("Success! Your products are ready on your dashboard.", { id: "wallet-checkout" });
      clearCart();
      window.location.href = "/dashboard";
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Checkout failed.", { id: "wallet-checkout" });
    } finally {
      setLoading("none");
    }
  }

  async function handleUroPayCheckout() {
    if (!user) {
      toast.error("Please sign in to proceed with checkout.");
      window.location.href = "/login?redirect=/cart";
      return;
    }

    if (cartItems.length === 0) {
      return;
    }

    setLoading("uropay");
    try {
      const response = await fetch("/api/uropay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productIds: cartItems.map((item) => item.productId)
        })
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Unable to create UroPay order.");
      }

      setUroPayCheckout({
        gatewayOrderId: String(data.gatewayOrderId || ""),
        qrCode: String(data.qrCode || ""),
        upiString: String(data.upiString || ""),
        amountInRupees: String(data.amountInRupees || "")
      });
      setReferenceNumber("");
      toast.success("UroPay order created. Scan the QR or open your UPI app.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create UroPay order.");
    } finally {
      setLoading("none");
    }
  }

  async function handleReferenceSubmit() {
    if (!uroPayCheckout?.gatewayOrderId) {
      toast.error("Create a UroPay order first.");
      return;
    }

    if (!referenceNumber.trim()) {
      toast.error("Enter the UPI reference number after payment.");
      return;
    }

    setLoading("reference");
    try {
      const response = await fetch("/api/uropay/reference", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gatewayOrderId: uroPayCheckout.gatewayOrderId,
          referenceNumber: referenceNumber.trim()
        })
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Unable to submit UPI reference number.");
      }

      if (data.gatewayStatus === "COMPLETED") {
        toast.success("Payment confirmed. Your products are ready on your dashboard.");
        clearCart();
        redirectToSuccess(uroPayCheckout.gatewayOrderId);
        return;
      }

      toast.success("Reference number submitted. We are waiting for UroPay confirmation.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to submit UPI reference number.");
    } finally {
      setLoading("none");
    }
  }

  return (
    <div className="container py-16">
      <div className="mb-10 space-y-2">
        <p className="grow-badge w-fit text-[10px] uppercase tracking-widest font-bold">Your shopping bag</p>
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
          {cartItems.length > 0 ? (
            <>Review your <span className="gradient-text">selected plans</span></>
          ) : (
            "Your cart is empty"
          )}
        </h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="space-y-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="surface flex flex-col items-center gap-6 rounded-[2.5rem] py-20 text-center border-dashed border-2 border-border/60 bg-muted/20"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-background shadow-xl">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <p className="text-xl font-bold">Nothing here yet</p>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5">
                <Sparkles size={14} className="text-amber-500" />
                Find your next favorite plan and add it here.
              </p>
            </div>
            <Link href="/products" className="btn-primary">
              Browse plans <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          {/* Trending Section */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <TrendingUp size={18} />
              </div>
              <h2 className="text-2xl font-bold">Trending this week</h2>
            </div>
            
            {fetchingTrending ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map(i => <div key={i} className="h-64 animate-pulse rounded-3xl bg-muted" />)}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {trending.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_24rem]">
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
                  className="surface group flex items-center gap-5 rounded-[2rem] p-5 transition-all hover:shadow-xl hover:shadow-primary/5 border border-border/40"
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
                        <p className="truncate font-bold text-lg">{item.name}</p>
                        <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-[10px] font-bold text-muted-foreground mt-1.5 uppercase tracking-wider">
                          <Tag className="h-3 w-3" />
                          {item.categoryName}
                        </span>
                      </div>
                      <p className="shrink-0 text-xl font-black text-primary">{formatCurrency(item.price)}</p>
                    </div>
                    <div className="mt-5 flex items-center gap-4">
                      <Link
                        href={`/products/${item.slug}`}
                        className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
                      >
                        View details
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId)}
                        className="flex items-center gap-1.5 text-xs font-bold text-rose-500/80 hover:text-rose-600 transition-colors"
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
              className="mt-6 text-sm font-medium text-muted-foreground hover:text-rose-500 transition-colors flex items-center gap-2"
            >
              <Trash2 size={16} />
              Empty entire bag
            </button>
          </div>

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="surface sticky top-24 rounded-[2.5rem] p-8 border border-primary/10 shadow-2xl shadow-primary/5"
            >
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                Order summary
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              </h2>

              <div className="space-y-4 border-b border-border/50 pb-6 mb-6">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between text-sm">
                    <span className="truncate text-muted-foreground/80 font-medium max-w-[180px]">{item.name}</span>
                    <span className="font-bold">{formatCurrency(item.price)}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mb-8">
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Estimate total</p>
                    <p className="text-3xl font-black gradient-text">{formatCurrency(total)}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <ShieldCheck size={24} />
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleUroPayCheckout}
                  className="btn-primary w-full h-14 text-base gap-3"
                  disabled={loading !== "none"}
                >
                  {loading === "uropay" ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Creating UroPay order...
                    </>
                  ) : (
                    <>
                      Pay with UPI (UroPay) <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </Button>

                <Button 
                  onClick={handleWalletCheckout} 
                  variant="outline"
                  className="w-full h-14 text-base gap-3 rounded-[1.5rem] border-primary/20 hover:bg-primary/5"
                  disabled={loading !== "none" || (walletBalance !== null && walletBalance < total)}
                >
                  {loading === "wallet" ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Cpu className="h-5 w-5 text-primary" />
                  )}
                  Pay with Wallet
                </Button>

                {walletBalance !== null ? (
                  <p className="text-center text-[11px] font-bold text-muted-foreground">
                    Available Balance: <span className={walletBalance >= total ? "text-emerald-500" : "text-rose-500"}>
                      {formatCurrency(walletBalance)}
                    </span>
                  </p>
                ) : null}

                {uroPayCheckout ? (
                  <div className="rounded-[1.5rem] border border-border/70 bg-muted/25 p-4">
                    <p className="text-sm font-semibold">Complete your INR payment</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Order ID: {uroPayCheckout.gatewayOrderId} | Amount: Rs. {uroPayCheckout.amountInRupees}
                    </p>
                    <div className="mt-4 flex justify-center rounded-2xl bg-white p-3">
                      <img src={uroPayCheckout.qrCode} alt="UroPay QR code" className="h-52 w-52 rounded-xl object-contain" />
                    </div>
                    <div className="mt-4 grid gap-3">
                      <Button type="button" variant="outline" className="h-11 w-full" onClick={() => window.open(uroPayCheckout.upiString, "_self")}>
                        Open UPI App
                      </Button>
                      <input
                        value={referenceNumber}
                        onChange={(event) => setReferenceNumber(event.target.value)}
                        placeholder="Enter UPI reference number after payment"
                        className="h-11 rounded-2xl border border-border/80 bg-white/80 px-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15 dark:bg-white/5"
                      />
                      <Button type="button" variant="outline" className="h-11 w-full" onClick={handleReferenceSubmit} disabled={loading !== "none"}>
                        {loading === "reference" ? "Submitting reference..." : "Submit Reference Number"}
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="mt-8 space-y-3 rounded-[2rem] border border-border/50 bg-muted/30 p-5">
                {[
                  { icon: ShieldCheck, text: "UroPay QR checkout with INR pricing", color: "text-emerald-500" },
                  { icon: Zap, text: "Instant Credentials Auto-delivery", color: "text-amber-500" }
                ].map((t) => (
                  <div key={t.text} className="flex items-center gap-3 text-xs font-bold text-muted-foreground">
                    <t.icon className={`h-4 w-4 ${t.color}`} />
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

