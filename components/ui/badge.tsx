import { cn } from "@/lib/utils";

export function Badge({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-primary/25 bg-primary/88 px-3 py-1 text-xs font-semibold text-[hsl(var(--foreground))] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]",
        className
      )}
    >
      {children}
    </span>
  );
}
