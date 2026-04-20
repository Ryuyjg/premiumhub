import Link from "next/link";
import { AdminLoginCard } from "@/components/admin/admin-login-card";

export default function AdminLoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden py-10">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -left-32 -top-32 h-[600px] w-[600px] rounded-full bg-primary/12 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-[500px] w-[500px] rounded-full bg-[rgb(245,158,11)]/10 blur-3xl" />
      </div>

      <div className="container grid min-h-[calc(100vh-5rem)] items-center gap-10 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-[2rem] border border-amber-500/25 bg-[linear-gradient(170deg,rgba(22,22,24,0.98),rgba(12,12,13,0.95))] p-7 shadow-[0_24px_58px_rgba(0,0,0,0.45)] backdrop-blur-xl lg:p-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">Restricted area</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight xl:text-5xl">
            Admin tools stay separate from the
            <span className="gradient-text-warm block">customer experience.</span>
          </h1>
          <p className="mt-4 max-w-lg text-lg leading-8 text-zinc-300">
            Use this page only for catalog, orders, offers, users, and support management. Customers should use the standard account login.
          </p>
          <Link
            href="/login"
            className="mt-7 inline-flex h-12 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 px-6 text-sm font-semibold text-amber-100 transition-all hover:bg-amber-500/20"
          >
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
