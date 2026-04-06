"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { APP_NAME, NAV_LINKS } from "@/lib/constants";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/20 bg-background/65 backdrop-blur-2xl">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          {APP_NAME}
        </Link>
        <nav className="hidden items-center gap-2 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-full px-4 py-2 text-sm transition ${
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {active ? (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full border border-primary/20 bg-primary/10"
                  />
                ) : null}
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/login"
            className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 md:inline-flex"
          >
            Sign in
          </Link>
          <button
            type="button"
            onClick={() => setOpen((state) => !state)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/80 bg-white/75 text-foreground md:hidden dark:bg-white/5"
            aria-label="Toggle mobile menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="border-t border-border/70 bg-background/90 px-5 py-4 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl border border-border/70 px-4 py-2 text-sm"
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/login" onClick={() => setOpen(false)} className="rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white">
                Sign in
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
