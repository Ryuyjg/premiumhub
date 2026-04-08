import Link from "next/link";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import { ArrowUpRight, HeadphonesIcon, Mail, MessageCircle, Send, Shield, ShieldCheck, Sparkles } from "lucide-react";
import { getSupportChannelIconType } from "@/lib/site-content-defaults";
import type { SupportChannel } from "@/types";

type FooterPageLink = {
  id: string;
  slug: string;
  label: string;
  footerGroup: "company" | "policies";
  order: number;
};

const exploreLinks = [
  { label: "Browse catalog", href: "/products" },
  { label: "My account", href: "/dashboard" },
  { label: "Cart", href: "/cart" },
  { label: "Sign in", href: "/login" }
];

const trustBadges = [
  { icon: Shield, label: "Owner-managed catalog" },
  { icon: ShieldCheck, label: "Protected sessions" },
  { icon: Sparkles, label: "Direct support channels" }
];

function getChannelIcon(channel: Pick<SupportChannel, "title" | "href">) {
  const iconType = getSupportChannelIconType(channel);

  if (iconType === "whatsapp") {
    return MessageCircle;
  }
  if (iconType === "telegram") {
    return Send;
  }
  if (iconType === "mail") {
    return Mail;
  }
  return HeadphonesIcon;
}

export function SiteFooter({
  pages,
  supportChannels
}: {
  pages: FooterPageLink[];
  supportChannels: SupportChannel[];
}) {
  const companyLinks = pages
    .filter((page) => page.footerGroup === "company")
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
    .map((page) => ({ label: page.label, href: `/${page.slug}` }));

  const policyLinks = pages
    .filter((page) => page.footerGroup === "policies")
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
    .map((page) => ({ label: page.label, href: `/${page.slug}` }));

  const socialLinks = supportChannels.filter((channel) => channel.active).slice(0, 3);

  return (
    <footer className="mt-12 border-t border-border/40 bg-gradient-to-b from-transparent to-muted/35">
      <div className="border-b border-border/35">
        <div className="container grid gap-3 py-5 md:grid-cols-4 md:items-center">
          {trustBadges.map((badge) => (
            <div key={badge.label} className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <badge.icon className={`h-4 w-4 ${badge.label === "Direct support channels" ? "text-success" : "text-primary"}`} />
              <span className="font-semibold">{badge.label}</span>
            </div>
          ))}
          <p className="text-sm text-muted-foreground md:text-right">
            Product pages, legal pages, and support links can now be updated from admin.
          </p>
        </div>
      </div>

      <div className="container py-14">
        <div className="section-shell grid gap-10 p-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="space-y-5">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-foreground via-[hsl(var(--gradient-start))] to-primary shadow-[0_12px_24px_rgba(15,23,42,0.14)]">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-lg font-black tracking-tight">{APP_NAME}</p>
                <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{APP_TAGLINE}</p>
              </div>
            </Link>

            <p className="max-w-sm text-sm leading-7 text-muted-foreground">
              Built for curated digital access, software, subscriptions, and private offers with full control over what goes live and how delivery is handled.
            </p>

            <div className="flex items-center gap-2.5">
              {socialLinks.map((channel) => {
                const Icon = getChannelIcon(channel);
                return (
                  <Link
                    key={channel.id}
                    href={channel.href}
                    aria-label={channel.title}
                    className="control-surface flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-primary"
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                );
              })}
              {socialLinks.length === 0 ? (
                <Link
                  href="/support-channels"
                  aria-label="Support channels"
                  className="control-surface flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-primary"
                >
                  <HeadphonesIcon className="h-4 w-4" />
                </Link>
              ) : null}
            </div>

            <Link href="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              Explore catalog <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

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

          <div className="space-y-4">
            <p className="text-xs font-black uppercase tracking-[0.15em] text-foreground/65">Company</p>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-black uppercase tracking-[0.15em] text-foreground/65">Policies</p>
            <ul className="space-y-2.5">
              {policyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border/40 pt-6 text-xs text-muted-foreground md:flex-row">
          <p>
            {APP_NAME} Copyright {new Date().getFullYear()}. All rights reserved.
          </p>
          <p>Manual catalog, editable footer content, and human support built in.</p>
        </div>
      </div>
    </footer>
  );
}
