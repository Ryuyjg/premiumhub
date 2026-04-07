"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";

type UroPayCheckout = {
  gatewayOrderId: string;
  qrCode: string;
  upiString: string;
  amountInRupees: string;
};

export function CheckoutButton({ product }: { product: Product }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState<"none" | "uropay" | "wallet" | "reference">("none");
  const [couponCode, setCouponCode] = useState("");
  const [customerDeliveryEmail, setCustomerDeliveryEmail] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [uroPayCheckout, setUroPayCheckout] = useState<UroPayCheckout | null>(null);

  const deliveryMode = product.deliveryMode || "direct_credentials";
  const requiresCustomerEmail = deliveryMode === "email_invite";
  const isOutOfStock = Boolean(product.isOutOfStock);

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
          toast.success("Payment confirmed. Subscription activated.");
          window.clearInterval(interval);
          window.location.href = "/dashboard";
        }
      } catch {
        // Ignore polling errors and retry on the next interval.
      }
    }, 5000);

    return () => window.clearInterval(interval);
  }, [uroPayCheckout]);

  async function handleUroPayCheckout() {
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

    setLoading("uropay");
    try {
      const response = await fetch("/api/uropay/order", {
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
        toast.success("Payment confirmed. Subscription activated.");
        window.location.href = "/dashboard";
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
      <Button onClick={handleUroPayCheckout} className="h-12 w-full" disabled={loading !== "none" || isOutOfStock}>
        {loading === "uropay" ? "Creating UroPay order..." : "Pay with UPI (UroPay)"}
      </Button>
      {uroPayCheckout ? (
        <div className="rounded-2xl border border-border/70 bg-muted/25 p-4">
          <p className="text-sm font-semibold">Complete your INR payment</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Order ID: {uroPayCheckout.gatewayOrderId} | Amount: Rs. {uroPayCheckout.amountInRupees}
          </p>
          <div className="mt-4 flex justify-center rounded-2xl bg-white p-3">
            <img src={uroPayCheckout.qrCode} alt="UroPay QR code" className="h-48 w-48 rounded-xl object-contain" />
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
      <Button onClick={handleWalletCheckout} variant="outline" className="h-12 w-full" disabled={loading !== "none" || isOutOfStock}>
        {loading === "wallet" ? "Processing wallet payment..." : "Pay with wallet balance"}
      </Button>
    </div>
  );
}

