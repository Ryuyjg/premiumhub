"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { LogIn, LogOut, Menu, MessageCircle, Settings, Shield, X } from "lucide-react";
import { signOut } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import { useAuth } from "@/components/providers/auth-provider";
import { getClientAuth } from "@/lib/firebase/client";
import { MEGA_SALES_NAV_ITEM, STARTER_CATEGORIES } from "@/lib/catalog";

const HEADER_CATEGORY_ITEMS = [...STARTER_CATEGORIES, MEGA_SALES_NAV_ITEM];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sessionAuthenticated, setSessionAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const settingsRef = useRef<HTMLDivElement | null>(null);
  const { user, loading } = useAuth();
  const isAdminRoute = pathname.startsWith("/admin");
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const nextSlug = new URLSearchParams(window.location.search).get("category");
    setActiveCategorySlug((prev) => (prev === nextSlug ? prev : nextSlug));
  }, [pathname]);

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

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setSettingsOpen(false);
      }
    }

    if (settingsOpen) {
      document.addEventListener("mousedown", handleOutsideClick as unknown as EventListener);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick as unknown as EventListener);
    };
  }, [settingsOpen]);

  function handleCategoryClick(event: MouseEvent<HTMLAnchorElement>, slug: string) {
    if (!pathname.startsWith("/products")) {
      return;
    }

    event.preventDefault();
    const nextParams = new URLSearchParams(window.location.search);
    nextParams.set("category", slug);
    const nextPath = `/products?${nextParams.toString()}`;
    setActiveCategorySlug(slug);
    window.history.pushState(null, "", nextPath);
  }

  const isLoggedIn = Boolean(user) || sessionAuthenticated || isAdminRoute;
  const authLoading = loading || checkingSession;

  async function handleSignOut() {
    await fetch("/api/auth/session", { method: "DELETE" });
    const auth = getClientAuth();
    if (auth) {
      await signOut(auth);
    }
    setOpen(false);
    setSettingsOpen(false);
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40">
      <div
        className={`border-b transition-all duration-300 ${
          scrolled
            ? "border-border/70 bg-[hsl(var(--surface)/0.98)] shadow-[0_14px_36px_rgba(0,0,0,0.36)]"
            : "border-border/40 bg-[hsl(var(--surface)/0.96)]"
        }`}
      >
        <div className="container flex h-[4.8rem] items-center justify-between gap-3">
          <Link href="/" className="group inline-flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[hsl(var(--gradient-mid))] via-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-end))] shadow-[0_14px_26px_rgba(15,23,42,0.16)] transition-transform group-hover:scale-105">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-extrabold tracking-tight">{APP_NAME}</p>
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{APP_TAGLINE}</p>
            </div>
          </Link>

          <div className="hidden flex-1 md:block" />

          <div className="flex items-center gap-2.5">
            <a
              href="https://wa.me/917012958322"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-emerald-600 px-4 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700"
            >
              <MessageCircle className="h-4 w-4 fill-white text-emerald-600" />
              <span>WhatsApp Us</span>
            </a>

            <div className="relative hidden md:block" ref={settingsRef}>
              <button
                type="button"
                onClick={() => setSettingsOpen((state) => !state)}
                className="control-surface inline-flex h-10 items-center gap-2 rounded-full px-3.5 text-sm font-semibold"
              >
                <Settings className="h-4 w-4" />
                Settings
              </button>

              {settingsOpen ? (
                <div className="absolute right-0 top-12 z-30 w-56 rounded-2xl border border-border/70 bg-[hsl(var(--surface)/0.98)] p-2 shadow-[0_18px_42px_rgba(15,23,42,0.14)]">
                  <Link
                    href="/support-channels"
                    onClick={() => setSettingsOpen(false)}
                    className="block rounded-xl px-3 py-2 text-sm text-foreground transition hover:bg-muted/60"
                  >
                    Support
                  </Link>
                  <Link
                    href="/privacy"
                    onClick={() => setSettingsOpen(false)}
                    className="block rounded-xl px-3 py-2 text-sm text-foreground transition hover:bg-muted/60"
                  >
                    Privacy policy
                  </Link>
                  <Link
                    href="/refund-policy"
                    onClick={() => setSettingsOpen(false)}
                    className="block rounded-xl px-3 py-2 text-sm text-foreground transition hover:bg-muted/60"
                  >
                    Refund policy
                  </Link>
                  <Link
                    href="/terms"
                    onClick={() => setSettingsOpen(false)}
                    className="block rounded-xl px-3 py-2 text-sm text-foreground transition hover:bg-muted/60"
                  >
                    Terms of use
                  </Link>
                  <div className="my-1 border-t border-border/60" />
                  {!authLoading &&
                    (isLoggedIn ? (
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-500/10"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    ) : (
                      <Link
                        href="/login"
                        onClick={() => setSettingsOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10"
                      >
                        <LogIn className="h-4 w-4" />
                        Login
                      </Link>
                    ))}
                </div>
              ) : null}
            </div>

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

        <div className="border-t border-border/50 bg-[hsl(var(--surface)/0.98)]">
          <div className="container no-scrollbar overflow-x-auto">
            <nav className="flex min-w-max items-center gap-6 py-2.5">
              {HEADER_CATEGORY_ITEMS.map((item) => {
                const active = pathname.startsWith("/products") && activeCategorySlug === item.slug;
                return (
                  <Link
                    key={item.slug}
                    href={`/products?category=${item.slug}`}
                    onClick={(event) => handleCategoryClick(event, item.slug)}
                    scroll={false}
                    className={`shrink-0 whitespace-nowrap border-b-2 pb-1.5 text-sm font-semibold transition-colors ${
                      active
                        ? "border-primary text-foreground"
                        : "border-transparent text-foreground/78 hover:text-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="border-b border-border/45 bg-background/96 px-5 py-5 md:hidden"
          >
            <div className="space-y-2">
              <a
                href="https://wa.me/917012958322"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm"
              >
                <span>WhatsApp Us</span>
                <MessageCircle className="h-4 w-4 fill-white text-emerald-600" />
              </a>

              <div className="mt-2 rounded-2xl border border-border/60 bg-[hsl(var(--surface)/0.94)] p-2">
                <p className="px-2 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Settings</p>
                <Link
                  href="/support-channels"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2 text-sm text-foreground transition hover:bg-muted/60"
                >
                  Support
                </Link>
                <Link
                  href="/privacy"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2 text-sm text-foreground transition hover:bg-muted/60"
                >
                  Privacy policy
                </Link>
                <Link
                  href="/refund-policy"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2 text-sm text-foreground transition hover:bg-muted/60"
                >
                  Refund policy
                </Link>
                <Link
                  href="/terms"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2 text-sm text-foreground transition hover:bg-muted/60"
                >
                  Terms of use
                </Link>
              </div>

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
                    className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[hsl(var(--gradient-mid))] via-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-end))] px-4 py-3 text-sm font-semibold text-white"
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
