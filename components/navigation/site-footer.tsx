import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { Twitter, Github, Instagram, Mail, Shield, Zap, HeadphonesIcon, ArrowUpRight } from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "Browse Plans", href: "/products" },
    { label: "My Dashboard", href: "/dashboard" },
    { label: "Cart", href: "/cart" },
    { label: "Login", href: "/login" }
  ],
  Support: [
    { label: "Help Center", href: "/dashboard" },
    { label: "Contact Us", href: "/dashboard" },
    { label: "Refund Policy", href: "/" },
    { label: "Terms of Use", href: "/" }
  ],
  Services: [
    { label: "Netflix", href: "/products" },
    { label: "Disney+", href: "/products" },
    { label: "Prime Video", href: "/products" },
    { label: "All Plans", href: "/products" }
  ]
};

const socials = [
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Github, label: "GitHub", href: "#" },
  { icon: Mail, label: "Email", href: "#" }
];

const trustBadges = [
  { icon: Shield, label: "SSL Secured" },
  { icon: Zap, label: "Instant Delivery" },
  { icon: HeadphonesIcon, label: "24/7 Support" }
];

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-border/40 bg-gradient-to-b from-transparent to-muted/30">
      <div className="border-b border-border/35">
        <div className="container grid gap-3 py-5 md:grid-cols-4 md:items-center">
          {trustBadges.map((badge) => (
            <div key={badge.label} className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <badge.icon className="h-4 w-4 text-primary" />
              <span className="font-semibold">{badge.label}</span>
            </div>
          ))}
          <p className="text-sm text-muted-foreground md:text-right">
            Payments secured by <span className="font-semibold text-foreground">USDT Gateway</span>
          </p>
        </div>
      </div>

      <div className="container py-14">
        <div className="grid gap-10 rounded-[2rem] border border-border/50 bg-white/65 p-8 shadow-[0_20px_60px_rgba(2,6,23,0.06)] backdrop-blur-xl dark:bg-white/4 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="space-y-5">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/25">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-lg font-black tracking-tight">{APP_NAME}</p>
                <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Digital subscription commerce</p>
              </div>
            </Link>

            <p className="max-w-sm text-sm leading-7 text-muted-foreground">
              Built for premium OTT and digital plans with instant delivery flows, secure checkout, and customer-first support operations.
            </p>

            <div className="flex items-center gap-2.5">
              {socials.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-white/70 text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-primary dark:bg-white/5"
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
          <p>Built for OTT resellers and digital product teams</p>
        </div>
      </div>
    </footer>
  );
}

