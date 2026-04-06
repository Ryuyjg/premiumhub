export default function Loading() {
  return (
    <div className="container py-16">
      <div className="animate-pulse space-y-8">
        {/* Header skeleton */}
        <div className="space-y-3">
          <div className="h-4 w-32 rounded-full bg-primary/10" />
          <div className="h-10 w-full max-w-lg rounded-2xl bg-foreground/8" />
          <div className="h-5 w-72 rounded-full bg-foreground/6" />
        </div>

        {/* Stat cards skeleton */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 rounded-[1.75rem] bg-foreground/6" />
          ))}
        </div>

        {/* Product grid skeleton */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4 rounded-[1.75rem] border border-border/40 p-4">
              <div className="aspect-[16/10] rounded-2xl bg-foreground/8" />
              <div className="space-y-2 px-2">
                <div className="h-5 w-3/4 rounded-full bg-foreground/8" />
                <div className="h-4 w-1/2 rounded-full bg-foreground/6" />
                <div className="h-4 w-2/3 rounded-full bg-foreground/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
