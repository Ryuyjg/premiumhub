import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-11 w-full rounded-2xl border border-border/80 bg-white/80 px-4 text-sm shadow-[0_1px_0_rgba(15,23,42,0.03)] outline-none transition placeholder:text-muted-foreground/80 hover:border-primary/30 focus:border-primary focus:ring-4 focus:ring-primary/15 dark:bg-white/5",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
