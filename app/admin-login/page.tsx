import Link from "next/link";
import { AdminLoginCard } from "@/components/admin/admin-login-card";

export default function AdminLoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden py-10">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -left-32 -top-32 h-[600px] w-[600px] rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-[500px] w-[500px] rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container grid min-h-[calc(100vh-5rem)] items-center gap-10 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-[2rem] border border-border/55 bg-white/70 p-7 shadow-[0_22px_58px_rgba(2,6,23,0.05)] backdrop-blur-xl dark:bg-white/4 lg:p-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Restricted area</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight xl:text-5xl">
            Admin tools stay separate from the
            <span className="gradient-text block">customer experience.</span>
          </h1>
          <p className="mt-4 max-w-lg text-lg leading-8 text-muted-foreground">
            Use this page only for catalog, orders, offers, users, and support management. Customers should use the standard account login.
          </p>
          <Link href="/login" className="btn-ghost mt-7 inline-flex">
            Go to customer login
          </Link>
        </div>

        <div className="flex justify-center lg:justify-end">
          <AdminLoginCard />
        </div>
      </div>
    </div>
  );
}
