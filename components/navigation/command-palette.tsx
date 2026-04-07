"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Zap, TrendingUp, X, Command } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (open && products.length === 0) {
      setLoading(true);
      fetch("/api/products/all")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setProducts(data);
        })
        .finally(() => setLoading(false));
    }
  }, [open, products.length]);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.categoryName.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  const navigate = useCallback((href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  }, [router]);

  return (
    <>
      {/* Search trigger in UI could go here, or just shortcut */}
      
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-border/60 bg-background/95 shadow-2xl shadow-primary/10 backdrop-blur-2xl mx-4"
            >
              <div className="flex items-center border-b border-border/50 px-4">
                <Search className="h-5 w-5 text-muted-foreground mr-3" />
                <input
                  autoFocus
                  placeholder="Search plans, categories, or pages..."
                  className="h-14 w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setOpen(false);
                  }}
                />
                <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border border-border/50 bg-muted px-2 text-[10px] font-medium text-muted-foreground">
                  ESC
                </kbd>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-2">
                {query === "" && !loading && (
                    <div className="p-2">
                        <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Quick actions</p>
                        <div className="grid gap-1">
                            <button
                                onClick={() => navigate("/products")}
                                className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition hover:bg-primary/10 hover:text-primary group"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-muted group-hover:bg-primary/20">
                                    <Zap className="h-4 w-4" />
                                </div>
                                <span className="font-medium">Browse all plans</span>
                            </button>
                            <button
                                onClick={() => navigate("/cart")}
                                className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition hover:bg-primary/10 hover:text-primary group"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-muted group-hover:bg-primary/20">
                                    <ShoppingCart className="h-4 w-4" />
                                </div>
                                <span className="font-medium">Review cart</span>
                            </button>
                        </div>
                    </div>
                )}

                {loading ? (
                  <div className="p-10 text-center">
                    <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p className="mt-2 text-xs text-muted-foreground">Fetching inventory...</p>
                  </div>
                ) : (
                  <div className="grid gap-1">
                    {filteredProducts.length > 0 ? (
                      <>
                        <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          {query === "" ? "Trending plans" : "Search results"}
                        </p>
                        {filteredProducts.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => navigate(`/products/${p.slug}`)}
                            className="flex items-center justify-between rounded-2xl px-3 py-3 text-sm transition hover:bg-primary/10 group text-left"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-muted">
                                    <img src={p.imageUrls?.[0] || ""} alt={p.name} className="h-full w-full object-cover" />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-semibold truncate">{p.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{p.categoryName}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-primary">{formatCurrency(p.price)}</span>
                                <Command className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </button>
                        ))}
                      </>
                    ) : query !== "" && !loading && (
                      <div className="p-8 text-center text-sm text-muted-foreground">
                        No plans found for "<span className="font-bold text-foreground">{query}</span>"
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-border/50 bg-muted/30 px-4 py-3 text-[10px] text-muted-foreground">
                <div className="flex gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="rounded border border-border/50 bg-muted px-1">↑↓</kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="rounded border border-border/50 bg-muted px-1">⏎</kbd>
                    Select
                  </span>
                </div>
                <div>
                    Built by <span className="font-bold text-primary">{APP_NAME}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
