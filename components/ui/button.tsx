import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "danger";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "relative overflow-hidden bg-gradient-to-r from-foreground via-[hsl(var(--gradient-start))] to-accent text-white shadow-[0_16px_32px_rgba(15,23,42,0.18)] " +
    "before:absolute before:inset-0 before:-translate-x-full before:bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.22),transparent)] " +
    "before:transition-transform before:duration-700 hover:shadow-[0_20px_38px_rgba(15,23,42,0.22)] hover:-translate-y-px hover:before:translate-x-full",
  secondary:
    "border border-foreground/10 bg-foreground text-background shadow-[0_12px_28px_rgba(15,23,42,0.14)] hover:bg-foreground/92",
  ghost:
    "border border-transparent bg-transparent text-foreground hover:border-border/60 hover:bg-foreground/5",
  outline:
    "border border-border/70 bg-white/82 text-foreground hover:border-primary/24 hover:bg-primary/4 dark:bg-white/5",
  danger:
    "border border-rose-500/20 bg-rose-600 text-white shadow-md shadow-rose-500/20 hover:bg-rose-700"
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold tracking-[0.01em] transition-all duration-200",
          "active:scale-[0.975] disabled:cursor-not-allowed disabled:opacity-55",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
