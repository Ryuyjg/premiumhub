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
      <div className="section-shell mb-8 p-7 md:p-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">{title}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">{description}</p>
      </div>

      <div className="section-shell p-7 md:p-8">
        {children}
      </div>
    </div>
  );
}
