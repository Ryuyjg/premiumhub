import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "relative overflow-hidden border border-primary/10 bg-primary text-primary-foreground shadow-lg shadow-primary/20 before:absolute before:inset-0 before:-translate-x-full before:bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.25),transparent)] before:transition-transform before:duration-700 hover:bg-primary/90 hover:before:translate-x-full dark:shadow-primary/10",
  secondary:
    "relative overflow-hidden border border-foreground/10 bg-foreground text-background hover:bg-foreground/90",
  ghost: "border border-transparent bg-transparent text-foreground hover:border-border/70 hover:bg-foreground/5",
  danger: "border border-rose-500/20 bg-rose-600 text-white hover:bg-rose-700"
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold transition duration-300 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-60",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
