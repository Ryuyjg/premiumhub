import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { getOrdersForUser, getSubscriptionsForUser, getSupportTicketsForUser } from "@/lib/db";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser();
  const [subscriptions, orders, tickets] = await Promise.all([
    getSubscriptionsForUser(user.id).catch(() => []),
    getOrdersForUser(user.id).catch(() => []),
    getSupportTicketsForUser(user.id).catch(() => [])
  ]);

  return (
    <div className="container py-12 md:py-16">
      <div className="mb-8 rounded-[2rem] border border-border/55 bg-white/70 p-6 shadow-[0_22px_58px_rgba(2,6,23,0.05)] backdrop-blur-xl dark:bg-white/4 md:p-7">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Client control center</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">Everything in one dashboard</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Monitor renewals, orders, credentials, and support from a single workspace optimized for quick actions.
        </p>
      </div>
      <DashboardOverview user={user} subscriptions={subscriptions} orders={orders} tickets={tickets} />
    </div>
  );
}
