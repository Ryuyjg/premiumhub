"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Headset,
  LayoutDashboard,
  ShieldCheck,
  ShoppingBag,
  TrendingUp,
  Wallet,
  AlertCircle,
  Clock3,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import type { AppUser, Order, Subscription, SupportTicket } from "@/types";
import { APP_NAME } from "@/lib/constants";
import { daysUntil, formatCurrency, formatDate } from "@/lib/utils";
import { RevealCredentials } from "@/components/dashboard/reveal-credentials";
import { SupportCenter } from "@/components/dashboard/support-center";

const statusStyles: Record<string, string> = {
  active: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border-emerald-500/25",
  expired: "bg-rose-500/12 text-rose-700 dark:text-rose-300 border-rose-500/25",
  pending: "bg-amber-500/12 text-amber-700 dark:text-amber-300 border-amber-500/25",
  paid: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border-emerald-500/25",
  failed: "bg-rose-500/12 text-rose-700 dark:text-rose-300 border-rose-500/25",
  created: "bg-blue-500/12 text-blue-700 dark:text-blue-300 border-blue-500/25",
  cancelled: "bg-zinc-500/12 text-zinc-700 dark:text-zinc-300 border-zinc-500/25"
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
  const firstName = user.displayName?.split(" ")[0] || "there";
  const activeSubCount = subscriptions.filter((s) => s.status === "active").length;
  const paidOrderCount = orders.filter((o) => o.status === "paid").length;
  const nextExpiry = subscriptions.length ? Math.min(...subscriptions.map((s) => daysUntil(s.expiresAt))) : null;
  const totalSpent = orders.filter((o) => o.status === "paid").reduce((acc, o) => acc + o.amount, 0);

  const statCards = [
    {
      icon: LayoutDashboard,
      label: "Active access",
      value: String(activeSubCount),
      sub: `${subscriptions.length} total deliveries`,
      tone: "from-primary/25 to-cyan-500/10",
      iconTone: "bg-primary/15 text-primary"
    },
    {
      icon: CreditCard,
      label: "Successful orders",
      value: String(paidOrderCount),
      sub: `${orders.length} total orders`,
      tone: "from-blue-500/20 to-sky-500/10",
      iconTone: "bg-blue-500/12 text-blue-600"
    },
    {
      icon: Clock3,
      label: "Next renewal",
      value: nextExpiry !== null ? `${nextExpiry}d` : "N/A",
      sub: nextExpiry !== null ? (nextExpiry <= 3 ? "Renew now to avoid interruption" : "Days remaining") : "No active access yet",
      tone: nextExpiry !== null && nextExpiry <= 3 ? "from-rose-500/20 to-orange-500/10" : "from-emerald-500/20 to-teal-500/10",
      iconTone: nextExpiry !== null && nextExpiry <= 3 ? "bg-rose-500/12 text-rose-600" : "bg-emerald-500/12 text-emerald-600"
    },
    {
      icon: Wallet,
      label: "Wallet balance",
      value: formatCurrency(user.walletBalance || 0),
      sub: `Total spent ${formatCurrency(totalSpent)}`,
      tone: "from-amber-500/20 to-orange-500/10",
      iconTone: "bg-amber-500/12 text-amber-600"
    }
  ];

  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-[2rem] border border-border/50 bg-gradient-to-br from-primary/90 via-[hsl(var(--gradient-mid))] to-accent p-6 text-white shadow-[0_28px_70px_rgba(13,148,136,0.28)] md:p-8">
        <div className="absolute -right-16 -top-14 h-48 w-48 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute -bottom-10 -left-8 h-36 w-36 rounded-full bg-white/10 blur-3xl" />
        <div className="relative grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="space-y-3">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-white/80">Customer workspace</p>
            <h1 className="text-3xl font-black tracking-tight md:text-4xl">
              Welcome back, {firstName}
            </h1>
            <p className="max-w-2xl text-sm text-white/90 md:text-base">
              {APP_NAME} keeps your orders, delivery details, renewals, and support in one clean workspace.
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-3 py-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Protected account
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-3 py-1">
                <Sparkles className="h-3.5 w-3.5" /> Delivery records
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-3 py-1">
                <Headset className="h-3.5 w-3.5" /> Support history
              </span>
            </div>
          </div>

          <div className="grid gap-2.5 text-sm sm:grid-cols-2 lg:w-[19rem]">
            <Link href="/products" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 font-bold text-primary transition hover:bg-white/90">
              Browse catalog <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/cart" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 py-3 font-bold text-white transition hover:bg-white/20">
              Open cart
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`relative overflow-hidden rounded-[1.5rem] border border-border/50 bg-gradient-to-br ${card.tone} p-5`}
          >
            <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${card.iconTone}`}>
              <card.icon className="h-5 w-5" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">{card.label}</p>
            <p className="mt-1 text-3xl font-black tracking-tight">{card.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{card.sub}</p>
          </motion.div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[1.75rem] border border-border/55 bg-white/75 p-5 shadow-[0_18px_48px_rgba(2,6,23,0.05)] backdrop-blur-xl dark:bg-white/4 md:p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-black tracking-tight">Your active access</h2>
            <Link href="/products" className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.12em] text-primary">
              Upgrade <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-3.5">
            {subscriptions.length ? (
              subscriptions.map((sub, i) => (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl border border-border/60 bg-muted/25 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1.5">
                      <p className="truncate text-sm font-black uppercase tracking-[0.06em]">{sub.productName}</p>
                      <p className="text-xs text-muted-foreground">
                        Expires {formatDate(sub.expiresAt)}
                        {" - "}
                        <span className={daysUntil(sub.expiresAt) <= 3 ? "font-bold text-rose-500" : "font-semibold"}>
                          {daysUntil(sub.expiresAt)} days left
                        </span>
                      </p>
                      {sub.status === "active" ? <RevealCredentials subscriptionId={sub.id} /> : null}
                    </div>
                    <span className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${statusStyles[sub.status] ?? statusStyles.pending}`}>
                      {sub.status}
                    </span>
                  </div>

                  {sub.status === "active" && (
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border/70">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary via-[hsl(var(--gradient-mid))] to-accent"
                        style={{ width: `${Math.max(5, Math.min(100, (daysUntil(sub.expiresAt) / 30) * 100))}%` }}
                      />
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="surface-interactive group flex flex-col items-center gap-4 rounded-3xl py-12 text-center bg-gradient-to-b border-dashed border-2 from-transparent to-muted/20">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 shadow-inner overflow-hidden">
                  <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/30 transition-all duration-500" />
                  <ShoppingBag className="h-7 w-7 text-primary relative z-10" />
                </div>
                <div className="space-y-1.5 px-4">
                  <p className="text-lg font-black tracking-tight">Your vault is empty</p>
                  <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">Your future deliveries and account details will appear here after checkout.</p>
                </div>
                <Link href="/products" className="btn-primary mt-2">
                  Explore catalog <ArrowRight className="h-4 w-4 ml-1.5" />
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-border/55 bg-white/75 p-5 shadow-[0_18px_48px_rgba(2,6,23,0.05)] backdrop-blur-xl dark:bg-white/4 md:p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-black tracking-tight">Order timeline</h2>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="space-y-3">
            {orders.length ? (
              orders.slice(0, 7).map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-muted/20 p-3"
                >
                  <div className="flex min-w-0 items-start gap-2.5">
                    <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${order.status === "paid" ? "bg-emerald-500/12" : "bg-rose-500/12"}`}>
                      {order.status === "paid" ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <AlertCircle className="h-4 w-4 text-rose-600" />}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{order.productName}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-black">{formatCurrency(order.amount)}</p>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] ${statusStyles[order.status] ?? statusStyles.pending}`}>
                      {order.status}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border/70 py-12 text-center bg-muted/10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/50 shadow-sm border border-border/50">
                  <CreditCard className="h-6 w-6 text-muted-foreground/60" />
                </div>
                <p className="max-w-[220px] text-xs text-muted-foreground">Completed orders and delivery updates will appear here once checkout activity starts.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <SupportCenter tickets={tickets} />
    </div>
  );
}

