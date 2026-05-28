"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, Boxes, FileText, Layers, ShieldCheck, TicketPercent, Users2, Wallet } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
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
  SitePage,
  SupportChannel,
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
import { SiteContentManager } from "@/components/admin/site-content-manager";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

const tabs = [
  { id: "overview", label: "Overview", icon: Layers },
  { id: "category", label: "Category", icon: Boxes },
  { id: "products", label: "Product Management", icon: ShieldCheck },
  { id: "offers", label: "Offers", icon: TicketPercent },
  { id: "settings", label: "Settings", icon: FileText },
  { id: "users", label: "Users", icon: Users2 },
  { id: "coupons", label: "Coupons", icon: Wallet },
  { id: "support", label: "Support Requests", icon: BarChart3 }
] as const;

type TabId = (typeof tabs)[number]["id"];
const TAB_QUERY_KEY = "tab";
const ACTIVE_TAB_STORAGE_KEY = "ott-shop-admin-active-tab";

function isValidAdminTab(value: string | null): value is TabId {
  return Boolean(value && tabs.some((tab) => tab.id === value));
}

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
  offers = [],
  sitePages,
  supportChannels
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
  sitePages: SitePage[];
  supportChannels: SupportChannel[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabId>(() => {
    if (typeof window === "undefined") {
      return "overview";
    }

    const urlTab = new URLSearchParams(window.location.search).get(TAB_QUERY_KEY);
    if (isValidAdminTab(urlTab)) {
      return urlTab;
    }

    const storedTab = window.localStorage.getItem(ACTIVE_TAB_STORAGE_KEY);
    return isValidAdminTab(storedTab) ? storedTab : "overview";
  });
  const [resettingCatalog, setResettingCatalog] = useState(false);
  const [confirmResetCatalog, setConfirmResetCatalog] = useState(false);

  useEffect(() => {
    const queryTab = searchParams.get(TAB_QUERY_KEY);
    if (isValidAdminTab(queryTab) && queryTab !== activeTab) {
      setActiveTab(queryTab);
      return;
    }

    if (!queryTab && typeof window !== "undefined") {
      const storedTab = window.localStorage.getItem(ACTIVE_TAB_STORAGE_KEY);
      if (isValidAdminTab(storedTab) && storedTab !== activeTab) {
        setActiveTab(storedTab);
      }
    }
  }, [searchParams, activeTab]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(ACTIVE_TAB_STORAGE_KEY, activeTab);

    const params = new URLSearchParams(window.location.search);
    if (params.get(TAB_QUERY_KEY) === activeTab) {
      return;
    }
    params.set(TAB_QUERY_KEY, activeTab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [activeTab, pathname, router]);

  function handleTabChange(tab: TabId) {
    setActiveTab(tab);
  }

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
    { icon: Wallet, label: "Total Revenue", value: formatCurrency(analytics.revenue), gradient: "from-primary/20 to-accent/10", iconBg: "bg-primary/15", iconColor: "text-primary" },
    { icon: BarChart3, label: "Total Orders", value: String(analytics.orders), gradient: "from-emerald-500/15 to-teal-500/8", iconBg: "bg-emerald-500/10", iconColor: "text-emerald-500" },
    { icon: Users2, label: "Active Users", value: String(analytics.activeUsers), gradient: "from-emerald-500/15 to-teal-500/8", iconBg: "bg-emerald-500/10", iconColor: "text-emerald-500" },
    { icon: TicketPercent, label: "Live Subscriptions", value: String(analytics.activeSubscriptions), gradient: "from-amber-500/15 to-orange-500/8", iconBg: "bg-amber-500/10", iconColor: "text-amber-500" }
  ], [analytics]);

  async function handleResetCatalog() {
    try {
      setResettingCatalog(true);
      const response = await fetch("/api/admin/catalog/reset", { method: "POST" });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || "Unable to clear catalog.");
      }

      const deleted = Array.isArray(payload.results)
        ? payload.results.reduce((sum: number, item: { deleted?: number }) => sum + Number(item.deleted || 0), 0)
        : 0;

      const seededProducts = Number(payload?.seeded?.products || 0);
      const seededCategories = Number(payload?.seeded?.categories || 0);
      toast.success(`Catalog reset. ${deleted} records removed, ${seededCategories} categories and ${seededProducts} products added.`);
      setActiveTab("products");
      setConfirmResetCatalog(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to clear catalog.");
    } finally {
      setResettingCatalog(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Admin hero header */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary/90 via-accent to-[hsl(var(--gradient-mid))] p-8 md:p-10 text-white">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-white/8 blur-3xl" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "36px 36px" }} />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-widest">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              Admin control center
            </span>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Admin Dashboard</h1>
            <p className="max-w-xl text-white/75 text-sm">Manage categories, products, users, coupons, offers, settings, and support from one place.</p>
            <button
              type="button"
              onClick={() => setConfirmResetCatalog(true)}
              disabled={resettingCatalog}
              className="inline-flex h-10 items-center justify-center rounded-full bg-white px-5 text-sm font-bold text-primary transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {resettingCatalog ? "Resetting catalog..." : "Reset catalog with starter products"}
            </button>
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
              onClick={() => handleTabChange(tab.id)}
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
            className={`relative overflow-hidden rounded-[1.75rem] border border-border bg-gradient-to-br ${item.gradient} p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_16px_48px_rgba(13,148,136,0.16)] dark:border-white/5`}
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

          {activeTab === "category" ? (
            <CategoryManager categories={categories} products={products} />
          ) : null}

          {activeTab === "products" ? (
            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <ProductManager products={products} categories={categories} />
              <AccountManager accounts={accounts} products={products} />
            </div>
          ) : null}

          {activeTab === "offers" ? (
            <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
              <OfferManager offers={offers} />
              <ReviewManager reviews={reviews} products={products} />
            </div>
          ) : null}

          {activeTab === "settings" ? (
            <SiteContentManager pages={sitePages} supportChannels={supportChannels} />
          ) : null}

          {activeTab === "users" ? (
            <UserBalanceManager users={users} />
          ) : null}

          {activeTab === "coupons" ? (
            <CouponManager coupons={coupons} />
          ) : null}

          {activeTab === "support" ? (
            <SupportManager tickets={tickets} />
          ) : null}
        </motion.div>
      </AnimatePresence>

      <ConfirmDialog
        open={confirmResetCatalog}
        title="Reset catalog with starter products?"
        description="This will delete products, categories, offers, coupons, reviews, account pools, and old gateway transaction data, then add 10 starter products to every category."
        confirmLabel="Yes, reset catalog"
        cancelLabel="No"
        busy={resettingCatalog}
        onCancel={() => setConfirmResetCatalog(false)}
        onConfirm={() => void handleResetCatalog()}
      />
    </div>
  );
}

