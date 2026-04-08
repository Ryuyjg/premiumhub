import { requireAdmin } from "@/lib/auth";
import { AdminHeader } from "@/components/admin/admin-header";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="relative py-10 md:py-14">
      <div className="admin-grid-bg pointer-events-none absolute inset-0 opacity-35" />
      <div className="container relative">
        <AdminHeader />
        {children}
      </div>
    </div>
  );
}
