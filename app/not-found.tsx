import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-6 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">404</p>
      <h1 className="text-4xl font-semibold tracking-tight">That product is not available right now.</h1>
      <p className="max-w-xl text-muted-foreground">
        It may have been removed, renamed, or is not live yet. Head back to the catalog to explore available items.
      </p>
      <Link
        href="/products"
        className="inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90"
      >
        Browse catalog
      </Link>
    </div>
  );
}
