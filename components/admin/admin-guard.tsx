"use client";

import { useEffect, useState } from "react";
import { AdminLoginCard } from "@/components/admin/admin-login-card";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const isCookie = document.cookie.includes("ott_admin=true");
      const isLocal = typeof window !== "undefined" && localStorage.getItem("ott_admin") === "true";
      setAuthorized(isCookie || isLocal);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  if (authorized === null) {
    return (
      <div className="container flex min-h-[50vh] items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center py-12">
        <AdminLoginCard />
      </div>
    );
  }

  return <>{children}</>;
}
