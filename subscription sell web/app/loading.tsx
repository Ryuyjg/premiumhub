export default function Loading() {
  return (
    <div className="container py-16">
      <div className="animate-pulse space-y-6">
        <div className="h-6 w-48 rounded-full bg-foreground/10" />
        <div className="h-12 w-full max-w-3xl rounded-3xl bg-foreground/10" />
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-80 rounded-[1.75rem] bg-foreground/10" />
          ))}
        </div>
      </div>
    </div>
  );
}
