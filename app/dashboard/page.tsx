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
      <DashboardOverview user={user} subscriptions={subscriptions} orders={orders} tickets={tickets} />
    </div>
  );
}
