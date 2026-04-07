import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <div className="container py-20">
      <div className="mx-auto max-w-xl rounded-3xl border border-border/60 bg-card p-8 text-center shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Checkout status</p>
        <h1 className="mt-3 text-3xl font-black">Online payment flow is being refreshed</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This screen is now reserved for the upcoming INR UroPay flow.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/dashboard" className="btn-primary">
            Open dashboard
          </Link>
          <Link href="/products" className="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-muted">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
