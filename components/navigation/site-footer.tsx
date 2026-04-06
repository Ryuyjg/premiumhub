import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { Twitter, Github, Instagram, Mail, Shield, Zap, HeadphonesIcon } from "lucide-react";

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
    <footer className="border-t border-border/40 bg-muted/20">
      {/* Trust bar */}
      <div className="border-b border-border/30">
        <div className="container flex flex-wrap items-center justify-center gap-8 py-5 md:justify-between">
          {trustBadges.map((badge) => (
            <div key={badge.label} className="flex items-center gap-2 text-sm text-muted-foreground">
              <badge.icon className="h-4 w-4 text-primary" />
              <span className="font-medium">{badge.label}</span>
            </div>
          ))}
          <p className="text-sm text-muted-foreground">
            🔒 Payments secured by{" "}
            <span className="font-semibold text-foreground">Razorpay</span>
          </p>
        </div>
      </div>

      <div className="container py-14">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="space-y-5">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold">{APP_NAME}</span>
            </Link>
            <p className="max-w-xs text-sm leading-6 text-muted-foreground">
              Premium OTT subscription commerce. Automated delivery, secure payments, and a delightful SaaS-grade experience.
            </p>
            <div className="flex items-center gap-3">
              {socials.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-white/60 text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary dark:bg-white/4"
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-foreground/60">{section}</p>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 text-xs text-muted-foreground md:flex-row">
          <p>{APP_NAME} © {new Date().getFullYear()}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <span className="text-rose-500">♥</span> for OTT resellers across India
          </p>
        </div>
      </div>
    </footer>
  );
}
