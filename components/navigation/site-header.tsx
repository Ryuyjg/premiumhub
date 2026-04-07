"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShoppingCart, X, Zap, Sparkles } from "lucide-react";
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
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        if (!response.ok) {
          if (!cancelled) {
            setSessionAuthenticated(false);
            setCheckingSession(false);
          }
          return;
        }
        const payload = (await response.json()) as { authenticated?: boolean };
        if (!cancelled) {
          setSessionAuthenticated(Boolean(payload.authenticated));
          setCheckingSession(false);
        }
      } catch {
        if (!cancelled) {
          setSessionAuthenticated(false);
          setCheckingSession(false);
        }
      }
    }

    checkSession();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const isLoggedIn = Boolean(user) || sessionAuthenticated || isAdminRoute;
  const authLoading = loading || checkingSession;

  async function handleSignOut() {
    await fetch("/api/auth/session", { method: "DELETE" });
    const auth = getClientAuth();
    if (auth) await signOut(auth);
    setOpen(false);
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40">
      <div className="border-b border-border/30 bg-gradient-to-r from-primary/10 via-transparent to-accent/10">
        <div className="container flex h-8 items-center justify-between text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-primary" />
            Instant delivery platform
          </span>
          <span className="hidden sm:inline">Secure checkout and real support</span>
        </div>
      </div>

      <div
        className={`transition-all duration-300 ${
          scrolled
            ? "border-b border-border/40 bg-background/86 shadow-[0_10px_40px_rgba(2,6,23,0.08)] backdrop-blur-2xl"
            : "border-b border-transparent bg-background/62 backdrop-blur-xl"
        }`}
      >
        <div className="container flex h-[4.75rem] items-center justify-between gap-4">
          <Link href="/" className="group inline-flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-black tracking-tight">{APP_NAME}</p>
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Premium subscriptions</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full border border-border/60 bg-white/70 p-1 shadow-sm dark:bg-white/5 md:flex">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {active ? (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full border border-primary/30 bg-gradient-to-r from-primary/12 to-accent/12"
                    />
                  ) : null}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              href="/cart"
              className="relative inline-flex h-10 items-center gap-2 rounded-full border border-border/60 bg-white/70 px-3.5 text-sm font-semibold transition-all hover:border-primary/35 hover:bg-primary/5 dark:bg-white/5"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              {hydrated && cartItemsCount > 0 ? (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                  {cartItemsCount}
                </span>
              ) : null}
            </Link>

            <ThemeToggle />

            {authLoading ? (
              <div className="hidden h-10 w-24 animate-pulse rounded-full bg-muted/60 md:block" />
            ) : isLoggedIn ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="hidden h-10 rounded-full border border-border/60 bg-white/70 px-5 text-sm font-semibold text-foreground transition-all hover:border-rose-500/35 hover:bg-rose-500/8 hover:text-rose-600 md:inline-flex dark:bg-white/5"
              >
                Sign out
              </button>
            ) : (
              <Link
                href="/login"
                className="hidden h-10 items-center rounded-full bg-gradient-to-r from-primary to-accent px-5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-xl md:inline-flex"
              >
                Sign in
              </Link>
            )}

            <button
              type="button"
              onClick={() => setOpen((s) => !s)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-white/70 text-foreground transition-all hover:border-primary/35 md:hidden dark:bg-white/5"
              aria-label="Toggle menu"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="border-b border-border/40 bg-background/96 px-5 py-5 backdrop-blur-2xl md:hidden"
          >
            <div className="space-y-2">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${
                      active
                        ? "bg-gradient-to-r from-primary/14 to-accent/14 text-foreground"
                        : "border border-border/60 bg-white/70 text-foreground hover:bg-muted/50 dark:bg-white/5"
                    }`}
                  >
                    {link.label}
                    {active ? <span className="h-2 w-2 rounded-full bg-primary" /> : null}
                  </Link>
                );
              })}

              {!authLoading &&
                (isLoggedIn ? (
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full rounded-2xl border border-rose-500/25 bg-rose-500/8 px-4 py-3 text-left text-sm font-semibold text-rose-600"
                  >
                    Sign out
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-primary to-accent px-4 py-3 text-sm font-semibold text-white"
                  >
                    Sign in
                  </Link>
                ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
