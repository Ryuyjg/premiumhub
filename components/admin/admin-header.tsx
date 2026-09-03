"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, LogOut, ArrowLeft } from "lucide-react";

export function AdminHeader() {
  const router = useRouter();

  async function handleSignOut() {
    document.cookie = "ott_admin=; path=/; max-age=0";
    if (typeof window !== "undefined") {
      localStorage.removeItem("ott_admin");
    }
    await fetch("/api/auth/session", { method: "DELETE" }).catch(() => {});
    router.replace("/admin-login");
    router.refresh();
  }

  return (
    <div className="mb-8 rounded-[2rem] border border-slate-800 bg-slate-900 p-5 shadow-xl backdrop-blur-xl text-white">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-blue-400">Admin Workspace</p>
            <p className="text-lg font-black tracking-tight text-white">Store Operations & Catalog Control</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/" className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-5 text-sm font-bold text-white transition hover:bg-slate-700">
            <ArrowLeft className="h-4 w-4" />
            Back to store
          </Link>
          <button type="button" onClick={handleSignOut} className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-500 shadow-md">
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
