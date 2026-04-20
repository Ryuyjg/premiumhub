import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import type { SupportChannel } from "@/types";

const exploreLinks = [
  { label: "Browse catalog", href: "/products" },
  { label: "My account", href: "/dashboard" },
  { label: "Cart", href: "/cart" },
  { label: "Sign in", href: "/login" }
];

export function SiteFooter({
  pages: _pages,
  supportChannels
}: {
  pages: {
    id: string;
    slug: string;
    label: string;
    footerGroup: "company" | "policies";
    order: number;
  }[];
  supportChannels: SupportChannel[];
}) {
  const _supportChannels = supportChannels;

  return (
    <footer className="mt-14 border-t border-border/45 bg-gradient-to-b from-transparent to-muted/35">
      <div className="container py-10">
        <div className="section-shell grid gap-6 px-6 py-8 md:px-8">
          <div className="space-y-4">
            <p className="text-xs font-black uppercase tracking-[0.15em] text-foreground/65">Explore</p>
            <ul className="space-y-2.5">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-7 border-t border-border/45 pt-6 text-xs text-muted-foreground">
          <p>{APP_NAME} Copyright {new Date().getFullYear()}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
