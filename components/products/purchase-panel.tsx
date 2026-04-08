"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

      toast.success("Wallet checkout complete. Your access details are now available in the dashboard.");
      window.location.href = "/dashboard";
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Wallet checkout failed.");
    } finally {
      setLoading("none");
    }
  }

  return (
    <div className="grid gap-3">
      {deliveryMode === "otp_manual" ? (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-300">
          Manual OTP delivery item. Final access is handled by the admin after payment confirmation.
        </p>
      ) : null}
      {deliveryMode === "email_invite" ? (
        <p className="rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-sm text-sky-700 dark:text-sky-300">
          Invite-based item. Enter the customer email that should receive access.
        </p>
      ) : null}
      {isOutOfStock ? (
        <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm font-medium text-rose-700 dark:text-rose-300">
          No stock
        </p>
      ) : null}
      {requiresCustomerEmail ? (
        <Input
          value={customerDeliveryEmail}
          onChange={(event) => setCustomerDeliveryEmail(event.target.value)}
          type="email"
          placeholder="Customer email for invite delivery"
          required
        />
      ) : null}
      <Input
        value={couponCode}
        onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
        placeholder="Coupon code (optional)"
      />
      <div className="rounded-xl border border-dashed border-border/70 bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
        External gateway checkout is paused for now. Wallet balance checkout remains available for approved customers.
      </div>
      <Button onClick={handleWalletCheckout} variant="outline" className="h-12 w-full" disabled={loading !== "none" || isOutOfStock}>
        {loading === "wallet" ? "Processing wallet checkout..." : "Checkout with wallet balance"}
      </Button>
    </div>
  );
}
