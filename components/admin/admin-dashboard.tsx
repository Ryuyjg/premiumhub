"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, Boxes, Layers, ShieldCheck, TicketPercent, Users2, Wallet } from "lucide-react";
import type { AnalyticsSummary, Category, Coupon, Order, OttAccount, Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ProductManager } from "@/components/admin/product-manager";
import { CouponManager } from "@/components/admin/coupon-manager";
import { AccountManager } from "@/components/admin/account-manager";
import { CategoryManager } from "@/components/admin/category-manager";
import { OrderManager } from "@/components/admin/order-manager";

const tabs = [
  { id: "overview", label: "Overview", icon: Layers },
  { id: "catalog", label: "Catalog", icon: Boxes },
  { id: "operations", label: "Operations", icon: ShieldCheck },
  { id: "growth", label: "Growth", icon: TicketPercent }
] as const;

type TabId = (typeof tabs)[number]["id"];

export function AdminDashboard({
  analytics,
  products,
  orders,
  coupons,
  accounts,
  categories
}: {
  analytics: AnalyticsSummary;
  products: Product[];
  orders: Order[];
  coupons: Coupon[];
  accounts: OttAccount[];
  categories: Category[];
}) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const paidOrders = useMemo(() => orders.filter((order) => order.status === "paid").length, [orders]);
  const failedOrders = useMemo(() => orders.filter((order) => order.status === "failed").length, [orders]);

  return (
    <div className="space-y-8">
      <section className="surface relative overflow-hidden rounded-[2rem] p-6 md:p-8">
        <div className="absolute -right-16 -top-14 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex flex-col gap-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Enterprise command center</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                Operate catalog, payments, and delivery with precision.
              </h1>
              <p className="mt-3 max-w-3xl text-muted-foreground">
                Structured workflows, tighter data density, and smoother motion for faster admin decisions.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-border/70 bg-white/70 px-4 py-3 dark:bg-white/5">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Payment health</p>
                <p className="mt-1 font-semibold">
                  {paidOrders} paid / {failedOrders} failed
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-white/70 px-4 py-3 dark:bg-white/5">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Account pools</p>
                <p className="mt-1 font-semibold">{accounts.length} managed</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={activeTab === tab.id ? "pill-filter-active" : "pill-filter"}
              >
                <span className="inline-flex items-center gap-2">
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: Wallet, label: "Revenue", value: formatCurrency(analytics.revenue) },
          { icon: BarChart3, label: "Orders", value: String(analytics.orders) },
          { icon: Users2, label: "Active users", value: String(analytics.activeUsers) },
          { icon: TicketPercent, label: "Live subscriptions", value: String(analytics.activeSubscriptions) }
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index }}
          >
            <Card className="surface-interactive">
              <item.icon className="h-5 w-5 text-primary" />
              <p className="mt-5 text-sm text-muted-foreground">{item.label}</p>
              <p className="mt-2 text-3xl font-semibold">{item.value}</p>
            </Card>
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
                <h2 className="text-xl font-semibold">Revenue trend</h2>
                <p className="mt-1 text-sm text-muted-foreground">Paid order revenue over recent months.</p>
                <div className="mt-6 flex h-64 items-end gap-4 overflow-hidden rounded-2xl border border-border/70 bg-muted/30 p-4">
                  {analytics.monthlyRevenue.length ? (
                    analytics.monthlyRevenue.map((item) => (
                      <div key={item.label} className="flex flex-1 flex-col items-center gap-3">
                        <div
                          className="w-full rounded-t-3xl bg-gradient-to-t from-primary to-accent transition hover:opacity-90"
                          style={{ height: `${Math.max(item.value / 20, 24)}px` }}
                        />
                        <div className="text-center">
                          <p className="text-sm font-medium">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{formatCurrency(item.value)}</p>
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
              <ProductManager products={products} />
              <CategoryManager categories={categories} />
            </div>
          ) : null}

          {activeTab === "operations" ? (
            <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
              <AccountManager accounts={accounts} products={products} />
              <OrderManager orders={orders} />
            </div>
          ) : null}

          {activeTab === "growth" ? (
            <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
              <CouponManager coupons={coupons} />
              <Card>
                <h2 className="text-xl font-semibold">Growth snapshots</h2>
                <p className="mt-1 text-sm text-muted-foreground">Track tactical levers influencing conversion.</p>
                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-border/80 p-4">
                    <p className="text-sm text-muted-foreground">Featured products</p>
                    <p className="mt-1 text-2xl font-semibold">{products.filter((item) => item.featured).length}</p>
                  </div>
                  <div className="rounded-2xl border border-border/80 p-4">
                    <p className="text-sm text-muted-foreground">Active discount codes</p>
                    <p className="mt-1 text-2xl font-semibold">{coupons.filter((item) => item.active).length}</p>
                  </div>
                  <div className="rounded-2xl border border-border/80 p-4">
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
