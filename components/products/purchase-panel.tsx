"use client";

import Link from "next/link";
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
        <p className="rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-foreground">
          Manual OTP delivery item. Final access details are shared after payment confirmation.
        </p>
      ) : null}
      {deliveryMode === "email_invite" ? (
        <p className="rounded-2xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
          Invite-based item. Enter the customer email that should receive access.
        </p>
      ) : null}
      {isOutOfStock ? (
        <p className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-700 dark:text-rose-300">
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
      <div className="rounded-2xl border border-dashed border-border/70 bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
        Secure checkout note: wallet balance flow is active, and external gateway can be enabled again later.
      </div>
      <Button
        onClick={handleWalletCheckout}
        variant="outline"
        className="h-12 w-full rounded-2xl"
        disabled={loading !== "none" || isOutOfStock}
      >
        {loading === "wallet" ? "Processing secure checkout..." : "Pay with wallet balance"}
      </Button>
      <div className="flex flex-wrap gap-3 pt-1 text-xs font-semibold text-muted-foreground">
        <Link href="/refund-policy" className="transition-colors hover:text-primary">
          Refund policy
        </Link>
        <Link href="/faq" className="transition-colors hover:text-primary">
          FAQ
        </Link>
        <Link href="/contact" className="transition-colors hover:text-primary">
          Contact support
        </Link>
      </div>
    </div>
  );
}
