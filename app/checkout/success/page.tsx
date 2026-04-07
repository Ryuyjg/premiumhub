"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

type ConfirmationState = "verifying" | "success" | "pending" | "failed";

export default function CheckoutSuccessPage() {
  const [state, setState] = useState<ConfirmationState>("verifying");
  const [message, setMessage] = useState("Verifying your payment...");

  const sessionId = useMemo(() => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams(window.location.search);
    return params.get("sessionId") || params.get("session_id") || "";
  }, []);

  useEffect(() => {
    let alive = true;

    async function confirmPayment() {
      try {
        const response = await fetch("/api/maxelpay/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: sessionId || undefined })
        });
        const data = await response.json().catch(() => ({}));

        if (!alive) return;

        if (response.ok && data.success) {
          setState("success");
          setMessage("Payment confirmed. Your products are now available in dashboard.");
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 1200);
          return;
        }

        if (data.pending) {
          setState("pending");
          setMessage("Payment is still processing. You can refresh this page in a few seconds.");
          return;
        }

        setState("failed");
        setMessage(String(data.error || "Unable to confirm payment."));
      } catch (error) {
        if (!alive) return;
        setState("failed");
        setMessage(error instanceof Error ? error.message : "Unable to confirm payment.");
      }
    }

    confirmPayment();
    return () => {
      alive = false;
    };
  }, [sessionId]);

  return (
    <div className="container py-20">
      <div className="mx-auto max-w-xl rounded-3xl border border-border/60 bg-card p-8 text-center shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Checkout status</p>
        <h1 className="mt-3 text-3xl font-black">USDT payment result</h1>
        <p className="mt-3 text-sm text-muted-foreground">{message}</p>

        {state === "verifying" ? <Loader2 className="mx-auto mt-6 h-7 w-7 animate-spin text-primary" /> : null}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/dashboard" className="btn-primary">
            Open dashboard
          </Link>
          <Link href="/products" className="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-muted">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

