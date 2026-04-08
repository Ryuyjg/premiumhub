import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <div className="container py-20">
      <div className="mx-auto max-w-xl rounded-3xl border border-border/60 bg-card p-8 text-center shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Payment cancelled</p>
        <h1 className="mt-3 text-3xl font-black">Checkout was not completed</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          No worries. Your cart is still available, and USDT checkout will be connected again when the next gateway is ready.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/cart" className="btn-primary">
            Retry checkout
          </Link>
          <Link href="/products" className="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-muted">
            Browse products
          </Link>
        </div>
      </div>
    </div>
  );
}
