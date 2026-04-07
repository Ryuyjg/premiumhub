"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";

export function CheckoutButton({ product }: { product: Product }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState<"none" | "wallet">("none");
  const [couponCode, setCouponCode] = useState("");
  const [customerDeliveryEmail, setCustomerDeliveryEmail] = useState("");

  const deliveryMode = product.deliveryMode || "direct_credentials";
  const requiresCustomerEmail = deliveryMode === "email_invite";
  const isOutOfStock = Boolean(product.isOutOfStock);

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
      <div className="rounded-xl border border-dashed border-border/70 bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
        INR gateway checkout will return here after UroPay integration.
      </div>
      <Button onClick={handleWalletCheckout} variant="outline" className="h-12 w-full" disabled={loading !== "none" || isOutOfStock}>
        {loading === "wallet" ? "Processing wallet payment..." : "Pay with wallet balance"}
      </Button>
    </div>
  );
}

