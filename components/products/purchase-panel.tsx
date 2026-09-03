"use client";

import Link from "next/link";
import { useState } from "react";
import { MessageCircle, Minus, Plus, ShieldCheck } from "lucide-react";
import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { getWhatsAppOrderUrl } from "@/lib/whatsapp";
import { formatCurrency } from "@/lib/utils";

export function CheckoutButton({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const isOutOfStock = Boolean(product.isOutOfStock) || product.stockCount === 0;
  const stockCount = product.stockCount;

  const unitPrice = product.salePrice || product.price;
  const totalPrice = unitPrice * quantity;

  function handleOrderNow() {
    if (isOutOfStock) return;
    const url = getWhatsAppOrderUrl(product, quantity);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="grid gap-4">
      {/* Stock Status Badge */}
      <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/80 px-4 py-3">
        <span className="text-xs font-medium text-muted-foreground">Availability</span>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
          isOutOfStock
            ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30"
            : stockCount && stockCount <= 5
            ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
            : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
        }`}>
          <span className={`h-2 w-2 rounded-full ${
            isOutOfStock ? "bg-rose-500" : stockCount && stockCount <= 5 ? "bg-amber-500" : "bg-emerald-500"
          }`} />
          {isOutOfStock
            ? "Out of stock"
            : stockCount !== undefined
            ? `⚡ ${stockCount} left in stock`
            : "In stock"}
        </span>
      </div>

      {/* Quantity Selector */}
      {!isOutOfStock ? (
        <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/80 px-4 py-3">
          <span className="text-xs font-medium text-muted-foreground">Select Quantity</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-muted/50 text-foreground transition hover:bg-muted disabled:opacity-40"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-6 text-center font-bold">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => (stockCount ? Math.min(stockCount, q + 1) : q + 1))}
              disabled={stockCount !== undefined && quantity >= stockCount}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-muted/50 text-foreground transition hover:bg-muted disabled:opacity-40"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}

      {/* Price Summary */}
      <div className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Price ({quantity} item{quantity > 1 ? "s" : ""})</span>
          <span className="text-xl font-extrabold text-foreground">{formatCurrency(totalPrice)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
        <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
        <span>Direct order via WhatsApp. Fast delivery & instant support.</span>
      </div>

      {/* Order Now Button */}
      <Button
        onClick={handleOrderNow}
        className="h-14 w-full gap-2.5 rounded-2xl bg-emerald-600 text-base font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700"
        disabled={isOutOfStock}
      >
        <MessageCircle className="h-5 w-5 fill-white text-emerald-600" />
        {isOutOfStock ? "Out of Stock" : "Order Now on WhatsApp"}
      </Button>

      <div className="flex flex-wrap gap-3 pt-2 text-xs font-semibold text-muted-foreground justify-center">
        <Link href="/refund-policy" className="transition-colors hover:text-primary">
          Refund policy
        </Link>
        <span>•</span>
        <Link href="/faq" className="transition-colors hover:text-primary">
          FAQ
        </Link>
        <span>•</span>
        <Link href="/contact" className="transition-colors hover:text-primary">
          Contact support
        </Link>
      </div>
    </div>
  );
}
