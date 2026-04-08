"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Shield, ShoppingCart, X } from "lucide-react";
import { signOut } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { APP_NAME, APP_TAGLINE, NAV_LINKS } from "@/lib/constants";
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
      <div
        className={`transition-all duration-300 ${
          scrolled
            ? "border-b border-border/50 bg-background/88 shadow-[0_10px_34px_rgba(15,23,42,0.08)] backdrop-blur-2xl"
            : "border-b border-transparent bg-background/72 backdrop-blur-xl"
        }`}
      >
        <div className="container flex h-[4.75rem] items-center justify-between gap-4">
          <Link href="/" className="group inline-flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-foreground via-[hsl(var(--gradient-start))] to-primary shadow-[0_12px_24px_rgba(15,23,42,0.14)] transition-transform group-hover:scale-105">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-black tracking-tight">{APP_NAME}</p>
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{APP_TAGLINE}</p>
            </div>
          </Link>

          <nav className="control-surface hidden items-center gap-1 rounded-full p-1 md:flex">
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
                      className="absolute inset-0 -z-10 rounded-full border border-primary/20 bg-primary/10"
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
              className="control-surface relative inline-flex h-10 items-center gap-2 rounded-full px-3.5 text-sm font-semibold"
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
                className="control-surface hidden h-10 rounded-full px-5 text-sm font-semibold text-foreground hover:border-rose-500/28 hover:bg-rose-500/8 hover:text-rose-600 md:inline-flex"
              >
                Sign out
              </button>
            ) : (
              <Link
                href="/login"
                className="hidden h-10 items-center rounded-full bg-gradient-to-r from-foreground via-[hsl(var(--gradient-start))] to-primary px-5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(15,23,42,0.16)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(15,23,42,0.2)] md:inline-flex"
              >
                Sign in
              </Link>
            )}

            <button
              type="button"
              onClick={() => setOpen((s) => !s)}
              className="control-surface inline-flex h-10 w-10 items-center justify-center rounded-full md:hidden"
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
                        ? "bg-primary/10 text-foreground"
                        : "control-surface text-foreground hover:bg-muted/50"
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
                    className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-foreground via-[hsl(var(--gradient-start))] to-primary px-4 py-3 text-sm font-semibold text-white"
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
