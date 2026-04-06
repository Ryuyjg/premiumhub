"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import type { Order } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const statusClass: Record<string, string> = {
  created: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  paid: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  failed: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  refunded: "bg-slate-500/10 text-slate-700 dark:text-slate-300"
};

export function OrderManager({ orders }: { orders: Order[] }) {
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchStatus = status === "all" || order.status === status;
      const searchTarget = `${order.productName} ${order.userId} ${order.razorpayOrderId}`.toLowerCase();
      const matchQuery = query.length === 0 || searchTarget.includes(query.toLowerCase());
      return matchStatus && matchQuery;
    });
  }, [orders, query, status]);

  async function handleAction(orderId: string, action: "refund" | "replace") {
    const response = await fetch("/api/admin/orders/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, action })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      toast.error(data.error || "Unable to update order.");
      return;
    }
    toast.success(action === "refund" ? "Refund processed." : "Account replaced.");
    window.location.reload();
  }

  return (
    <Card>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Order control center</h2>
          <p className="mt-1 text-sm text-muted-foreground">Track payment states, failed attempts, and recovery paths.</p>
        </div>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="h-11 rounded-2xl border border-border/80 bg-white/80 px-4 text-sm dark:bg-white/5"
        >
          <option value="all">All statuses</option>
          <option value="created">Created</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>
      <div className="relative mt-4">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by product, user id, or razorpay order id"
          className="pl-10"
        />
      </div>
      <div className="mt-5 overflow-hidden rounded-2xl border border-border/80">
        <div className="hidden grid-cols-[1.2fr_0.8fr_0.5fr_0.6fr_0.8fr] gap-3 bg-muted/60 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground md:grid">
          <p>Order</p>
          <p>User</p>
          <p>Status</p>
          <p className="text-right">Amount</p>
          <p className="text-right">Actions</p>
        </div>
        <div className="divide-y divide-border/70">
          {filteredOrders.map((order) => (
            <div key={order.id} className="grid gap-4 px-4 py-4 md:grid-cols-[1.2fr_0.8fr_0.5fr_0.6fr_0.8fr] md:items-center">
              <div>
                <p className="font-semibold">{order.productName}</p>
                <p className="mt-1 text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">{order.paymentMethod || "razorpay"}</p>
                {order.deliveryMode ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Delivery: {order.deliveryMode === "direct_credentials" ? "ID/Password" : order.deliveryMode === "otp_manual" ? "OTP manual" : "Email invite"}
                  </p>
                ) : null}
                {order.customerDeliveryEmail ? (
                  <p className="mt-1 text-xs text-muted-foreground">Client email: {order.customerDeliveryEmail}</p>
                ) : null}
              </div>
              <p className="truncate text-sm text-muted-foreground">{order.userId}</p>
              <p className="text-sm">
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${statusClass[order.status] || "bg-muted"}`}>
                  {order.status}
                </span>
              </p>
              <p className="text-right text-sm font-semibold">{formatCurrency(order.amount)}</p>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleAction(order.id, "replace")}
                  disabled={order.status !== "paid"}
                >
                  Replace
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleAction(order.id, "refund")}
                  disabled={order.status !== "paid"}
                >
                  Refund
                </Button>
              </div>
            </div>
          ))}
          {filteredOrders.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">No orders match this filter.</p>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
