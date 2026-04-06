import { AdminDashboard } from "@/components/admin/admin-dashboard";
import {
  getAdminAnalytics,
  getAdminProducts,
  getAllOrders,
  getAllUsers,
  getCategories,
  getCoupons,
  getOttAccounts
} from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [analytics, products, orders, users, coupons, accounts, categories] = await Promise.all([
    getAdminAnalytics().catch(() => ({
      revenue: 0,
      orders: 0,
      activeUsers: 0,
      activeSubscriptions: 0,
      monthlyRevenue: []
    })),
    getAdminProducts().catch(() => []),
    getAllOrders().catch(() => []),
    getAllUsers().catch(() => []),
    getCoupons().catch(() => []),
    getOttAccounts().catch(() => []),
    getCategories().catch(() => [])
  ]);

  return (
    <AdminDashboard
      analytics={analytics}
      products={products}
      orders={orders}
      coupons={coupons}
      accounts={accounts}
      categories={categories}
      users={users}
    />
  );
}
