import { AdminHeader } from "@/components/admin/admin-header";
import { AdminGuard } from "@/components/admin/admin-guard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="relative py-10 md:py-14">
        <div className="admin-grid-bg pointer-events-none absolute inset-0 opacity-35" />
        <div className="container relative">
          <AdminHeader />
          {children}
        </div>
      </div>
    </AdminGuard>
  );
}
