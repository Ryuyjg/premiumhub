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
  const [customerDeliveryEmail, setCustomerDeliveryEmail] = useState("");

  const deliveryMode = product.deliveryMode || "direct_credentials";
  const requiresCustomerEmail = deliveryMode === "email_invite";
  const isOutOfStock = Boolean(product.isOutOfStock);

  async function handleCheckout() {
    if (!user) {
      window.location.href = `/login?redirect=/products/${product.slug}`;
      return;
    }

    if (isOutOfStock) {
      toast.error("No stock available for this item.");
      return;
    }

    if (requiresCustomerEmail && !customerDeliveryEmail.trim()) {
      toast.error("Please enter your email for invitation delivery.");
      return;
    }

    setLoading("razorpay");
    try {
      await ensureRazorpay();
      const orderResponse = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          couponCode: couponCode.trim() || undefined,
          customerDeliveryEmail: customerDeliveryEmail.trim() || undefined
        })
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
          email: user.email || customerDeliveryEmail || undefined
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

    if (isOutOfStock) {
      toast.error("No stock available for this item.");
      return;
    }

    if (requiresCustomerEmail && !customerDeliveryEmail.trim()) {
      toast.error("Please enter your email for invitation delivery.");
      return;
    }

    setLoading("wallet");
    try {
      const response = await fetch("/api/wallet/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          couponCode: couponCode.trim() || undefined,
          customerDeliveryEmail: customerDeliveryEmail.trim() || undefined
        })
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
      {deliveryMode === "otp_manual" ? (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-300">
          OTP login product. After payment, admin will provide OTP manually on configured number.
        </p>
      ) : null}
      {deliveryMode === "email_invite" ? (
        <p className="rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-sm text-sky-700 dark:text-sky-300">
          Invitation-based product. Provide your email and admin will activate access.
        </p>
      ) : null}
      {isOutOfStock ? (
        <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm font-medium text-rose-700 dark:text-rose-300">
          No stock
        </p>
      ) : null}
      {requiresCustomerEmail ? (
        <input
          value={customerDeliveryEmail}
          onChange={(event) => setCustomerDeliveryEmail(event.target.value)}
          type="email"
          placeholder="Your email for invitation delivery"
          className="h-11 rounded-2xl border border-border/80 bg-white/80 px-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15 dark:bg-white/5"
          required
        />
      ) : null}
      <input
        value={couponCode}
        onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
        placeholder="Coupon code (optional)"
        className="h-11 rounded-2xl border border-border/80 bg-white/80 px-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15 dark:bg-white/5"
      />
      <Button onClick={handleCheckout} className="h-12 w-full" disabled={loading !== "none" || isOutOfStock}>
        {loading === "razorpay" ? "Preparing secure checkout..." : "Buy with Razorpay"}
      </Button>
      <Button onClick={handleWalletCheckout} variant="outline" className="h-12 w-full" disabled={loading !== "none" || isOutOfStock}>
        {loading === "wallet" ? "Processing wallet payment..." : "Pay with wallet balance"}
      </Button>
    </div>
  );
}
