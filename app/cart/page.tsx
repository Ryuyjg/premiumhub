"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useAppStore } from "@/store/use-app-store";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const cartItems = useAppStore((state) => state.cartItems);
  const removeFromCart = useAppStore((state) => state.removeFromCart);
  const clearCart = useAppStore((state) => state.clearCart);

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="container py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Your cart</h1>
          <p className="mt-1 text-sm text-muted-foreground">{cartItems.length} item(s)</p>
        </div>
        {cartItems.length > 0 ? (
          <Button type="button" variant="ghost" onClick={clearCart}>
            Clear cart
          </Button>
        ) : null}
      </div>

      {cartItems.length === 0 ? (
        <div className="surface rounded-[1.5rem] p-8 text-center">
          <p className="text-muted-foreground">Cart is empty. Add plans from products page.</p>
          <Link href="/products" className="mt-4 inline-block text-sm font-semibold text-primary">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.productId} className="surface flex items-center gap-4 rounded-[1.5rem] p-4">
                <div className="relative h-20 w-28 overflow-hidden rounded-xl">
                  <Image
                    src={item.imageUrl || "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=1200&q=80"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.categoryName}</p>
                  <p className="mt-1 text-sm font-semibold">{formatCurrency(item.price)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(item.productId)}
                  className="rounded-full border border-rose-500/30 p-2 text-rose-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="surface h-fit rounded-[1.5rem] p-5">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="mt-1 text-3xl font-semibold">{formatCurrency(total)}</p>
            <p className="mt-3 text-xs text-muted-foreground">Checkout is per product. Open a plan and click Buy now.</p>
            <div className="mt-4 grid gap-2">
              {cartItems.map((item) => (
                <Link
                  key={item.productId}
                  href={`/products/${item.slug}`}
                  className="rounded-full bg-primary px-4 py-2 text-center text-sm font-semibold text-white"
                >
                  Checkout {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
