import { Clock3, CreditCard, LayoutDashboard } from "lucide-react";
import type { AppUser, Order, Subscription } from "@/types";
import { daysUntil, formatCurrency, formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { RevealCredentials } from "@/components/dashboard/reveal-credentials";

export function DashboardOverview({
  user,
  subscriptions,
  orders
}: {
  user: AppUser;
  subscriptions: Subscription[];
  orders: Order[];
}) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Customer workspace</p>
        <h1 className="text-4xl font-semibold tracking-tight">Welcome back, {user.displayName || user.email}.</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Track subscription health, see order activity, and stay ahead of expiry with proactive renewal visibility.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <LayoutDashboard className="h-5 w-5 text-primary" />
          <p className="mt-5 text-sm text-muted-foreground">Active subscriptions</p>
          <p className="mt-2 text-3xl font-semibold">{subscriptions.filter((item) => item.status === "active").length}</p>
        </Card>
        <Card>
          <CreditCard className="h-5 w-5 text-primary" />
          <p className="mt-5 text-sm text-muted-foreground">Paid orders</p>
          <p className="mt-2 text-3xl font-semibold">{orders.filter((item) => item.status === "paid").length}</p>
        </Card>
        <Card>
          <Clock3 className="h-5 w-5 text-primary" />
          <p className="mt-5 text-sm text-muted-foreground">Next expiry</p>
          <p className="mt-2 text-3xl font-semibold">
            {subscriptions.length ? `${Math.min(...subscriptions.map((item) => daysUntil(item.expiresAt)))} days` : "N/A"}
          </p>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <Card>
          <h2 className="text-xl font-semibold">Active subscriptions</h2>
          <div className="mt-5 space-y-4">
            {subscriptions.length ? (
              subscriptions.map((subscription) => (
                <div key={subscription.id} className="rounded-2xl border border-border p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold">{subscription.productName}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Expires {formatDate(subscription.expiresAt)} • {daysUntil(subscription.expiresAt)} days left
                      </p>
                      {subscription.status === "active" ? <RevealCredentials subscriptionId={subscription.id} /> : null}
                    </div>
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
                      {subscription.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No subscriptions yet. Purchase a plan to start delivery.</p>
            )}
          </div>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold">Order history</h2>
          <div className="mt-5 space-y-4">
            {orders.length ? (
              orders.map((order) => (
                <div key={order.id} className="rounded-2xl border border-border p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">{order.productName}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(order.amount)}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">{order.status}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Order activity will appear here after your first purchase.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
