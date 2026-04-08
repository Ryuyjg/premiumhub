import type { ReactNode } from "react";

export function ContentPageShell({
  eyebrow,
  title,
  description,
  children
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="container py-12 md:py-16">
      <div className="mb-8 rounded-[2rem] border border-border/70 bg-white/78 p-7 shadow-[0_20px_48px_rgba(15,23,42,0.05)] backdrop-blur-md dark:bg-white/4 md:p-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">{title}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">{description}</p>
      </div>

      <div className="rounded-[2rem] border border-border/70 bg-white/78 p-7 shadow-[0_20px_48px_rgba(15,23,42,0.05)] backdrop-blur-md dark:bg-white/4 md:p-8">
        {children}
      </div>
    </div>
  );
}
