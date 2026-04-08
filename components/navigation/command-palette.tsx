"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Command, Search, ShoppingCart, Sparkles, X } from "lucide-react";
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
    const down = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
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

  const filteredProducts = products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.categoryName.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 5);

  const navigate = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      router.push(href);
    },
    [router]
  );

  return (
    <AnimatePresence>
      {open ? (
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
            className="relative mx-4 w-full max-w-xl overflow-hidden rounded-[2rem] border border-border/80 bg-[hsl(var(--surface)/0.96)] shadow-[0_28px_70px_rgba(15,23,42,0.12)] backdrop-blur-2xl dark:bg-[hsl(var(--surface)/0.97)]"
          >
            <div className="flex items-center border-b border-border/50 px-4">
              <Search className="mr-3 h-5 w-5 text-muted-foreground" />
              <input
                autoFocus
                placeholder="Search products, categories, or pages..."
                className="h-14 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") setOpen(false);
                }}
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label="Close search"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {query === "" && !loading ? (
                <div className="p-2">
                  <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Quick actions
                  </p>
                  <div className="grid gap-1">
                    <button
                      type="button"
                      onClick={() => navigate("/products")}
                      className="group flex items-center gap-3 rounded-2xl border border-transparent px-3 py-2.5 text-sm transition hover:border-border/60 hover:bg-foreground/5 hover:text-foreground"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-muted/60 group-hover:bg-background">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <span className="font-medium">Browse catalog</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate("/cart")}
                      className="group flex items-center gap-3 rounded-2xl border border-transparent px-3 py-2.5 text-sm transition hover:border-border/60 hover:bg-foreground/5 hover:text-foreground"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-muted/60 group-hover:bg-background">
                        <ShoppingCart className="h-4 w-4" />
                      </div>
                      <span className="font-medium">Review cart</span>
                    </button>
                  </div>
                </div>
              ) : null}

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
                        {query === "" ? "Trending products" : "Search results"}
                      </p>
                      {filteredProducts.map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => navigate(`/products/${product.slug}`)}
                          className="group flex items-center justify-between rounded-2xl border border-transparent px-3 py-3 text-left text-sm transition hover:border-border/60 hover:bg-foreground/5"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-muted">
                              {product.imageUrls?.[0] ? (
                                <img src={product.imageUrls[0]} alt={product.name} className="h-full w-full object-cover" />
                              ) : null}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-semibold">{product.name}</p>
                              <p className="truncate text-xs text-muted-foreground">{product.categoryName}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-primary">{formatCurrency(product.price)}</span>
                            <Command className="h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                          </div>
                        </button>
                      ))}
                    </>
                  ) : query !== "" ? (
                    <div className="p-8 text-center text-sm text-muted-foreground">
                      No products found for <span className="font-bold text-foreground">{query}</span>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-border/50 bg-muted/20 px-4 py-3 text-[10px] text-muted-foreground">
              <div className="flex gap-4">
                <span>Press Ctrl/Cmd + K to open</span>
                <span>Press Esc to close</span>
              </div>
              <div>
                Built by <span className="font-bold text-primary">{APP_NAME}</span>
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
