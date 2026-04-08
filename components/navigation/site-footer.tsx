import Link from "next/link";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import { ArrowUpRight, Mail, MessageCircle, Send, Shield, ShieldCheck, Sparkles } from "lucide-react";

const footerLinks = {
  Explore: [
    { label: "Browse catalog", href: "/products" },
    { label: "My account", href: "/dashboard" },
    { label: "Cart", href: "/cart" },
    { label: "Sign in", href: "/login" }
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/faq" },
    { label: "Support channels", href: "/contact" }
  ],
  Policies: [
    { label: "Refund policy", href: "/refund-policy" },
    { label: "Terms of use", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
    { label: "Store FAQ", href: "/faq" }
  ]
};

const socials = [
  { icon: MessageCircle, label: "WhatsApp", href: "https://wa.me/917907102615" },
  { icon: Send, label: "Telegram", href: "https://t.me/ogdigital" },
  { icon: Mail, label: "Contact", href: "/contact" }
];

const trustBadges = [
  { icon: Shield, label: "Owner-managed catalog" },
  { icon: ShieldCheck, label: "Protected sessions" },
  { icon: Sparkles, label: "Direct support channels" }
];

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-border/40 bg-gradient-to-b from-transparent to-muted/35">
      <div className="border-b border-border/35">
        <div className="container grid gap-3 py-5 md:grid-cols-4 md:items-center">
          {trustBadges.map((badge) => (
            <div key={badge.label} className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <badge.icon className="h-4 w-4 text-primary" />
              <span className="font-semibold">{badge.label}</span>
            </div>
          ))}
          <p className="text-sm text-muted-foreground md:text-right">
            Gateway checkout can be added back later without rebuilding the store front.
          </p>
        </div>
      </div>

      <div className="container py-14">
        <div className="grid gap-10 rounded-[2rem] border border-border/70 bg-white/78 p-8 shadow-[0_20px_48px_rgba(15,23,42,0.05)] backdrop-blur-md dark:bg-white/4 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="space-y-5">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-foreground to-accent shadow-[0_12px_24px_rgba(15,23,42,0.14)]">
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
              {socials.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-white/82 text-muted-foreground transition-all hover:border-primary/24 hover:bg-primary/8 hover:text-primary dark:bg-white/5"
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>

            <Link href="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              Explore catalog <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} className="space-y-4">
              <p className="text-xs font-black uppercase tracking-[0.15em] text-foreground/65">{section}</p>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border/40 pt-6 text-xs text-muted-foreground md:flex-row">
          <p>{APP_NAME} Copyright {new Date().getFullYear()}. All rights reserved.</p>
          <p>Manual catalog, secure account area, and human support built in.</p>
        </div>
      </div>
    </footer>
  );
}
