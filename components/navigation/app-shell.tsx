"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { CommandPalette } from "@/components/navigation/command-palette";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { SiteFooter } from "@/components/navigation/site-footer";
import { SiteHeader } from "@/components/navigation/site-header";
import { SupportFloat } from "@/components/navigation/support-float";
import { DEFAULT_SITE_PAGES, DEFAULT_SUPPORT_CHANNELS } from "@/lib/site-content-defaults";
import type { SupportChannel } from "@/types";

type FooterPageLink = {
  id: string;
  slug: string;
  label: string;
  footerGroup: "company" | "policies";
  order: number;
};

function isAdminWorkspace(pathname: string) {
  return pathname === "/admin-login" || pathname === "/admin" || pathname.startsWith("/admin/");
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const adminWorkspace = isAdminWorkspace(pathname);
  const [sitePages, setSitePages] = useState<FooterPageLink[]>(
    DEFAULT_SITE_PAGES.map((page) => ({
      id: page.slug,
      slug: page.slug,
      label: page.label,
      footerGroup: page.footerGroup,
      order: page.order
    }))
  );
  const [supportChannels, setSupportChannels] = useState<SupportChannel[]>(
    DEFAULT_SUPPORT_CHANNELS.map((channel, index) => ({
      id: `default-${index + 1}`,
      ...channel
    }))
  );

  useEffect(() => {
    let active = true;

    async function loadSiteContent() {
      try {
        const response = await fetch("/api/site-content", { cache: "no-store" });
        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as {
          pages?: FooterPageLink[];
          supportChannels?: SupportChannel[];
        };

        if (!active) {
          return;
        }

        if (Array.isArray(payload.pages) && payload.pages.length) {
          setSitePages(payload.pages);
        }

        if (Array.isArray(payload.supportChannels)) {
          setSupportChannels(payload.supportChannels);
        }
      } catch {
        // Keep the seeded fallback links if loading fails.
      }
    }

    loadSiteContent();

    return () => {
      active = false;
    };
  }, []);

  if (adminWorkspace) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <SiteHeader />
      <CommandPalette />
      <main className="min-h-screen">{children}</main>
      <SupportFloat supportChannels={supportChannels} />
      <MobileNav />
      <SiteFooter pages={sitePages} supportChannels={supportChannels} />
    </>
  );
}
