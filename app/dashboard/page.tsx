import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { getOrdersForUser, getSubscriptionsForUser } from "@/lib/db";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser();
  const [subscriptions, orders] = await Promise.all([
    getSubscriptionsForUser(user.id).catch(() => []),
    getOrdersForUser(user.id).catch(() => [])
  ]);

  return (
    <div className="container py-16">
      <DashboardOverview user={user} subscriptions={subscriptions} orders={orders} />
    </div>
  );
}
