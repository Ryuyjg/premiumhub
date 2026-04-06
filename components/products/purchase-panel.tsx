"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

async function ensureRazorpay() {
  if (window.Razorpay) {
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Unable to load Razorpay."));
    document.body.appendChild(script);
  });
}

export function CheckoutButton({ product }: { product: Product }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState<"none" | "razorpay" | "wallet">("none");
  const [couponCode, setCouponCode] = useState("");

  async function handleCheckout() {
    if (!user) {
      window.location.href = `/login?redirect=/products/${product.slug}`;
      return;
    }

    setLoading("razorpay");
    try {
      await ensureRazorpay();
      const orderResponse = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, couponCode: couponCode.trim() || undefined })
      });

      if (!orderResponse.ok) {
        const orderError = await orderResponse.json().catch(() => ({}));
        throw new Error(orderError.error || "Unable to create Razorpay order.");
      }

      const order = await orderResponse.json();
      const razorpay = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "StreamVault",
        description: product.name,
        order_id: order.id,
        modal: {
          ondismiss: () => toast.error("Payment cancelled. You can retry anytime.")
        },
        handler: async (response: Record<string, string>) => {
          const verificationResponse = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...response,
              orderId: order.internalOrderId,
              productId: product.id
            })
          });

          if (!verificationResponse.ok) {
            toast.error("Payment verification failed. Please contact support.");
            return;
          }

          toast.success("Payment verified and subscription activated.");
          window.location.href = "/dashboard";
        },
        prefill: {
          email: user.email || undefined
        },
        theme: {
          color: "#2563eb"
        }
      });

      razorpay.open();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Checkout failed.");
    } finally {
      setLoading("none");
    }
  }

  async function handleWalletCheckout() {
    if (!user) {
      window.location.href = `/login?redirect=/products/${product.slug}`;
      return;
    }

    setLoading("wallet");
    try {
      const response = await fetch("/api/wallet/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, couponCode: couponCode.trim() || undefined })
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Wallet purchase failed.");
      }

      toast.success("Wallet payment successful and subscription activated.");
      window.location.href = "/dashboard";
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Wallet payment failed.");
    } finally {
      setLoading("none");
    }
  }

  return (
    <div className="grid gap-3">
      <input
        value={couponCode}
        onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
        placeholder="Coupon code (optional)"
        className="h-11 rounded-2xl border border-border/80 bg-white/80 px-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15 dark:bg-white/5"
      />
      <Button onClick={handleCheckout} className="h-12 w-full" disabled={loading !== "none"}>
        {loading === "razorpay" ? "Preparing secure checkout..." : "Buy with Razorpay"}
      </Button>
      <Button onClick={handleWalletCheckout} variant="outline" className="h-12 w-full" disabled={loading !== "none"}>
        {loading === "wallet" ? "Processing wallet payment..." : "Pay with wallet balance"}
      </Button>
    </div>
  );
}
