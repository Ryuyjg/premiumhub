import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <div className="container py-20">
      <div className="mx-auto max-w-xl rounded-[2rem] border border-border/70 bg-card p-8 text-center shadow-[0_20px_48px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Checkout status</p>
        <h1 className="mt-3 text-3xl font-black">Payment successful</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          Your order has been received. Open your dashboard to view delivery updates, access details, and support messages.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/dashboard" className="btn-primary">
            Open dashboard
          </Link>
          <Link href="/products" className="btn-ghost !h-10 !rounded-xl !px-4">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
