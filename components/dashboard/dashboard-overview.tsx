"use client";

import { motion } from "framer-motion";
import {
  Clock3,
  CreditCard,
  LayoutDashboard,
  Wallet,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import type { AppUser, Order, Subscription, SupportTicket } from "@/types";
import { daysUntil, formatCurrency, formatDate } from "@/lib/utils";
import { RevealCredentials } from "@/components/dashboard/reveal-credentials";
import { SupportCenter } from "@/components/dashboard/support-center";

const statusStyles: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  expired: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  paid: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  failed: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  created: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  cancelled: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20"
};

export function DashboardOverview({
  user,
  subscriptions,
  orders,
  tickets
}: {
  user: AppUser;
  subscriptions: Subscription[];
  orders: Order[];
  tickets: SupportTicket[];
}) {
  const activeSubCount = subscriptions.filter((s) => s.status === "active").length;
  const paidOrderCount = orders.filter((o) => o.status === "paid").length;
  const nextExpiry = subscriptions.length
    ? Math.min(...subscriptions.map((s) => daysUntil(s.expiresAt)))
    : null;
  const totalSpent = orders
    .filter((o) => o.status === "paid")
    .reduce((acc, o) => acc + o.amount, 0);

  const statCards = [
    {
      icon: LayoutDashboard,
      label: "Active subscriptions",
      value: String(activeSubCount),
      sub: `${subscriptions.length} total`,
      gradient: "from-violet-500/15 to-purple-500/10",
      iconColor: "text-violet-500",
      iconBg: "bg-violet-500/10"
    },
    {
      icon: CreditCard,
      label: "Paid orders",
      value: String(paidOrderCount),
      sub: `${orders.length} total orders`,
      gradient: "from-blue-500/15 to-cyan-500/10",
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10"
    },
    {
      icon: Clock3,
      label: "Next expiry",
      value: nextExpiry !== null ? `${nextExpiry}d` : "N/A",
      sub: nextExpiry !== null ? (nextExpiry <= 3 ? "⚠ Expiring soon!" : "Days remaining") : "No active subs",
      gradient: nextExpiry !== null && nextExpiry <= 3
        ? "from-rose-500/15 to-orange-500/10"
        : "from-emerald-500/15 to-teal-500/10",
      iconColor: nextExpiry !== null && nextExpiry <= 3 ? "text-rose-500" : "text-emerald-500",
      iconBg: nextExpiry !== null && nextExpiry <= 3 ? "bg-rose-500/10" : "bg-emerald-500/10"
    },
    {
      icon: Wallet,
      label: "Wallet balance",
      value: formatCurrency(user.walletBalance || 0),
      sub: `Total spent: ${formatCurrency(totalSpent)}`,
      gradient: "from-amber-500/15 to-orange-500/10",
      iconColor: "text-amber-500",
      iconBg: "bg-amber-500/10"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">Customer workspace</p>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Welcome back,{" "}
          <span className="gradient-text">{user.displayName?.split(" ")[0] || "there"} 👋</span>
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Track subscription health, see order activity, and stay ahead of expiry with proactive renewal visibility.
          <span className="ml-2 text-[8px] opacity-10 hover:opacity-100 transition-opacity">ID: {user.id}</span>
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index, duration: 0.4 }}
            whileHover={{ y: -4 }}
            className={`relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br ${card.gradient} p-6 backdrop-blur-sm transition-all dark:border-white/5`}
          >
            <span className="absolute -right-2 -top-3 text-7xl font-black text-foreground/3 select-none">
              {index + 1}
            </span>
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${card.iconBg} mb-4`}>
              <card.icon className={`h-5 w-5 ${card.iconColor}`} />
            </div>
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className="mt-1 text-3xl font-bold">{card.value}</p>
            <p className="mt-1.5 text-xs text-muted-foreground">{card.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Subscriptions + Orders */}
      <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        {/* Active subscriptions */}
        <div className="surface rounded-[1.75rem] p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold">Active subscriptions</h2>
            <Link href="/products" className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
              Browse more <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {subscriptions.length ? (
              subscriptions.map((sub, i) => (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group rounded-2xl border border-border/60 bg-muted/30 p-4 transition-all hover:border-primary/30 hover:bg-primary/5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <p className="font-semibold truncate">{sub.productName}</p>
                      <p className="text-xs text-muted-foreground">
                        Expires {formatDate(sub.expiresAt)}
                        {" · "}
                        <span className={daysUntil(sub.expiresAt) <= 3 ? "font-bold text-rose-500" : ""}>
                          {daysUntil(sub.expiresAt)} days left
                        </span>
                      </p>
                      {sub.status === "active" ? (
                        <RevealCredentials subscriptionId={sub.id} />
                      ) : null}
                    </div>
                    <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[sub.status] ?? statusStyles.pending}`}>
                      {sub.status}
                    </span>
                  </div>
                  {/* Expiry progress bar */}
                  {sub.status === "active" && (
                    <div className="mt-3">
                      <div className="h-1.5 w-full rounded-full bg-border/60 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
                          style={{ width: `${Math.max(5, Math.min(100, (daysUntil(sub.expiresAt) / 30) * 100))}%` }}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/60">
                  <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No subscriptions yet.</p>
                <Link href="/products" className="btn-primary text-xs h-9 px-5">
                  Browse plans
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Order history */}
        <div className="surface rounded-[1.75rem] p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold">Order history</h2>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {orders.length ? (
              orders.slice(0, 6).map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start justify-between gap-3 rounded-2xl border border-border/60 p-3.5"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                      order.status === "paid" ? "bg-emerald-500/10" : "bg-rose-500/10"
                    }`}>
                      {order.status === "paid"
                        ? <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        : <AlertCircle className="h-4 w-4 text-rose-500" />
                      }
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{order.productName}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold">{formatCurrency(order.amount)}</p>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusStyles[order.status] ?? statusStyles.pending}`}>
                      {order.status}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/60">
                  <CreditCard className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No orders yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <SupportCenter tickets={tickets} />
    </div>
  );
}
