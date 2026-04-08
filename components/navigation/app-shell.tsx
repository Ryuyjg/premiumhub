"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { CommandPalette } from "@/components/navigation/command-palette";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { SiteFooter } from "@/components/navigation/site-footer";
import { SiteHeader } from "@/components/navigation/site-header";
import { SupportFloat } from "@/components/navigation/support-float";

function isAdminWorkspace(pathname: string) {
  return pathname === "/admin-login" || pathname === "/admin" || pathname.startsWith("/admin/");
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const adminWorkspace = isAdminWorkspace(pathname);

  if (adminWorkspace) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <SiteHeader />
      <CommandPalette />
      <main className="min-h-screen">{children}</main>
      <SupportFloat />
      <MobileNav />
      <SiteFooter />
    </>
  );
}
