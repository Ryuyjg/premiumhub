import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 py-10">
      <div className="container flex flex-col gap-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>{APP_NAME} © 2026. Secure subscription commerce infrastructure for OTT brands.</p>
        <div className="flex gap-5">
          <Link href="/products">Plans</Link>
          <Link href="/dashboard">Dashboard</Link>
        </div>
      </div>
    </footer>
  );
}
