import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
  [key: string]: unknown;
}) {
  return (
    <div
      className={cn(
        "surface rounded-[1.75rem] p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
