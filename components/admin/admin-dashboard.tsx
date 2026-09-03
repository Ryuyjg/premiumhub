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

import {
  CATALOG_UPDATED_EVENT,
  getStoredCategories,
  getStoredProducts,
  resetStoredCatalog
} from "@/lib/client-catalog";

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
  products = [],
  orders = [],
  coupons = [],
  accounts = [],
  categories = [],
  users = [],
  reviews = [],
  tickets = [],
  offers = [],
  sitePages = [],
  supportChannels = []
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

  const [activeCategories, setActiveCategories] = useState<Category[]>(() =>
    getStoredCategories(categories)
  );
  const [activeProducts, setActiveProducts] = useState<Product[]>(() =>
    getStoredProducts(products)
  );

  useEffect(() => {
    function syncCatalog() {
      setActiveCategories(getStoredCategories(categories));
      setActiveProducts(getStoredProducts(products));
    }
    syncCatalog();
    window.addEventListener(CATALOG_UPDATED_EVENT, syncCatalog);
    return () => window.removeEventListener(CATALOG_UPDATED_EVENT, syncCatalog);
  }, [categories, products]);
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
    { icon: Wallet, label: "Total Revenue", value: formatCurrency(analytics.revenue), gradient: "from-blue-50 to-indigo-50/50", iconBg: "bg-blue-500/10", iconColor: "text-blue-600" },
    { icon: BarChart3, label: "Total Orders", value: String(analytics.orders), gradient: "from-emerald-50 to-teal-50/50", iconBg: "bg-emerald-500/10", iconColor: "text-emerald-600" },
    { icon: Users2, label: "Active Users", value: String(analytics.activeUsers), gradient: "from-emerald-50 to-teal-50/50", iconBg: "bg-emerald-500/10", iconColor: "text-emerald-600" },
    { icon: TicketPercent, label: "Live Subscriptions", value: String(analytics.activeSubscriptions), gradient: "from-amber-50 to-orange-50/50", iconBg: "bg-amber-500/10", iconColor: "text-amber-600" }
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
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 md:p-10 text-white shadow-2xl border border-slate-800">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "36px 36px" }} />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 border border-blue-400/30 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-blue-300">
              <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
              Admin Control Center
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">Admin Dashboard</h1>
            <p className="max-w-xl text-slate-300 text-sm leading-relaxed">Manage categories, products, users, coupons, offers, settings, and support from one place.</p>
            <button
              type="button"
              onClick={() => setConfirmResetCatalog(true)}
              disabled={resettingCatalog}
              className="inline-flex h-10 items-center justify-center rounded-full bg-white px-5 text-sm font-bold text-slate-900 transition hover:bg-slate-100 shadow-md disabled:cursor-not-allowed disabled:opacity-70"
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
              <div key={s.label} className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md">
                <p className="text-[10px] uppercase font-bold tracking-widest text-indigo-200">{s.label}</p>
                <p className="mt-1 font-black text-sm text-white">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Tab bar */}
        <div className="relative mt-8 flex flex-wrap gap-2 pt-4 border-t border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-white text-slate-950 shadow-lg scale-[1.02]"
                  : "border border-white/20 bg-white/10 text-slate-100 hover:bg-white/20"
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
            className={`relative overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md`}
          >
            <span className="absolute -right-2 -top-3 text-7xl font-black text-slate-900/5 select-none">{index + 1}</span>
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${item.iconBg} mb-4`}>
              <item.icon className={`h-5 w-5 ${item.iconColor}`} />
            </div>
            <p className="text-sm font-semibold text-slate-600">{item.label}</p>
            <p className="mt-1.5 text-3xl font-extrabold text-slate-900">{item.value}</p>
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "overview" && (
            <div className="grid gap-8 lg:grid-cols-2">
              <OrderManager orders={orders} />
              <AccountManager accounts={accounts} products={activeProducts} />
            </div>
          )}

          {activeTab === "category" && <CategoryManager categories={activeCategories} products={activeProducts} />}

          {activeTab === "products" && <ProductManager products={activeProducts} categories={activeCategories} />}

          {activeTab === "offers" && <OfferManager offers={offers} products={activeProducts} categories={activeCategories} />}

          {activeTab === "settings" && <SiteContentManager initialPages={sitePages} initialChannels={supportChannels} />}

          {activeTab === "users" && (
            <div className="space-y-8">
              <UserBalanceManager users={users} />
              <ReviewManager reviews={reviews} products={activeProducts} />
            </div>
          )}

          {activeTab === "coupons" && <CouponManager coupons={coupons} products={activeProducts} categories={activeCategories} />}

          {activeTab === "support" && <SupportManager tickets={tickets} />}
        </motion.div>
      </AnimatePresence>

      <ConfirmDialog
        open={confirmResetCatalog}
        onOpenChange={setConfirmResetCatalog}
        title="Reset Catalog to Starter Items?"
        description="This will clear current product and category tables and seed standard products and categories. Are you sure you want to proceed?"
        confirmLabel="Reset Catalog"
        danger
        onConfirm={handleResetCatalog}
      />
    </div>
  );
}
