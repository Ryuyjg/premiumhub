import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "danger";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "relative overflow-hidden bg-gradient-to-r from-[hsl(var(--gradient-mid))] via-[hsl(var(--gradient-start))] to-accent text-white shadow-[0_18px_36px_rgba(37,99,235,0.22)] " +
    "before:absolute before:inset-0 before:-translate-x-full before:bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.22),transparent)] " +
    "before:transition-transform before:duration-700 hover:shadow-[0_22px_40px_rgba(37,99,235,0.28)] hover:-translate-y-px hover:before:translate-x-full",
  secondary:
    "border border-primary/20 bg-primary/10 text-foreground shadow-[0_12px_28px_rgba(15,23,42,0.06)] hover:bg-primary/14",
  ghost:
    "border border-transparent bg-transparent text-foreground hover:border-border/60 hover:bg-foreground/5",
  outline:
    "control-surface hover:border-primary/24 hover:bg-primary/10",
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
