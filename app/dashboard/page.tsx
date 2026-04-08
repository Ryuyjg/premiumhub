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
      <div className="section-shell mb-8 p-6 md:p-7">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Customer workspace</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">Everything in one account area</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Review orders, delivery details, renewals, and support history from a single workspace built for clean follow-up.
        </p>
      </div>
      <DashboardOverview user={user} subscriptions={subscriptions} orders={orders} tickets={tickets} />
    </div>
  );
}
