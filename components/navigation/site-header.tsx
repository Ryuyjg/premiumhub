"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShoppingCart, X, Zap } from "lucide-react";
import { signOut } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { APP_NAME, NAV_LINKS } from "@/lib/constants";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAppStore } from "@/store/use-app-store";
import { useAuth } from "@/components/providers/auth-provider";
import { getClientAuth } from "@/lib/firebase/client";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [sessionAuthenticated, setSessionAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const cartItemsCount = useAppStore((state) => state.cartItems.length);
  const { user, loading } = useAuth();
  const isAdminRoute = pathname.startsWith("/admin");

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        if (!response.ok) {
          if (!cancelled) { setSessionAuthenticated(false); setCheckingSession(false); }
          return;
        }
        const payload = (await response.json()) as { authenticated?: boolean };
        if (!cancelled) { setSessionAuthenticated(Boolean(payload.authenticated)); setCheckingSession(false); }
      } catch {
        if (!cancelled) { setSessionAuthenticated(false); setCheckingSession(false); }
      }
    }

    checkSession();
    return () => { cancelled = true; };
  }, [pathname]);

  const isLoggedIn = Boolean(user) || sessionAuthenticated || isAdminRoute;
  const authLoading = loading || checkingSession;

  async function handleSignOut() {
    await fetch("/api/auth/session", { method: "DELETE" });
    const auth = getClientAuth();
    if (auth) await signOut(auth);
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "border-b border-border/30 bg-background/80 shadow-sm backdrop-blur-2xl"
          : "border-b border-transparent bg-transparent backdrop-blur-xl"
      }`}
    >
      <div className="container flex h-[4.5rem] items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-md shadow-primary/25 transition-transform group-hover:scale-105">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-bold tracking-tight">{APP_NAME}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
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

        {/* Right actions */}
        <div className="flex items-center gap-2.5">
          {/* Cart */}
          <Link
            href="/cart"
            className="relative inline-flex items-center gap-2 rounded-full border border-border/60 bg-white/70 px-3.5 py-2 text-sm font-medium transition-all hover:border-primary/30 hover:bg-primary/5 dark:bg-white/5"
          >
            <ShoppingCart className="h-4 w-4" />
            {hydrated && cartItemsCount > 0 ? (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                {cartItemsCount}
              </span>
            ) : null}
            <span className="hidden sm:inline">Cart</span>
          </Link>

          <ThemeToggle />

          {/* Auth */}
          {authLoading ? (
            <div className="hidden h-9 w-20 animate-pulse rounded-full bg-muted/60 md:block" />
          ) : isLoggedIn ? (
            <button
              type="button"
              onClick={handleSignOut}
              className="hidden rounded-full border border-border/60 bg-white/70 px-5 py-2 text-sm font-semibold text-foreground transition-all hover:border-rose-500/30 hover:bg-rose-500/5 hover:text-rose-600 md:inline-flex dark:bg-white/5"
            >
              Sign out
            </button>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-full bg-gradient-to-r from-primary to-accent px-5 py-2 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/35 md:inline-flex"
            >
              Sign in
            </Link>
          )}

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setOpen((s) => !s)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-white/70 text-foreground transition-all hover:border-primary/30 md:hidden dark:bg-white/5"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="border-t border-border/40 bg-background/95 px-5 py-4 backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-2xl px-4 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "border border-border/50 text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              {!authLoading && (
                isLoggedIn ? (
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="rounded-2xl border border-rose-500/20 bg-rose-500/5 px-4 py-2.5 text-left text-sm font-semibold text-rose-600"
                  >
                    Sign out
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="rounded-2xl bg-gradient-to-r from-primary to-accent px-4 py-2.5 text-center text-sm font-semibold text-white"
                  >
                    Sign in
                  </Link>
                )
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
