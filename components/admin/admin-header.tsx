"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, LogOut, ArrowLeft } from "lucide-react";

export function AdminHeader() {
  const router = useRouter();

  async function handleSignOut() {
    await fetch("/api/auth/session", { method: "DELETE" });
    router.replace("/admin-login");
    router.refresh();
  }

  return (
    <div className="mb-8 rounded-[2rem] border border-border/55 bg-white/72 p-5 shadow-[0_20px_50px_rgba(2,6,23,0.05)] backdrop-blur-xl dark:bg-white/4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/20">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Admin workspace</p>
            <p className="text-lg font-black tracking-tight">Store operations and catalog control</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/" className="btn-ghost h-11 px-5">
            <ArrowLeft className="h-4 w-4" />
            Back to store
          </Link>
          <button type="button" onClick={handleSignOut} className="btn-primary h-11 px-5">
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
