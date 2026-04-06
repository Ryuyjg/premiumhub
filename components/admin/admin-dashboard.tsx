"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, Boxes, Layers, ShieldCheck, TicketPercent, Users2, Wallet } from "lucide-react";
import type {
  AnalyticsSummary,
  AppUser,
  Category,
  Coupon,
  Offer,
  Order,
  OttAccount,
  Product,
  Review,
  SupportTicket
} from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ProductManager } from "@/components/admin/product-manager";
import { CouponManager } from "@/components/admin/coupon-manager";
import { AccountManager } from "@/components/admin/account-manager";
import { CategoryManager } from "@/components/admin/category-manager";
import { OrderManager } from "@/components/admin/order-manager";
import { UserBalanceManager } from "@/components/admin/user-balance-manager";
import { ReviewManager } from "@/components/admin/review-manager";
import { SupportManager } from "@/components/admin/support-manager";
import { OfferManager } from "@/components/admin/offer-manager";

const tabs = [
  { id: "overview", label: "Overview", icon: Layers },
  { id: "catalog", label: "Catalog", icon: Boxes },
  { id: "operations", label: "Operations", icon: ShieldCheck },
  { id: "users", label: "Users", icon: Users2 },
  { id: "growth", label: "Growth", icon: TicketPercent }
] as const;

type TabId = (typeof tabs)[number]["id"];

export function AdminDashboard({
  analytics,
  products,
  orders,
  coupons,
  accounts,
  categories,
  users,
  reviews,
  tickets,
  offers = []
}: {
  analytics: AnalyticsSummary;
  products: Product[];
  orders: Order[];
  coupons: Coupon[];
  accounts: OttAccount[];
  categories: Category[];
  users: AppUser[];
  reviews: Review[];
  tickets: SupportTicket[];
  offers?: Offer[];
}) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const paidOrders = useMemo(() => orders.filter((order) => order.status === "paid").length, [orders]);
  const failedOrders = useMemo(() => orders.filter((order) => order.status === "failed").length, [orders]);
  const lowStockPools = useMemo(
    () =>
      accounts.filter((account) => {
        const remaining = Number(account.maxUsers || 0) - Number(account.activeUsers || 0);
        return account.status !== "disabled" && remaining <= 1;
      }).length,
    [accounts]
  );
  
  const kpiCards = useMemo(() => [
    { icon: Wallet, label: "Total Revenue", value: formatCurrency(analytics.revenue), gradient: "from-violet-500/15 to-purple-500/8", iconBg: "bg-violet-500/10", iconColor: "text-violet-500" },
    { icon: BarChart3, label: "Total Orders", value: String(analytics.orders), gradient: "from-blue-500/15 to-cyan-500/8", iconBg: "bg-blue-500/10", iconColor: "text-blue-500" },
    { icon: Users2, label: "Active Users", value: String(analytics.activeUsers), gradient: "from-emerald-500/15 to-teal-500/8", iconBg: "bg-emerald-500/10", iconColor: "text-emerald-500" },
    { icon: TicketPercent, label: "Live Subscriptions", value: String(analytics.activeSubscriptions), gradient: "from-amber-500/15 to-orange-500/8", iconBg: "bg-amber-500/10", iconColor: "text-amber-500" }
  ], [analytics]);

  return (
    <div className="space-y-8">
      {/* Admin hero header */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary/90 via-accent to-violet-600 p-8 md:p-10 text-white">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-white/8 blur-3xl" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "36px 36px" }} />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-widest">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              Enterprise command center
            </span>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Admin Dashboard</h1>
            <p className="max-w-xl text-white/75 text-sm">Manage catalog, orders, users, and growth tools from one place.</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Payment health", value: `${paidOrders}P / ${failedOrders}F` },
              { label: "Account pools", value: `${accounts.length} managed` },
              { label: "Stock alerts", value: `${lowStockPools} low` }
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/20 bg-white/10 px-3 py-2.5 backdrop-blur-sm">
                <p className="text-[10px] uppercase tracking-widest text-white/60">{s.label}</p>
                <p className="mt-1 font-bold text-sm">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Tab bar */}
        <div className="relative mt-8 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-white text-primary shadow-md"
                  : "border border-white/25 bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* KPI cards */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index }}
            whileHover={{ y: -4 }}
            className={`relative overflow-hidden rounded-[1.75rem] border border-border bg-gradient-to-br ${item.gradient} p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_16px_48px_rgba(124,58,237,0.12)] dark:border-white/5`}
          >
            <span className="absolute -right-2 -top-3 text-7xl font-black text-foreground/3 select-none">{index + 1}</span>
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${item.iconBg} mb-4`}>
              <item.icon className={`h-5 w-5 ${item.iconColor}`} />
            </div>
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="mt-1.5 text-3xl font-bold">{item.value}</p>
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          {activeTab === "overview" ? (
            <>
              <Card>
                <div className="mb-4">
                  <h2 className="text-xl font-semibold">Revenue trend</h2>
                  <p className="text-sm text-muted-foreground">Paid order revenue over recent months.</p>
                </div>
                <div className="mt-6 flex h-64 items-end gap-3 md:gap-4 overflow-hidden rounded-2xl border border-border/70 bg-muted/20 p-4">
                  {analytics.monthlyRevenue.length ? (
                    analytics.monthlyRevenue.map((item) => (
                      <div key={item.label} className="flex flex-1 flex-col items-center gap-3">
                        <div
                          className="w-full rounded-t-xl bg-gradient-to-t from-primary to-accent transition hover:opacity-90"
                          style={{ height: `${Math.max(item.value / 20, 24)}px` }}
                        />
                        <div className="text-center">
                          <p className="text-xs md:text-sm font-medium">{item.label}</p>
                          <p className="hidden md:block text-xs text-muted-foreground">{formatCurrency(item.value)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Revenue data will populate after paid orders arrive.</p>
                  )}
                </div>
              </Card>
              <OrderManager orders={orders} />
            </>
          ) : null}

          {activeTab === "catalog" ? (
            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <ProductManager products={products} categories={categories} />
              <CategoryManager categories={categories} products={products} />
            </div>
          ) : null}

          {activeTab === "operations" ? (
            <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
              <AccountManager accounts={accounts} products={products} />
              <OrderManager orders={orders} />
              <SupportManager tickets={tickets} />
            </div>
          ) : null}

          {activeTab === "users" ? (
            <div className="grid gap-6">
              <UserBalanceManager users={users} />
            </div>
          ) : null}

          {activeTab === "growth" ? (
            <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
              <CouponManager coupons={coupons} />
              <ReviewManager reviews={reviews} products={products} />
              <OfferManager offers={offers} />
              <Card>
                <h2 className="text-xl font-semibold">Growth snapshots</h2>
                <p className="mt-1 text-sm text-muted-foreground">Track tactical levers influencing conversion.</p>
                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-border/80 p-4 bg-muted/20">
                    <p className="text-sm text-muted-foreground">Featured products</p>
                    <p className="mt-1 text-2xl font-semibold">{products.filter((item) => item.featured).length}</p>
                  </div>
                  <div className="rounded-2xl border border-border/80 p-4 bg-muted/20">
                    <p className="text-sm text-muted-foreground">Active discount codes</p>
                    <p className="mt-1 text-2xl font-semibold">{coupons.filter((item) => item.active).length}</p>
                  </div>
                  <div className="rounded-2xl border border-border/80 p-4 bg-muted/20">
                    <p className="text-sm text-muted-foreground">Credential pools at capacity</p>
                    <p className="mt-1 text-2xl font-semibold">
                      {accounts.filter((item) => item.activeUsers >= item.maxUsers).length}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
